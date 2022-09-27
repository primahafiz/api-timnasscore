const {FootballMatch} = require('../models')
const {sequelize,Op} = require('../models')

module.exports = {
    async getAllData(req,res){
        const countData = await FootballMatch.count()
        var num = countData-15
        if(num<0){
            num=0
        }
        const matchList = await FootballMatch.findAll({
            offset : num,
            where:{
                [Op.or]: [{StatusMatch: "CANC"}, {StatusMatch: "TBD"}]
            }
        })
        
        res.send(matchList)
    }
}