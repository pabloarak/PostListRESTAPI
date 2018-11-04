'use strict'

const test = require('ava')
const sinon = require('sinon') // para creación y uso de stubs
const proxyquire = require('proxyquire') // permite requerir un modulo sobreescribiendo los "require" que la app esta haciendo

const postFixtures = require('./fixtures/post')

let config = {
  logging: () => {}
}

let single = Object.assign({},postFixtures.single)
let id = 1
let PostStub = null
let db = null
let sandbox = null // ambiente especifico de sinon, para ejecutar test desde 0

let idArgs = {
  where: {
    id
  }
}

let postNameArgs = {
  where: { name: 'Ola Mundo 1'}
}

let newPost = {
  id: '5',
  name: 'test',
  description: 'test'
}

test.beforeEach(async () => {
  sandbox = sinon.createSandbox() // funcion especifica que permite hacerle preguntas

  PostStub = {}

  // Model create stub
  PostStub.create = sandbox.stub()
  PostStub.create.withArgs(newPost).returns(Promise.resolve({
    toJSON () { return newPost }
  }))

  // Model update stubs
  PostStub.update = sandbox.stub()
  PostStub.update.withArgs(single, idArgs).returns(Promise.resolve(single))

  // Model findById stub
  PostStub.findById = sandbox.stub()
  PostStub.findById.withArgs(id).returns(Promise.resolve(postFixtures.byId(id)))

  // Model findOne stub
  PostStub.findOne = sandbox.stub()
  PostStub.findOne.withArgs(idArgs).returns(Promise.resolve(postFixtures.byId(id)))

  // Model findAll Stub
  PostStub.findAll = sandbox.stub()
  PostStub.findAll.withArgs().returns(Promise.resolve(postFixtures.all))
  PostStub.findAll.withArgs(postNameArgs).returns(Promise.resolve(postFixtures.post1))

  const setupDatabase = proxyquire('../',{
    './models/post': () => PostStub
  })

  db = await setupDatabase(config)
})

test.afterEach(() =>{
  sandbox && sandbox.restore()
})

test('Post', t => {
  t.truthy(db.Post, 'Post service should exist')
})

test.serial('Post#findById',async t => {
  let post = await db.Post.findById(id)

  t.true(PostStub.findById.called, 'findById should be called on model')
  t.true(PostStub.findById.calledOnce, 'findById should be called once')
  t.true(PostStub.findById.calledWith(id), 'findById should be called with specified id')

  t.deepEqual(post, postFixtures.byId(id), 'should be the same')
})

test.serial('Post#findAll', async t => {
  let posts = await db.Post.findAll()

  t.true(PostStub.findAll.called, 'findAll should be called on model')
  t.true(PostStub.findAll.calledOnce, 'findAll should be called once')
  t.true(PostStub.findAll.calledWith(), 'findAll should be called without args')

  t.is(posts.length, postFixtures.all.length, 'posts should be the same amount')
  t.deepEqual(posts, postFixtures.all, 'posts should be the same')
})

test.serial('Post#findByPostName', async t => {
  let posts = await db.Post.findByPostName('Ola Mundo 1')

  t.true(PostStub.findAll.called, 'findAll should be called on model')
  t.true(PostStub.findAll.calledOnce, 'findAll should be called once')
  t.true(PostStub.findAll.calledWith(postNameArgs), 'findAll should be called with post name args')

  t.is(posts.length, postFixtures.post1.length, 'posts should be the same amount')
  t.deepEqual(posts, postFixtures.post1, 'posts should be the same')
})

test.serial('Post#createOrUpdate - exists', async t => {
  let post = await db.Post.createOrUpdate(single)

  t.true(PostStub.findOne.called, 'findOne should be called on model')
  t.true(PostStub.findOne.calledTwice, 'findOne should be called twice')
  t.true(PostStub.update.calledOnce, 'update should be called once')

  t.deepEqual(post,single,'post should be the same')
})

test.serial('Post#createOrUpdate - new', async t => {
  let post = await db.Post.createOrUpdate(newPost)

  t.true(PostStub.findOne.called, 'findOne should be called on model')
  t.true(PostStub.findOne.calledOnce, 'findOne should be called once')
  t.true(PostStub.findOne.calledWith({
    where: { id: newPost.id }
  }), 'findOne should be called with uuid args')
  t.true(PostStub.create.called, 'create should be called on model')
  t.true(PostStub.create.calledOnce, 'create should be called once')
  t.true(PostStub.create.calledWith(newPost), 'create should be called with specified args')

  t.deepEqual(post, newPost, 'post should be the same')
})
