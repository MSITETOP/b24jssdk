import { B24OAuth } from '../packages/jssdk/src/oauth'
import { LoggerBrowser } from '../packages/jssdk/src/logger/browser'

// Пример использования OAuth авторизации
async function oauthExample() {
  // Инициализация параметров OAuth
  const oauthParams = {
    b24Url: 'https://your-domain.bitrix24.ru',
    clientId: 'your_client_id',
    accessToken: 'your_access_token',
    refreshToken: 'your_refresh_token',
    expiresIn: 3600
  }

  try {
    // Создание экземпляра B24OAuth
    const b24 = new B24OAuth(oauthParams)
    
    // Опционально: настройка логгера
    const logger = new LoggerBrowser({ debug: true })
    b24.setLogger(logger)

    // Получение данных авторизации
    const authData = b24.auth.getAuthData()
    console.log('Auth Data:', authData)

    // Пример вызова метода REST API
    const result = await b24.callMethod('crm.lead.list', {
      select: ['ID', 'TITLE', 'DATE_CREATE'],
      filter: { '>DATE_CREATE': '2024-01-01' }
    })
    console.log('Leads:', result)

    // Пример обновления токена
    const newAuthData = await b24.auth.refreshAuth()
    console.log('Updated Auth Data:', newAuthData)

  } catch (error) {
    console.error('Error:', error)
  }
}

// Запуск примера
oauthExample() 