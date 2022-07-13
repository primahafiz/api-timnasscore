const {FootballMatch} = require('../models')
const {sequelize} = require('../models')
const moment = require('moment')

module.exports = {
    async getAllData(req,res){
        const countData = await FootballMatch.count()
        var num = countData-10
        if(num<0){
            num=0
        }
        const matchList = await FootballMatch.findAll({
            offset : num
        })
        for(let i=0;i<matchList.length;i++){
            const temp = moment(new Date(matchList[i].DateTimeMatch)).tz("Asia/Jakarta").format('YYYY-MM-DD HH:mm')
            matchList[i].DateTimeMatch = temp
        }
        res.send(matchList)
    }
}