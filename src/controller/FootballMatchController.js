const {FootballMatch} = require('../models')
const {sequelize} = require('../models')
const { Op } = require('sequelize')

module.exports = {
    async getAllData(req,res){
        const countData = await FootballMatch.count()
        var num = countData-15
        if(num<0){
            num=0
        }
        const matchList = await FootballMatch.findAll({
            offset : num
        })

        const result = []
        for(let i=0;i<matchList.length;i++){
            if(matchList[i].StatusMatch === "TBD" || matchList[i].StatusMatch === "CANC")continue
            result.push(matchList[i])
        }
        
        res.send(result)
    }
}