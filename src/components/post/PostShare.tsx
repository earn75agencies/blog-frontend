import { useState } from 'react';
import { FiTwitter, FiFacebook, FiLink, FiMail } from 'react-icons/fi';

interface PostShareProps {
  postId: string;
  title: string;
  url?: string;
  className?: string;
}

const PostShare: React.FC<PostShareProps> = ({
  postId,
  title,
  url,
  className = '',
}) => {
  const [copied, setCopied] = useState(false);
  const shareUrl = url || `${window.location.origin}/posts/${postId}`;
  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(shareUrl);

  const shareOptions = [
    {
      icon: FiTwitter,
      label: 'Twitter',
      url: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    },
    {
      icon: FiFacebook,
      label: 'Facebook',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      icon: FiMail,
      label: 'Email',
      url: `mailto:?subject=${encodedTitle}&body=${encodedUrl}`,
    },
  ];

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-sm text-gray-600">Share:</span>
      {shareOptions.map((option, index) => (
        <a
          key={index}
          href={option.url}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          title={option.label}
        >
          <option.icon />
        </a>
      ))}
      <button
        onClick={copyToClipboard}
        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        title="Copy link"
      >
        <FiLink />
      </button>
      {copied && (
        <span className="text-sm text-teal-600">Copied!</span>
      )}
    </div>
  );
};

export default PostShare;

