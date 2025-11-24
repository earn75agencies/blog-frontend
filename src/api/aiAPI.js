import api from './index';

export const aiAPI = {
  // Generate content
  generateContent: (prompt, options = {}) => 
    api.post('/ai/generate', { prompt, ...options }),
  
  // Generate blog post
  generateBlogPost: (topic, options = {}) => 
    api.post('/ai/blog-post', { topic, ...options }),
  
  // Generate title suggestions
  generateTitles: (content, count = 5) => 
    api.post('/ai/titles', { content, count }),
  
  // Generate summary
  generateSummary: (content, length = 'medium') => 
    api.post('/ai/summary', { content, length }),
  
  // Generate tags
  generateTags: (content, count = 10) => 
    api.post('/ai/tags', { content, count }),
  
  // Improve writing
  improveWriting: (content, style = 'professional') => 
    api.post('/ai/improve', { content, style }),
  
  // Check grammar
  checkGrammar: (content) => 
    api.post('/ai/grammar', { content }),
  
  // Generate meta description
  generateMetaDescription: (content) => 
    api.post('/ai/meta-description', { content }),
  
  // Generate featured image prompt
  generateImagePrompt: (content) => 
    api.post('/ai/image-prompt', { content }),
  
  // Translate content
  translateContent: (content, targetLanguage) => 
    api.post('/ai/translate', { content, targetLanguage }),
  
  // Get AI usage statistics
  getUsageStats: () => api.get('/ai/usage'),
  
  // Advanced AI features
  advancedGenerate: (options) => 
    api.post('/ai/advanced/generate', options),
  
  // Get AI models available
  getModels: () => api.get('/ai/models'),
};

export default aiAPI;