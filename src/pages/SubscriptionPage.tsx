import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-hot-toast';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Badge from '../components/ui/Badge';
import { FiCheck, FiStar, FiZap } from 'react-icons/fi';
import subscriptionService, { SubscriptionPlan } from '../services/subscription.service';

const SubscriptionPage = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const { data: plans, isLoading } = useQuery<SubscriptionPlan[]>('subscriptionPlans', async () => {
    return await subscriptionService.getPlans();
  });

  const { data: currentSubscription } = useQuery('currentSubscription', async () => {
    return await subscriptionService.getCurrentSubscription();
  });

  const subscribeMutation = useMutation(async (planId: string) => {
    return await subscriptionService.subscribe({ planId, autoRenew: true });
  }, {
    onSuccess: () => {
      toast.success('Subscription activated successfully!');
      // Refetch current subscription
      queryClient.invalidateQueries('currentSubscription');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to activate subscription';
      toast.error(message);
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner size="lg" variant="info" />
      </div>
    );
  }

  const handleSubscribe = (planId: string) => {
    setSelectedPlan(planId);
    subscribeMutation.mutate(planId);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
        <p className="text-gray-600 text-lg">Select the perfect plan for your needs</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans?.map((plan) => (
          <Card
            key={plan._id}
            className={`relative p-8 ${plan.popular ? 'ring-2 ring-primary-500' : ''}`}
          >
            {plan.popular && (
              <Badge className="absolute top-4 right-4" variant="primary">
                <FiStar className="inline mr-1" />
                Popular
              </Badge>
            )}
            
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-4xl font-bold">{plan.currency}{plan.price}</span>
                <span className="text-gray-500">/{plan.interval}</span>
              </div>
            </div>

            <ul className="space-y-3 mb-8">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2">
                  <FiCheck className="text-teal-600 mt-1 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <Button
              variant={plan.popular ? 'primary' : 'outline'}
              className="w-full"
              onClick={() => handleSubscribe(plan._id)}
              disabled={subscribeMutation.isLoading && selectedPlan === plan._id}
            >
              {subscribeMutation.isLoading && selectedPlan === plan._id ? (
                <LoadingSpinner size="sm" variant="success" showText={false} />
              ) : (
                'Subscribe'
              )}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SubscriptionPage;

