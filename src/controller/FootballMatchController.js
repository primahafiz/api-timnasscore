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
        console.log("length = "+matchList.length)
        for(let i=0;i<countData-num;i++){
            const temp = moment(new Date(matchList[i].DateTimeMatch)).tz("Asia/Jakarta").format('YYYY-MM-DD HH:mm')
            console.log(temp)
            matchList[i].DateTimeFormattedMatch = temp
        }
        res.send(matchList)
    }
}