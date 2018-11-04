'use strict'

// middleware: funciones que se ejecutan antes de que la petición llegue al final

const debug = require('debug')('PostListRESTAPI:api:routes')
const http = require('http')
const cors = require('cors')
const express = require('express')
const asyncify = require('express-asyncify')

const api = require('./api')

const port = process.env.PORT || 3000
const app = asyncify(express())
const server = http.createServer(app)

app.use('/api', api) // "use" es la función para montar middlewares

//app.use(cors())

// Express Error Handler
app.use((err, req, res, next) => {
  debug('Error: ' + err.message)

  if (err.message.match(/not found/)) {
    return res.status(404).send({ error: err.message })
  }

  res.status(500).send({ error: err.message })
})

const handleFatalError = err => {
  console.error(err.message)
  console.error(err.stack)
  process.exit(1)
}

if (!module.parent) { // si yo no requiero el server.js
  process.on('uncaughtException', handleFatalError)
  process.on('unhandledRejection', handleFatalError)

  server.listen(port, () => {
    console.log('server listening...')
  })
}

module.exports = server // si requiero el server.js
