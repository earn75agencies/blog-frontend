import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../store/authStore';
import userService from '../services/user.service';
import authService from '../services/auth.service';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Input from '../components/ui/Input';
import Textarea from '../components/ui/Textarea';
import Button from '../components/ui/Button';
import Tabs, { Tab } from '../components/ui/Tabs';
import { FiUser, FiLock, FiBell, FiGlobe } from 'react-icons/fi';

const SettingsPage = () => {
  const { t } = useTranslation();
  const { user, updateUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const profileForm = useForm({
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      bio: user?.bio || '',
    },
  });

  const passwordForm = useForm();

  const onSubmitProfile = async (data: any) => {
    if (!user) return;

    setIsLoading(true);
    try {
      const updatedUser = await userService.updateUser(user._id, data);
      updateUser(updatedUser);
      toast.success(t('user.profileUpdated'));
    } catch (error: any) {
      toast.error(error.message || t('common.error'));
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitPassword = async (data: any) => {
    setIsUpdatingPassword(true);
    try {
      await authService.updatePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      toast.success('Password updated successfully');
      passwordForm.reset();
    } catch (error: any) {
      toast.error(error.message || t('common.error'));
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">{t('nav.settings')}</h1>

      <Tabs defaultTab="profile" onTabChange={setActiveTab}>
        <Tab id="profile" label="Profile" icon={<FiUser />}>
          <div className="card">
            <form onSubmit={profileForm.handleSubmit(onSubmitProfile)} className="space-y-6">
              <h2 className="text-xl font-bold mb-4">Profile Settings</h2>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label={t('auth.firstName')}
                  {...profileForm.register('firstName')}
                />
                <Input
                  label={t('auth.lastName')}
                  {...profileForm.register('lastName')}
                />
              </div>

              <Textarea
                label={t('user.bio')}
                rows={4}
                {...profileForm.register('bio')}
                placeholder="Tell us about yourself..."
              />

              <div className="flex justify-end">
                <Button type="submit" isLoading={isLoading}>
                  {t('common.save')}
                </Button>
              </div>
            </form>
          </div>
        </Tab>

        <Tab id="password" label="Password" icon={<FiLock />}>
          <div className="card">
            <form onSubmit={passwordForm.handleSubmit(onSubmitPassword)} className="space-y-6">
              <h2 className="text-xl font-bold mb-4">Change Password</h2>

              <Input
                type="password"
                label="Current Password"
                {...passwordForm.register('currentPassword', { required: true })}
                placeholder="Enter current password"
              />

              <Input
                type="password"
                label="New Password"
                {...passwordForm.register('newPassword', { required: true, minLength: 6 })}
                placeholder="Enter new password"
              />

              <Input
                type="password"
                label="Confirm New Password"
                {...passwordForm.register('confirmPassword', {
                  required: true,
                  validate: (value) => value === passwordForm.watch('newPassword') || 'Passwords do not match',
                })}
                placeholder="Confirm new password"
              />

              <div className="flex justify-end">
                <Button type="submit" isLoading={isUpdatingPassword}>
                  Update Password
                </Button>
              </div>
            </form>
          </div>
        </Tab>

        <Tab id="notifications" label="Notifications" icon={<FiBell />}>
          <div className="card">
            <h2 className="text-xl font-bold mb-4">Notification Settings</h2>
            <p className="text-gray-600">Notification preferences coming soon...</p>
          </div>
        </Tab>

        <Tab id="language" label="Language" icon={<FiGlobe />}>
          <div className="card">
            <h2 className="text-xl font-bold mb-4">Language Settings</h2>
            <p className="text-gray-600">Language preferences are managed via the language selector in the header.</p>
          </div>
        </Tab>
      </Tabs>
    </div>
  );
};

export default SettingsPage;

