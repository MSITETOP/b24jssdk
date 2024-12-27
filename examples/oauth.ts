import { B24OAuth } from '@ipg24/b24jssdk'
import { LoggerBrowser } from '@ipg24/b24jssdk'
import * as dotenv from 'dotenv'

// Загружаем переменные окружения
dotenv.config()

// Пример использования OAuth авторизации
async function oauthExample() {
  // Инициализация параметров OAuth
  const oauthParams = {
    b24Url: process.env.B24_URL || 'https://your-domain.bitrix24.ru',
    clientId: process.env.B24_CLIENT_ID || 'your_client_id', 
    accessToken: process.env.B24_ACCESS_TOKEN || 'your_access_token',
    refreshToken: process.env.B24_REFRESH_TOKEN || 'your_refresh_token',
    memberId: process.env.B24_MEMBER_ID || 'your_member_id',
    expiresIn: Number(process.env.B24_EXPIRES_IN || 3600),
    clientSecret: process.env.B24_CLIENT_SECRET || 'your_client_secret'
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