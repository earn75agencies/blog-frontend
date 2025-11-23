import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { bulkDeletePosts, bulkUpdatePosts } from '../../store/slices/postsSlice';
import { addNotification } from '../../store/slices/uiSlice';

const BulkActions = ({ selectedPosts, onClearSelection }) => {
  const dispatch = useDispatch();
  const [action, setAction] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handleBulkAction = async () => {
    if (!action || selectedPosts.length === 0) return;
    
    setIsProcessing(true);
    
    try {
      if (action === 'delete') {
        await dispatch(bulkDeletePosts(selectedPosts)).unwrap();
        dispatch(
          addNotification({
            type: 'success',
            message: `${selectedPosts.length} posts deleted successfully`,
          })
        );
      } else {
        await dispatch(bulkUpdatePosts({ postIds: selectedPosts, updateData: { status: action } })).unwrap();
        dispatch(
          addNotification({
            type: 'success',
            message: `${selectedPosts.length} posts updated to ${action}`,
          })
        );
      }
      
      onClearSelection();
      setAction('');
    } catch (error) {
      dispatch(
        addNotification({
          type: 'danger',
          message: error.message || 'Failed to perform bulk action',
        })
      );
    } finally {
      setIsProcessing(false);
    }
  };
  
  if (selectedPosts.length === 0) return null;
  
  return (
    <div className="bulk-actions">
      <span className="selected-count">
        {selectedPosts.length} post{selectedPosts.length > 1 ? 's' : ''} selected
      </span>
      
      <div className="bulk-actions-controls">
        <select
          value={action}
          onChange={(e) => setAction(e.target.value)}
          className="bulk-action-select"
        >
          <option value="">Select action</option>
          <option value="published">Publish</option>
          <option value="draft">Set as Draft</option>
          <option value="archived">Archive</option>
          <option value="delete">Delete</option>
        </select>
        
        <button
          onClick={handleBulkAction}
          disabled={!action || isProcessing}
          className="btn btn-primary bulk-action-btn"
        >
          {isProcessing ? 'Processing...' : 'Apply'}
        </button>
        
        <button
          onClick={onClearSelection}
          className="btn btn-secondary clear-selection-btn"
        >
          Clear Selection
        </button>
      </div>
    </div>
  );
};

export default BulkActions;