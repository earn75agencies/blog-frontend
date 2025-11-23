import React from 'react';
import './Spinner.css';

const Spinner = ({ size = 'medium', center = true }) => {
  return (
    <div className={`spinner-container ${center ? 'center' : ''}`}>
      <div className={`spinner ${size}`}>
        <div className="spinner-circle"></div>
      </div>
    </div>
  );
};

export default Spinner;