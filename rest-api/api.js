'use strict'

const debug = require('debug')('PostListRESTAPI:api:routes')
const express = require('express')
const asyncify = require('express-asyncify')
const db = require('db')
const cors = require('cors')

const config = require('./config')

const api = asyncify(express.Router())

api.use(cors())

let services, Post

api.use('*', async (req, res, next) => { // * cada vez que se haga una petición. Express no soporta async await... para ello se usa express-asyncify
  if (!services) {
    debug('Connecting to database')
    try {
      services = await db(config.db)
    } catch (e) {
      return next(e)
    }

    Post = services.Post
  }

  next() // para que el middleware continue la ejecucion
})

api.get('/posts', async (req, res) => {
  debug('A request has come to /posts')

  let posts = []

  try {
    posts = await Post.findAll()
  } catch(e){
    return next(e)
  }

  res.send({posts})
})

api.get('/post/:id', (req, res, next) => {
  const { id } = req.params

  if (id !== '1') {
    return next(new Error('Post not found'))
  }

  res.send({ id })
})

module.exports = api
