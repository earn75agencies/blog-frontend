import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { trackShare } from '../../api/shareAPI';
import { openModal, addNotification } from '../../store/slices/uiSlice';

const ShareButton = ({ postId }) => {
  const dispatch = useDispatch();
  const [isSharing, setIsSharing] = useState(false);
  
  const handleShare = async (platform) => {
    setIsSharing(true);
    
    try {
      await trackShare(postId, platform);
      dispatch(
        addNotification({
          type: 'success',
          message: 'Post shared successfully',
        })
      );
    } catch (error) {
      dispatch(
        addNotification({
          type: 'danger',
          message: error.message || 'Failed to share post',
        })
      );
    } finally {
      setIsSharing(false);
    }
  };
  
  const openShareModal = () => {
    dispatch(openModal({ modalType: 'share', data: { postId } }));
  };
  
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Check out this post',
          text: 'I thought you might like this post',
          url: `${window.location.origin}/posts/${postId}`,
        });
        handleShare('native');
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Error sharing:', error);
        }
      }
    } else {
      openShareModal();
    }
  };
  
  return (
    <div className="share-button-container">
      <button
        onClick={handleNativeShare}
        className="share-button"
        disabled={isSharing}
        aria-label="Share post"
      >
        <i className="fas fa-share-alt"></i>
        <span>Share</span>
      </button>
      
      {/* Alternative share options when native share is not available */}
      {!navigator.share && (
        <div className="share-options">
          <button
            onClick={() => handleShare('facebook')}
            className="share-option facebook"
            disabled={isSharing}
            aria-label="Share on Facebook"
          >
            <i className="fab fa-facebook-f"></i>
          </button>
          
          <button
            onClick={() => handleShare('twitter')}
            className="share-option twitter"
            disabled={isSharing}
            aria-label="Share on Twitter"
          >
            <i className="fab fa-twitter"></i>
          </button>
          
          <button
            onClick={() => handleShare('linkedin')}
            className="share-option linkedin"
            disabled={isSharing}
            aria-label="Share on LinkedIn"
          >
            <i className="fab fa-linkedin-in"></i>
          </button>
          
          <button
            onClick={() => handleShare('whatsapp')}
            className="share-option whatsapp"
            disabled={isSharing}
            aria-label="Share on WhatsApp"
          >
            <i className="fab fa-whatsapp"></i>
          </button>
          
          <button
            onClick={() => handleShare('copy')}
            className="share-option copy"
            disabled={isSharing}
            aria-label="Copy link"
          >
            <i className="fas fa-link"></i>
          </button>
        </div>
      )}
    </div>
  );
};

export default ShareButton;