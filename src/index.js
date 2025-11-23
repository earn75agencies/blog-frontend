import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux'; // Import Provider from react-redux
import './index.css';
import App from './App';
import { store } from './store'; // Import your configured Redux store

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* Wrap the App with the Provider to make the Redux store available */}
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);