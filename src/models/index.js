const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')
const config = require('../config/config')
const db = {}

const sequelize = new Sequelize('postgres://msvpqljzizlerl:d03d1b84f1e2580a759d22466b705ced0cad8b2c4acc502dc85168919a5e054e@ec2-52-22-136-117.compute-1.amazonaws.com:5432/d2no82figijdth', {
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    operatorAliases: false,
    timezone:"+07:00"
});

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

fs
  .readdirSync(__dirname)
  .filter((file) =>
    file !== 'index.js'
  )
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes)
    db[model.name] = model
  })

Object.keys(db).forEach(function (modelName) {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db)
  }
})

db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db