const {sequelize} = require('../models')
const {Goal} = require('../models')
const request = require('request')

module.exports = {
    async goalUpdate(IDMatch){
        const currentGoal = await Goal.findAll({
            where : {
                IDMatch : IDMatch
            }
        })
        const currentListGoal = []
        for(let i=0;i<currentGoal.length;i++){
            currentListGoal.push({
                IDMatch : currentGoal[i].IDMatch,
                Minute : currentGoal[i].Minute,
                ExtraMinute : currentGoal[i].ExtraMinute,
                PlayerName : currentGoal[i].PlayerName
            })
        }
        var options = {
            method: 'GET',
            json : true,
            url: 'https://v3.football.api-sports.io/fixtures/events',
            qs: {type : 'goal',fixture : IDMatch},
            headers: {
              'x-rapidapi-host': 'v3.football.api-sports.io',
              'x-rapidapi-key': '5102eaf0453d522fecd67130a4a5151d'
            }
        };
        request(options, async function (error, response, body) {
            if (error)
                throw new Error(error)

            const responseGoal = []
            for(let i=0;i<body.results;i++){
                cur = body.response[i]
                var goal = {}
                goal.IDMatch = IDMatch
                goal.Minute = cur.time.elapsed
                goal.ExtraMinute = cur.time.extra
                goal.PlayerName = cur.player.name
                goal.TeamName = cur.team.name

                responseGoal.push(goal)
            }
            console.log(responseGoal)

            // insert to database
            for(let i=0;i<responseGoal.length;i++){
                var found = false
                for(let j=0;j<currentListGoal.length;j++){
                    if(responseGoal[i].IDMatch == currentListGoal[j].IDMatch && responseGoal[i].Minute == currentListGoal[j].Minute && responseGoal[i].ExtraMinute == currentListGoal[j].ExtraMinute && responseGoal[i].PlayerName == currentListGoal[j].PlayerName){
                        found = true
                        break
                    }
                }
                if(!found){
                    const newGoal = await Goal.create(responseGoal[i])
                }
            }
            console.log("goal kelar")
        });
    }
}