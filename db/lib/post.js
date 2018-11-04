'use strict'

module.exports = PostModel => {

  const createOrUpdate = async post => {
    const cond = { //objeto sequelize para una funcion del modelo
      where: {
        id: post.id
      }
    }

    const existingPost = await PostModel.findOne(cond) // función de sequelize que retorna la primera ocurrencia que cumpla con la condición

    if(existingPost){
      const updated = await PostModel.update(post,cond)
      return updated ? PostModel.findOne(cond) : existingPost
    }

    const result = await PostModel.create(post)

    return result.toJSON()
  }

  const findById = id => {
    return PostModel.findById(id) // sequelize ya tiene un metodo findById
  }

  const findAll = () => {
    return PostModel.findAll()
  }

  const findByPostName = postName => {
    return PostModel.findAll({
      where: {
        name: postName
      }
    })
  }

  return {
    createOrUpdate,
    findById,
    findAll,
    findByPostName
  }
}
