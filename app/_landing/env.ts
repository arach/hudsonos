const isProd = process.env.NODE_ENV === 'production';

export const APP_URL = isProd
  ? 'https://app.hudsonos.com'
  : 'http://localhost:3500';
