const {FootballMatch} = require('../models')
const {sequelize} = require('../models')

module.exports = {
    async getAllData(req,res){
        const countData = await FootballMatch.count()
        const matchList = await FootballMatch.findAll({
            offset : countData-2
        })
        res.send(matchList)
    }
}