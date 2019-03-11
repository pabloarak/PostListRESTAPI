'use strict'

const db = require('../')

const run = async () => {
  const config = {
    database: process.env.DB_NAME || 'postlist',
    username: process.env.DB_USER || 'arak',
    password: process.env.DB_PASS || 'admin',
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres'
  }

  const {Post} = await db(config).catch(handleFatalError)

  const post = await Post.createOrUpdate({
    id: 3,
    name: 'Post 3',
    description: 'Un post más 3'
  }).catch(handleFatalError)

  console.log('--post--')
  console.log(post)

  const posts = await Post.findAll().catch(handleFatalError)

  console.log('--posts--')
  console.log(posts)
}

const handleFatalError = err => {
  console.error(err.message)
  console.error(err.stack)
  process.exit(1)
}

run()
