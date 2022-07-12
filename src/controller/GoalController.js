const {Goal} = require('../models')
const {sequelize} = require('../models')

module.exports = {
    async getAllMatchGoal(req,res){
        const goalList = await Goal.findAll({
            where : {
                IDMatch : req.query.IDMatch
            }
        })
        res.send(goalList)
    }
}