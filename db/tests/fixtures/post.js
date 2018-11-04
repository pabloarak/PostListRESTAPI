'use strict'

const post = {
  id: 1,
  name: 'Ola Mundo 1',
  description: 'Un ola mundo más 1'
}

const extend = (obj,values) => {
  const clone = Object.assign({},obj)
  return Object.assign(clone,values)
}

const posts = [
    post,
    extend(post,{id:2,name:'Ola Mundo 2',description:'Un ola mundo más 2'}),
    extend(post,{id:3,name:'Ola Mundo 3',description:'Un ola mundo más 3'}),
    extend(post,{id:4,name:'Ola Mundo 4',description:'Un ola mundo más 4'})
]

module.exports = {
  single: post,
  all: posts,
  byId: id => posts.filter(p => p.id === id).shift(),
  post1: posts.filter(p => p.name === 'Ola Mundo 1'),
}
