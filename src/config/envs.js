require('dotenv/config.js')
const {get} = require('env-var')

const envs = {
  DBHOST: get('DB_HOST').required().asString(),
  PORT: get('PORT').required().asPortNumber(),
  JTW_SECRET: get('JWT_SECRET').required().asString(),
  PUBLIC_PATH: get('PUBLIC_PATH').default('public').asString(),
}



module.exports = {envs}


