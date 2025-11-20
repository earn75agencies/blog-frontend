import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../store/authStore';
import userService from '../services/user.service';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { FiUser, FiMail, FiEdit2, FiSave, FiX } from 'react-icons/fi';

interface ProfileFormData {
  firstName?: string;
  lastName?: string;
  bio?: string;
}

const ProfilePage = () => {
  const { t } = useTranslation();
  const { user, updateUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileFormData>({
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      bio: user?.bio || '',
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    if (!user) return;

    setIsLoading(true);
    try {
      const updatedUser = await userService.updateUser(user._id, data);
      updateUser(updatedUser);
      setIsEditing(false);
      toast.success(t('user.profileUpdated'));
    } catch (error: any) {
      toast.error(error.message || t('common.error'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    reset();
    setIsEditing(false);
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">{t('user.profile')}</h1>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="btn btn-outline flex items-center gap-2"
            >
              <FiEdit2 />
              {t('user.editProfile')}
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleCancel}
                className="btn btn-secondary flex items-center gap-2"
              >
                <FiX />
                {t('common.cancel')}
              </button>
              <button
                onClick={handleSubmit(onSubmit)}
                disabled={isLoading}
                className="btn btn-primary flex items-center gap-2"
              >
                {isLoading ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <>
                    <FiSave />
                    {t('common.save')}
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        <div className="flex items-start gap-6 mb-6">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.username}
              className="w-24 h-24 rounded-full object-cover"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 text-4xl font-bold">
              {user.username.charAt(0).toUpperCase()}
            </div>
          )}

          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <FiUser className="text-gray-400" />
              <div>
                <p className="font-semibold text-lg">{user.username}</p>
                <p className="text-gray-500">{user.email}</p>
              </div>
            </div>

            {isEditing ? (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {t('auth.firstName')}
                    </label>
                    <input
                      type="text"
                      {...register('firstName')}
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {t('auth.lastName')}
                    </label>
                    <input
                      type="text"
                      {...register('lastName')}
                      className="input"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">{t('user.bio')}</label>
                  <textarea
                    {...register('bio')}
                    className="textarea"
                    rows={4}
                    placeholder="Tell us about yourself..."
                  />
                </div>
              </form>
            ) : (
              <>
                {(user.firstName || user.lastName) && (
                  <p className="text-gray-700 mb-2">
                    {user.firstName} {user.lastName}
                  </p>
                )}
                {user.bio && (
                  <p className="text-gray-700">{user.bio}</p>
                )}
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-6 text-gray-600 pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <FiMail />
            <span>{user.email}</span>
          </div>
          <div>
            <span className="text-sm">Role: </span>
            <span className="font-semibold capitalize">{user.role}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

