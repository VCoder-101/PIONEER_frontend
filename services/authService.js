import { apiClient } from '@/api/client'

export const authService = {
  // отправляем номер, бэк генерирует и шлёт смс
  sendSmsCode: (phone) =>
    apiClient.post('/auth/send-code', { phone }),

  // проверяем код, получаем токен
  verifySmsCode: (phone, code) =>
    apiClient.post('/auth/verify-code', { phone, code }),

  logout: () =>
    apiClient.post('/auth/logout'),
}
