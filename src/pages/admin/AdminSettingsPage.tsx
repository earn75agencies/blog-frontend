import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useTranslation } from 'react-i18next';
import adminService from '../../services/admin.service';
import { Settings } from '../../types';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import Switch from '../../components/ui/Switch';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';

const AdminSettingsPage = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { register, handleSubmit, formState: { errors }, reset } = useForm<Settings>();

  const { data: settings, isLoading } = useQuery('adminSettings', () =>
    adminService.getSettings()
  );

  const updateMutation = useMutation(
    (data: Partial<Settings>) => adminService.updateSettings(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('adminSettings');
        toast.success('Settings updated successfully');
      },
      onError: (error: any) => {
        toast.error(error.message || 'Failed to update settings');
      },
    }
  );

  useEffect(() => {
    if (settings) {
      reset(settings);
    }
  }, [settings, reset]);

  const onSubmit = (data: Partial<Settings>) => {
    updateMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Site Settings</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* General Settings */}
        <div className="card">
          <h2 className="text-xl font-bold mb-4">General Settings</h2>
          <div className="space-y-4">
            <Input
              label="Site Name"
              {...register('siteName')}
              defaultValue={settings?.siteName}
            />
            <Textarea
              label="Site Description"
              rows={3}
              {...register('siteDescription')}
              defaultValue={settings?.siteDescription}
            />
            <Input
              label="Default Language"
              {...register('defaultLanguage')}
              defaultValue={settings?.defaultLanguage}
            />
          </div>
        </div>

        {/* Registration Settings */}
        <div className="card">
          <h2 className="text-xl font-bold mb-4">Registration Settings</h2>
          <div className="space-y-4">
            <Switch
              label="Allow Registration"
              {...register('allowRegistration')}
              defaultChecked={settings?.allowRegistration}
            />
            <Switch
              label="Require Email Verification"
              {...register('requireEmailVerification')}
              defaultChecked={settings?.requireEmailVerification}
            />
          </div>
        </div>

        {/* Comment Settings */}
        <div className="card">
          <h2 className="text-xl font-bold mb-4">Comment Settings</h2>
          <div className="space-y-4">
            <Switch
              label="Allow Comments"
              {...register('allowComments')}
              defaultChecked={settings?.allowComments}
            />
            <Switch
              label="Moderate Comments"
              {...register('moderateComments')}
              defaultChecked={settings?.moderateComments}
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button type="submit" isLoading={updateMutation.isLoading}>
            Save Settings
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettingsPage;

