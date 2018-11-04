'use strict'

// supertest trabaja con una instancia de express, por lo no es necesario tener corriendo el servidor para hacer las pruebas

const test = require('ava')
const request = require('supertest')

const server = require('../server')

test.serial.cb('/api/posts', t => { // "cb" para probar funciones de callback (supertest trabaja con callbacks)
  request(server)
    .get('/api/posts')
    .expect(200)
    .expect('Content-Type', /json/)
    .end((err, res) => {
      t.falsy(err, 'should not return an error')
      let body = res.body
      t.deepEqual(body, {}, 'response body should be the expected')
      t.end()
    })
})
