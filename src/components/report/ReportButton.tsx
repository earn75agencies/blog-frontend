import { useState } from 'react';
import { FiFlag } from 'react-icons/fi';
import ReportModal from './ReportModal';

interface ReportButtonProps {
  type: 'post' | 'comment' | 'user';
  itemId: string;
  className?: string;
  onReported?: () => void;
}

const ReportButton: React.FC<ReportButtonProps> = ({
  type,
  itemId,
  className = '',
  onReported,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className={`flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors ${className}`}
        title={`Report ${type}`}
      >
        <FiFlag />
        <span className="text-sm">Report</span>
      </button>
      <ReportModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        type={type}
        reportedItemId={itemId}
        onReported={onReported}
      />
    </>
  );
};

export default ReportButton;

