require('dotenv').config()
module.exports = {
  PORT: process.env.PORT || 80,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL,
  TEST_DB_URL: process.env.TEST_DB_URL,
  JWT_SECRET: process.env.JWT_SECRET || 'dbe39ae4-0149-47da-9501-f85f920e2602',
  JWT_EXPIRY: process.env.JWT_EXPIRY || '3h'
};

