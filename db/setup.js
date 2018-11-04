'use strict'

const Sequelize = require('sequelize')
const debug = require('debug')('PostListRESTAPI:db:setup')
const db = require('./')
const inquirer = require('inquirer')

const prompt = inquirer.createPromptModule()

const setup = async () => {
  const answer = await prompt([{
    type: 'confirm',
    name: 'setup',
    message: 'This will destroy your database, are you sure?'
  }])

  if (!answer.setup) {
    return console.log('Nothing happened')
  }

  const config = {
    database: process.env.DB_NAME || 'postlist',
    username: process.env.DB_USER || 'arak',
    password: process.env.DB_PASS || 'admin',
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    logging: s => debug(s),
    setup: true,
    operatorsAliases: Sequelize.Op
  }

  await db(config)
    .catch(handleFatalError)

  console.log('Success!')
  process.exit(0)
}

const handleFatalError = err => {
  console.error(err.message)
  console.error(err.stack)
  process.exit(1)
}

setup()
