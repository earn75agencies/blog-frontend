import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { postService } from '../services/post.service';

/**
 * Simple Post Creation Form Component
 * For testing API connectivity and post creation functionality
 */
export const PostCreationForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: 'Technology',
    tags: '',
    status: 'draft',
    seoTitle: '',
    seoDescription: '',
    seoKeywords: '',
  });
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title.trim()) {
      toast.error('Please enter a post title');
      return;
    }
    if (!formData.excerpt.trim()) {
      toast.error('Please enter a post excerpt');
      return;
    }
    if (!formData.content.trim()) {
      toast.error('Please enter post content');
      return;
    }
    if (formData.content.length < 100) {
      toast.error('Content must be at least 100 characters');
      return;
    }

    setLoading(true);
    try {
      // Prepare post data
      const postData = {
        title: formData.title,
        excerpt: formData.excerpt,
        content: formData.content,
        category: formData.category,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : [],
        status: formData.status as 'draft' | 'published' | 'archived',
        seoTitle: formData.seoTitle || formData.title,
        seoDescription: formData.seoDescription,
        seoKeywords: formData.seoKeywords ? formData.seoKeywords.split(',').map(kw => kw.trim()) : [],
      };

      // Call API
      const response = await postService.createPost(postData, image || undefined);
      
      if (response?._id) {
        toast.success('Post created successfully!');
        
        // Reset form
        setFormData({
          title: '',
          excerpt: '',
          content: '',
          category: 'Technology',
          tags: '',
          status: 'draft',
          seoTitle: '',
          seoDescription: '',
          seoKeywords: '',
        });
        setImage(null);
        setImagePreview(null);

        // Optionally redirect to post edit page
        setTimeout(() => {
          window.location.href = `/admin/posts/${response._id}`;
        }, 1500);
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to create post';
      toast.error(errorMessage);
      console.error('Post creation error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow">
      <h1 className="text-3xl font-bold mb-6">Create New Post</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Post Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter post title"
            disabled={loading}
          />
        </div>

        {/* Excerpt */}
        <div>
          <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-2">
            Post Excerpt *
          </label>
          <textarea
            id="excerpt"
            name="excerpt"
            value={formData.excerpt}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter post excerpt (short summary)"
            disabled={loading}
          />
          <p className="text-xs text-gray-500 mt-1">Max 500 characters</p>
        </div>

        {/* Content */}
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
            Post Content *
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            rows={10}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
            placeholder="Enter full post content (HTML supported)"
            disabled={loading}
          />
          <p className="text-xs text-gray-500 mt-1">Min 100 characters required</p>
        </div>

        {/* Featured Image */}
        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
            Featured Image
          </label>
          <input
            type="file"
            id="image"
            name="image"
            onChange={handleImageChange}
            accept="image/*"
            className="w-full"
            disabled={loading}
          />
          {imagePreview && (
            <div className="mt-4">
              <img
                src={imagePreview}
                alt="Preview"
                className="max-w-xs max-h-48 object-cover rounded"
              />
            </div>
          )}
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
            Category *
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
          >
            <option value="Technology">Technology</option>
            <option value="Business">Business</option>
            <option value="Lifestyle">Lifestyle</option>
            <option value="Travel">Travel</option>
            <option value="Food">Food</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Tags */}
        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
            Tags (comma-separated)
          </label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={formData.tags}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., react, typescript, web-development"
            disabled={loading}
          />
        </div>

        {/* SEO Fields */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">SEO Settings</h3>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="seoTitle" className="block text-sm font-medium text-gray-700 mb-2">
                SEO Title
              </label>
              <input
                type="text"
                id="seoTitle"
                name="seoTitle"
                value={formData.seoTitle}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter SEO title (max 70 chars)"
                disabled={loading}
              />
              <p className="text-xs text-gray-500 mt-1">{formData.seoTitle.length}/70</p>
            </div>

            <div>
              <label htmlFor="seoDescription" className="block text-sm font-medium text-gray-700 mb-2">
                SEO Description
              </label>
              <textarea
                id="seoDescription"
                name="seoDescription"
                value={formData.seoDescription}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter SEO description (max 160 chars)"
                disabled={loading}
              />
              <p className="text-xs text-gray-500 mt-1">{formData.seoDescription.length}/160</p>
            </div>

            <div>
              <label htmlFor="seoKeywords" className="block text-sm font-medium text-gray-700 mb-2">
                SEO Keywords (comma-separated)
              </label>
              <input
                type="text"
                id="seoKeywords"
                name="seoKeywords"
                value={formData.seoKeywords}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., keyword1, keyword2, keyword3"
                disabled={loading}
              />
            </div>
          </div>
        </div>

        {/* Status */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
            Post Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        {/* Submit Button */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition"
          >
            {loading ? 'Creating Post...' : 'Create Post'}
          </button>
          <button
            type="button"
            onClick={() => window.history.back()}
            disabled={loading}
            className="flex-1 px-6 py-3 bg-gray-300 text-gray-800 font-semibold rounded-lg hover:bg-gray-400 disabled:bg-gray-200 transition"
          >
            Cancel
          </button>
        </div>
      </form>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          💡 <strong>Tip:</strong> Posts can be saved as drafts and published later. Use the SEO fields to improve discoverability.
        </p>
      </div>
    </div>
  );
};

export default PostCreationForm;
