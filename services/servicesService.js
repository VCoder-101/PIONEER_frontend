import { apiClient } from '@/api/client'

export const servicesService = {
  getAll: () =>
    apiClient.get('/services'),

  // фильтруем организации по услуге и городу
  getOrganizations: (serviceId, city) =>
    apiClient.get(`/services/${serviceId}/organizations?city=${city}`),

  getServiceDetails: (serviceId, organizationId) =>
    apiClient.get(`/services/${serviceId}/organizations/${organizationId}/details`),

  getAvailableSlots: (organizationId, date) =>
    apiClient.get(`/organizations/${organizationId}/slots?date=${date}`),
}
