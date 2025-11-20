import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { FiMail, FiPhone, FiMapPin, FiSend } from 'react-icons/fi';
import apiService from '../services/api.service';
import { API_ENDPOINTS } from '../config/api.config';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const ContactPage = () => {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>();

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      const response = await apiService.post(API_ENDPOINTS.CONTACT.SEND(), data);

      if (response.status !== 'success') {
        throw new Error(response.message || 'Failed to send message');
      }

      toast.success(t('contact.success') || response.message || 'Message sent successfully!');
      reset();
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || t('contact.error') || 'Failed to send message. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">{t('contact.title') || 'Contact Us'}</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          {t('contact.subtitle') || 'Get in touch with us. We\'d love to hear from you!'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-6">
            <FiMail className="text-3xl text-primary-600 mb-4" />
            <h3 className="text-lg font-bold mb-2">{t('contact.email') || 'Email'}</h3>
            <p className="text-gray-600">support@gidix.com</p>
          </Card>

          <Card className="p-6">
            <FiPhone className="text-3xl text-primary-600 mb-4" />
            <h3 className="text-lg font-bold mb-2">{t('contact.phone') || 'Phone'}</h3>
            <p className="text-gray-600">+1 (555) 123-4567</p>
          </Card>

          <Card className="p-6">
            <FiMapPin className="text-3xl text-primary-600 mb-4" />
            <h3 className="text-lg font-bold mb-2">{t('contact.address') || 'Address'}</h3>
            <p className="text-gray-600">
              123 Creator Street<br />
              Digital City, DC 12345<br />
              United States
            </p>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card className="p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t('contact.name') || 'Name'} *
                </label>
                <input
                  type="text"
                  {...register('name', { required: t('contact.nameRequired') || 'Name is required' })}
                  className="input w-full"
                  placeholder={t('contact.namePlaceholder') || 'Your name'}
                />
                {errors.name && (
                  <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  {t('contact.email') || 'Email'} *
                </label>
                <input
                  type="email"
                  {...register('email', {
                    required: t('contact.emailRequired') || 'Email is required',
                    pattern: {
                      value: /^\S+@\S+\.\S+$/,
                      message: t('contact.emailInvalid') || 'Invalid email address',
                    },
                  })}
                  className="input w-full"
                  placeholder={t('contact.emailPlaceholder') || 'your@email.com'}
                />
                {errors.email && (
                  <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  {t('contact.subject') || 'Subject'} *
                </label>
                <input
                  type="text"
                  {...register('subject', { required: t('contact.subjectRequired') || 'Subject is required' })}
                  className="input w-full"
                  placeholder={t('contact.subjectPlaceholder') || 'Message subject'}
                />
                {errors.subject && (
                  <p className="text-red-600 text-sm mt-1">{errors.subject.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  {t('contact.message') || 'Message'} *
                </label>
                <textarea
                  {...register('message', {
                    required: t('contact.messageRequired') || 'Message is required',
                    minLength: {
                      value: 10,
                      message: t('contact.messageMinLength') || 'Message must be at least 10 characters',
                    },
                  })}
                  rows={6}
                  className="input w-full"
                  placeholder={t('contact.messagePlaceholder') || 'Your message...'}
                />
                {errors.message && (
                  <p className="text-red-600 text-sm mt-1">{errors.message.message}</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full"
                isLoading={isSubmitting}
              >
                <FiSend className="inline mr-2" />
                {t('contact.send') || 'Send Message'}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;

