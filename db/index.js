'use strict'

const setupDatabase = require('./lib/db')
const setupPostModel = require('./models/post')
const setupPost = require('./lib/post')
const defaults = require('defaults')

module.exports = async (config) => {
  config = defaults(config, {
    dialect: 'sqlite',
    pool: {
      max: 10,
      min: 0,
      idle: 10000
    },
    query: {
      raw: true
    }
  })

  const sequelize = setupDatabase(config)
  const PostModel = setupPostModel(config)

  await sequelize.authenticate()

  if (config.setup) {
    await sequelize.sync({ force: true })
  }

  const Post = setupPost(PostModel)

  return {
    Post
  }
}
