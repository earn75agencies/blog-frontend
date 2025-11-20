import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiMail } from 'react-icons/fi';
import toast from 'react-hot-toast';
import newsletterService from '../../services/newsletter.service';

const Newsletter = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    setIsSubmitting(true);

    try {
      await newsletterService.subscribe(email);
      toast.success('Successfully subscribed to newsletter!');
      setEmail('');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to subscribe. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card bg-gradient-to-br from-primary-500 to-primary-700 text-white">
      <div className="flex items-center gap-3 mb-4">
        <FiMail className="text-2xl" />
        <h3 className="text-xl font-bold">Newsletter</h3>
      </div>
      <p className="text-primary-100 mb-4">
        Subscribe to get the latest posts and updates delivered to your inbox.
      </p>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          className="w-full px-4 py-2 rounded-lg text-gray-900 mb-3"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-white text-primary-600 font-semibold py-2 rounded-lg hover:bg-primary-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Subscribing...' : 'Subscribe'}
        </button>
      </form>
    </div>
  );
};

export default Newsletter;

