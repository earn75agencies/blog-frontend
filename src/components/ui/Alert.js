import React from 'react';
import { useDispatch } from 'react-redux';
import { removeNotification } from '../../store/slices/uiSlice';
import './Alert.css';

const Alert = ({ variant = 'info', children, dismissible = true, id }) => {
  const dispatch = useDispatch();
  
  const handleDismiss = () => {
    if (id) {
      dispatch(removeNotification(id));
    }
  };
  
  return (
    <div className={`alert alert-${variant}`}>
      <div className="alert-content">
        {children}
      </div>
      
      {dismissible && (
        <button
          onClick={handleDismiss}
          className="alert-close"
          aria-label="Dismiss alert"
        >
          <i className="fas fa-times"></i>
        </button>
      )}
    </div>
  );
};

export default Alert;