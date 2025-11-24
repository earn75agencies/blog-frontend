// Export all API services
export { default as authAPI } from './authAPI';
export { default as userAPI } from './userAPI';
export { default as postAPI } from './postAPI';
export { default as commentAPI } from './commentAPI';
export { default as categoryAPI } from './categoryAPI';
export { default as tagAPI } from './tagAPI';
export { default as notificationAPI } from './notificationAPI';
export { default as analyticsAPI } from './analyticsAPI';
export { default as bookmarkAPI } from './bookmarkAPI';
export { default as searchAPI } from './searchAPI';
export { default as aiAPI } from './aiAPI';
export { default as paymentAPI } from './paymentAPI';
export { default as mediaAPI } from './mediaAPI';
export { default as noteAPI } from './noteAPI';
export { default as shareAPI } from './shareAPI';

// Re-export the base API instance
export { default as api } from './index';

// TypeScript type declarations
declare module '*.js' {
  const content: any;
  export default content;
}