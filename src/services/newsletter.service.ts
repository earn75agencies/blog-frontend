import apiService from './api.service';

class NewsletterService {
  async subscribe(email: string, tags?: string[]) {
    const response = await apiService.post('/newsletter/subscribe', {
      email,
      tags,
    });
    return response.data;
  }

  async unsubscribe(email?: string, token?: string) {
    const response = await apiService.post('/newsletter/unsubscribe', {
      email,
      token,
    });
    return response.data;
  }

  async getStatus(email: string) {
    const response = await apiService.get('/newsletter/status', {
      params: { email },
    });
    return response.data;
  }
}

export default new NewsletterService();
