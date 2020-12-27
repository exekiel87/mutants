if (process.env.NODE_ENV !== 'production')
{
  require('dotenv').config();
}

const config = {
  NODE_ENV: process.env.NODE_ENV,
  DB_CONF: {
      MUTANTS_DB_URL: process.env.MUTANTS_DB_URL,
      MUTANTS_DB_NAME: process.env. MUTANTS_DB_NAME
  },
  letters: ['A','T','C','G']
};

module.exports = config;