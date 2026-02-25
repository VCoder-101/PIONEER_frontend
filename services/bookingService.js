import { apiClient } from '@/api/client'

export const bookingService = {
  create: (bookingData) =>
    apiClient.post('/bookings', bookingData),

  getAll: () =>
    apiClient.get('/bookings'),

  getById: (id) =>
    apiClient.get(`/bookings/${id}`),

  // статусы: confirmed, cancelled
  updateStatus: (id, status) =>
    apiClient.put(`/bookings/${id}/status`, { status }),
}
