import { useState } from 'react';
import { useQuery } from 'react-query';
import { useTranslation } from 'react-i18next';
import paymentService from '../services/payment.service';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Pagination from '../components/ui/Pagination';
import GidixPaymentInfo from '../components/payment/GidixPaymentInfo';
import { FiCreditCard, FiCheckCircle, FiXCircle, FiClock } from 'react-icons/fi';

interface Payment {
  _id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded' | 'cancelled';
  description: string;
  createdAt: string;
  method: string;
  paymentProcessor?: string;
  paymentRecipient?: string;
  supportContact?: string;
  processedBy?: string;
  organizationInfo?: {
    name: string;
    contactEmail: string;
    supportUrl: string;
    paymentPolicy: string;
  };
}

const PaymentsPage = () => {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed' | 'failed'>('all');

  const { data, isLoading } = useQuery(
    ['payments', page, statusFilter],
    () => paymentService.getPayments(page, 20, statusFilter === 'all' ? undefined : statusFilter),
    { enabled: true }
  );

  const payments = data?.data?.payments || [];
  const pagination = data?.data;
  const organizationInfo = data?.data?.organizationInfo;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner size="lg" variant="success" />
      </div>
    );
  }

  const statusIcons = {
    pending: <FiClock className="text-yellow-600" />,
    completed: <FiCheckCircle className="text-teal-600" />,
    failed: <FiXCircle className="text-red-600" />,
  };

  const statusBadges = {
    pending: <Badge variant="warning">Pending</Badge>,
    processing: <Badge variant="warning">Processing</Badge>,
    completed: <Badge variant="success">Completed</Badge>,
    failed: <Badge variant="danger">Failed</Badge>,
    refunded: <Badge variant="info">Refunded</Badge>,
    cancelled: <Badge variant="danger">Cancelled</Badge>,
  };

  const statusIconsWithProcessing = {
    ...statusIcons,
    processing: <FiClock className="text-yellow-600 animate-spin" />,
    refunded: <FiCheckCircle className="text-blue-600" />,
    cancelled: <FiXCircle className="text-red-600" />,
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Payment History</h1>
        <div className="flex gap-2">
          {(['all', 'pending', 'completed', 'failed'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-lg capitalize ${
                statusFilter === status ? 'bg-primary-600 text-white' : 'bg-gray-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Gidix Organization Info Banner */}
      <GidixPaymentInfo 
        organizationInfo={organizationInfo}
        className="mb-8"
      />

      {payments && payments.length > 0 ? (
        <>
          <div className="space-y-4">
            {payments.map((payment) => (
              <Card key={payment._id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gray-100 rounded-lg">
                      <FiCreditCard className="text-2xl text-gray-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{payment.description}</h3>
                      <p className="text-sm text-gray-500">
                        {new Date(payment.createdAt).toLocaleString()} • {payment.method}
                      </p>
                      {payment.transactionId && (
                        <p className="text-xs text-gray-400 mt-1">Transaction: {payment.transactionId}</p>
                      )}
                      {payment.paymentProcessor && (
                        <p className="text-xs text-blue-600 mt-1 font-medium">
                          Processed by: {payment.paymentProcessor}
                        </p>
                      )}
                      {payment.paymentRecipient && (
                        <p className="text-xs text-green-600 mt-1">
                          Recipient: {payment.paymentRecipient}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">
                      {payment.currency} {payment.amount.toFixed(2)}
                    </p>
                    <div className="flex items-center justify-end gap-2 mt-2">
                      {statusIconsWithProcessing[payment.status] || statusIcons.pending}
                      {statusBadges[payment.status as keyof typeof statusBadges] || statusBadges.pending}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          {pagination && pagination.totalPages > 1 && (
            <div className="mt-8">
              <Pagination
                currentPage={page}
                totalPages={pagination.totalPages}
                onPageChange={setPage}
              />
            </div>
          )}
        </>
       ) : (
        <div className="card text-center py-12">
          <FiCreditCard className="text-6xl text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg mb-4">No payments found.</p>
          <GidixPaymentInfo 
            className="max-w-md mx-auto"
          />
        </div>
      )}
    </div>
  );
};

export default PaymentsPage;

