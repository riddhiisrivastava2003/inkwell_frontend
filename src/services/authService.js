import apiClient from './api/client';

const authService = {
  async login(payload) {
    const { data } = await apiClient.post('/auth/login', payload);
    return data;
  },
  async register(payload) {
    const { data } = await apiClient.post('/auth/register', payload);
    return data;
  },
  async registerAdmin(payload) {
    const { data } = await apiClient.post('/auth/register-admin', payload);
    return data;
  },
  async validate(token) {
    const { data } = await apiClient.post('/auth/validate', null, {
      params: { token },
    });
    return data;
  },
  async getUsers() {
    const { data } = await apiClient.get('/auth/users');
    return data;
  },
  async searchUsers(username) {
    const { data } = await apiClient.get('/auth/search', { params: { username } });
    return data;
  },
  async getUserById(userId) {
    const { data } = await apiClient.get(`/auth/users/${userId}`);
    return data;
  },
  async followAuthor(authorUserId) {
    const { data } = await apiClient.post(`/auth/users/${authorUserId}/follow`);
    return data;
  },
  async unfollowAuthor(authorUserId) {
    const { data } = await apiClient.delete(`/auth/users/${authorUserId}/follow`);
    return data;
  },
  async getFollowStatus(authorUserId) {
    const { data } = await apiClient.get(`/auth/users/${authorUserId}/follow-status`);
    return data;
  },
  async updateUserProfile(userId, payload) {
    const { data } = await apiClient.put(`/auth/users/${userId}/profile`, payload);
    return data;
  },
  async changeUserRole(userId, role) {
    const { data } = await apiClient.put(`/auth/users/${userId}/role`, { role });
    return data;
  },
  async setUserStatus(userId, active) {
    const { data } = await apiClient.put(`/auth/users/${userId}/status`, null, {
      params: { active },
    });
    return data;
  },
  async deleteUser(userId) {
    const { data } = await apiClient.delete(`/auth/users/${userId}`);
    return data;
  },
  async getAuditLogs() {
    const { data } = await apiClient.get('/auth/audit-logs');
    return data;
  },
  async oauthSuccess() {
    const { data } = await apiClient.get('/auth/oauth2/success');
    return data;
  },
  async platformAnalytics() {
    const { data } = await apiClient.get('/auth/admin/platform-analytics');
    return data;
  },
  oauthUrl(provider) {
    return `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/oauth2/authorization/${provider}`;
  },
};

export default authService;

