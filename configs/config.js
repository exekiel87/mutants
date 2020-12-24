if (process.env.NODE_ENV !== 'production')
{
  require('dotenv').config();
}

const config = {
  NODE_ENV: process.env.NODE_ENV,/*
  DB_CONF: {
      SENSORS_DB_URL: process.env.SENSORS_DB_URL,
      SENSORS_DB_NAME: process.env.SENSORS_DB_NAME
  },
  authJwtSecret: process.env.AUTH_JWT_SECRET*/
};

module.exports = config;