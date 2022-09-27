const {FootballMatch} = require('../models')
const {sequelize} = require('../models')
const { Op } = require('sequelize')

module.exports = {
    async getAllData(req,res){
        let data = fs.readFileSync('update.json')
        let update = JSON.parse(data);
        if(new Date() - new Date(update.nextStartTime) >= 200000 && new Date()<new Date(update.nextEndTime)){
            await LiveUpdate.liveUpdate(update.nextIDMatch)
            update.nextStartTime = (new Date()).getTime()
            fs.writeFileSync('update.json', JSON.stringify(update))
        }
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