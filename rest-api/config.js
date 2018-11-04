'use strict'

const debug = require('debug')('PostListRESTAPI:api:db')

module.exports = {
  db: {
    database: process.env.DB_NAME || 'postlist',
    username: process.env.DB_USER || 'arak',
    password: process.env.DB_PASS || 'admin',
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    logging: s => debug(s)
  }
}
