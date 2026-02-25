import { apiClient } from '@/api/client'

export const organizationService = {  sendConnectionRequest: (formData) =>
    apiClient.post('/organizations/connect', formData),  getConnectionStatus: () =>
    apiClient.get('/organizations/connect/status'),  getAllRequests: (status) =>
    apiClient.get(`/organizations/connect/requests?status=${status}`),  updateRequestStatus: (id, status) =>
    apiClient.put(`/organizations/connect/requests/${id}`, { status }),
}
