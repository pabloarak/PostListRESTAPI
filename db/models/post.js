'use strict'

const Sequelize = require('sequelize')
const setupDatabase = require('../lib/db')

module.exports = config => {
  const sequelize = setupDatabase(config)

  return sequelize.define('post', {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    description: {
      type: Sequelize.STRING,
      allowNull: false
    }
  })
}
