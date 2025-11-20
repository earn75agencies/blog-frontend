import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { useQuery } from 'react-query';
import { useTranslation } from 'react-i18next';
import postService from '../services/post.service';
import categoryService from '../services/category.service';
import tagService from '../services/tag.service';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { FiUpload, FiX } from 'react-icons/fi';

interface PostFormData {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  status: 'draft' | 'published' | 'archived';
  featuredImage?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  isFeatured: boolean;
  allowComments: boolean;
}

const EditPostPage = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [featuredImageFile, setFeaturedImageFile] = useState<File | null>(null);
  const [featuredImagePreview, setFeaturedImagePreview] = useState<string | null>(null);

  const { data: post, isLoading: isLoadingPost } = useQuery(
    ['postById', id],
    () => postService.getPost(id!),
    { enabled: !!id }
  );

  const { data: categories } = useQuery('categories', () => categoryService.getCategories());
  const { data: popularTags } = useQuery('popularTags', () => tagService.getPopularTags(50));

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<PostFormData>();

  useEffect(() => {
    if (post) {
      reset({
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        category: post.category._id,
        tags: post.tags.map((tag) => tag.name),
        status: post.status,
        featuredImage: post.featuredImage,
        isFeatured: post.isFeatured,
        allowComments: post.allowComments,
      });
      if (post.featuredImage) {
        setFeaturedImagePreview(post.featuredImage);
      }
    }
  }, [post, reset]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFeaturedImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFeaturedImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFeaturedImageFile(null);
    setFeaturedImagePreview(null);
  };

  const onSubmit = async (data: PostFormData) => {
    if (!id) return;

    setIsLoading(true);
    try {
      await postService.updatePost(id, data, featuredImageFile || undefined);
      toast.success('Post updated successfully!');
      navigate(`/post/${post?.slug}`);
    } catch (error: any) {
      toast.error(error.message || t('common.error'));
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingPost) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">{t('post.noPosts')}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card">
        <h1 className="text-3xl font-bold mb-6">{t('post.editPost')}</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-2">{t('post.title')}</label>
            <input
              type="text"
              {...register('title', { required: 'Title is required' })}
              className="input"
            />
            {errors.title && (
              <p className="text-red-600 text-sm mt-1">{errors.title.message}</p>
            )}
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-sm font-medium mb-2">{t('post.excerpt')}</label>
            <textarea
              {...register('excerpt', { required: 'Excerpt is required' })}
              className="textarea"
              rows={3}
            />
            {errors.excerpt && (
              <p className="text-red-600 text-sm mt-1">{errors.excerpt.message}</p>
            )}
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium mb-2">{t('post.content')}</label>
            <textarea
              {...register('content', { required: 'Content is required' })}
              className="textarea"
              rows={20}
            />
            {errors.content && (
              <p className="text-red-600 text-sm mt-1">{errors.content.message}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium mb-2">{t('post.category')}</label>
            <select
              {...register('category', { required: 'Category is required' })}
              className="input"
            >
              <option value="">Select a category</option>
              {categories?.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-red-600 text-sm mt-1">{errors.category.message}</p>
            )}
          </div>

          {/* Tags */}
          {popularTags && (
            <div>
              <label className="block text-sm font-medium mb-2">{t('post.tags')}</label>
              <Controller
                name="tags"
                control={control}
                render={({ field }) => (
                  <div className="flex flex-wrap gap-2">
                    {popularTags.map((tag) => (
                      <label
                        key={tag._id}
                        className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full cursor-pointer hover:bg-primary-100 transition-colors"
                      >
                        <input
                          type="checkbox"
                          value={tag.name}
                          checked={field.value?.includes(tag.name)}
                          onChange={(e) => {
                            const value = field.value || [];
                            if (e.target.checked) {
                              field.onChange([...value, tag.name]);
                            } else {
                              field.onChange(value.filter((v) => v !== tag.name));
                            }
                          }}
                          className="rounded"
                        />
                        <span>#{tag.name}</span>
                      </label>
                    ))}
                  </div>
                )}
              />
            </div>
          )}

          {/* Featured Image */}
          <div>
            <label className="block text-sm font-medium mb-2">Featured Image</label>
            {featuredImagePreview ? (
              <div className="relative">
                <img
                  src={featuredImagePreview}
                  alt="Featured"
                  className="w-full h-64 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700"
                >
                  <FiX />
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <FiUpload className="text-4xl text-gray-400 mx-auto mb-4" />
                <label className="btn btn-outline cursor-pointer inline-flex items-center gap-2">
                  <FiUpload />
                  Upload Featured Image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium mb-2">{t('post.status')}</label>
            <select {...register('status')} className="input">
              <option value="draft">{t('post.draft')}</option>
              <option value="published">{t('post.published')}</option>
              <option value="archived">{t('post.archived')}</option>
            </select>
          </div>

          {/* Options */}
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                {...register('isFeatured')}
                className="rounded"
              />
              <span>{t('post.featured')}</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                {...register('allowComments')}
                className="rounded"
              />
              <span>{t('post.comments')}</span>
            </label>
          </div>

          {/* Submit */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary"
            >
              {isLoading ? <LoadingSpinner size="sm" /> : t('common.update')}
            </button>
            <button
              type="button"
              onClick={() => navigate(`/post/${post.slug}`)}
              className="btn btn-secondary"
            >
              {t('common.cancel')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPostPage;

