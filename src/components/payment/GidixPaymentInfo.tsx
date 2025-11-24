import React from 'react';
import { FiShield, FiMail, FiExternalLink, FiCheckCircle } from 'react-icons/fi';

interface GidixPaymentInfoProps {
  organizationInfo?: {
    name: string;
    contactEmail: string;
    supportUrl: string;
    paymentPolicy: string;
  };
  className?: string;
}

const GidixPaymentInfo: React.FC<GidixPaymentInfoProps> = ({ 
  organizationInfo,
  className = ""
}) => {
  const defaultInfo = {
    name: 'Gidix Organization',
    contactEmail: 'payments@gidix.com',
    supportUrl: 'https://gidix.com/support',
    paymentPolicy: 'All payments are processed securely by Gidix Organization'
  };

  const info = organizationInfo || defaultInfo;

  return (
    <div className={`bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <FiShield className="text-blue-600 text-xl" />
            <h2 className="text-xl font-bold text-blue-900">
              Payment Processing by {info.name}
            </h2>
          </div>
          
          <p className="text-blue-700 mb-4 leading-relaxed">
            {info.paymentPolicy}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-sm">
              <FiMail className="text-blue-600 flex-shrink-0" />
              <span className="text-blue-700 font-medium">
                {info.contactEmail}
              </span>
            </div>
            
            <a 
              href={info.supportUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 underline transition-colors"
            >
              <FiExternalLink className="flex-shrink-0" />
              <span>Support Center</span>
            </a>
          </div>

          <div className="mt-4 flex items-center gap-2 text-xs text-blue-600">
            <FiCheckCircle className="flex-shrink-0" />
            <span>Secure payment processing powered by Gidix</span>
          </div>
        </div>
        
        <div className="bg-blue-100 rounded-lg p-4 ml-6 flex-shrink-0">
          <div className="text-2xl font-bold text-blue-900">Gidix</div>
          <div className="text-sm text-blue-700">Organization</div>
          <div className="text-xs text-blue-600 mt-1">Payment Processor</div>
        </div>
      </div>
    </div>
  );
};

export default GidixPaymentInfo;