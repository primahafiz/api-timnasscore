const {sequelize} = require('../models')
const {FootballMatch} = require('../models')
const request = require('request')
const GoalUpdate = require('./GoalUpdate')
const LiveUpdate = require('./LiveUpdate')
const schedule = require('node-schedule');

module.exports = {
    async refreshDaily(){
        const currentListMatch = await FootballMatch.findAll({
            attributes : ['IDMatch']
        })
        const listIDMatch = []
        for(let i=0;i<currentListMatch.length;i++){
            listIDMatch.push(currentListMatch[i].IDMatch)
        }
        listIDMatch.sort()
        var options = {
            method: 'GET',
            json : true,
            url: 'https://v3.football.api-sports.io/fixtures',
            qs: {team : '1571',last : '10'},
            headers: {
              'x-rapidapi-host': 'v3.football.api-sports.io',
              'x-rapidapi-key': '5102eaf0453d522fecd67130a4a5151d'
            }
        };
        request(options, async function (error, response, body) {
            if (error)
                throw new Error(error)

            // fill to array
            const responseMatch = []
            for(let i=0;i<body.results;i++){
                var cur = body.response[i]
                var match = {}
                match.IDMatch = cur.fixture.id
                match.DateTimeMatch = cur.fixture.date
                match.NameHome = cur.teams.home.name
                match.NameAway = cur.teams.away.name
                match.ScoreHome = cur.goals.home
                match.ScoreAway = cur.goals.away
                match.EventName = cur.league.name
                match.CurrentMinute = cur.fixture.status.elapsed
                match.StatusMatch = cur.fixture.status.short

                responseMatch.push(match)
            }
            console.log("Last = "+responseMatch)

            // insert to database
            for(let i=0;i<responseMatch.length;i++){
                var l = 0
                var r = listIDMatch.length-1
                var found = false
                while(l<=r){
                    var mid = ((l+r)/2) >> 0
                    if(listIDMatch[mid]>=responseMatch[i].IDMatch){
                        r = mid-1
                        if(listIDMatch[mid]==responseMatch[i].IDMatch){
                            found = true
                            break
                        }
                    }else{
                        l = mid+1
                    }
                }
                const newGoal = await GoalUpdate.goalUpdate(responseMatch[i].IDMatch)
                if(!found){
                    const newMatch = await FootballMatch.create(responseMatch[i])
                    const newGoal = await GoalUpdate.goalUpdate(responseMatch[i].IDMatch)
                    const dateTimeNow = new Date()
                    if(dateTimeNow <= new Date(responseMatch[i].DateTimeMatch)){
                        const startTime = new Date(responseMatch[i].DateTimeMatch)
                        const endTime = startTime.getTime() + 12000000
                        const job = schedule.scheduleJob({start : startTime,end : endTime,rule : '*/5 * * * *'},function(){
                            LiveUpdate.liveUpdate(responseMatch[i].IDMatch)   
                        })
                    }
                }
            }
        });
        options = {
            method: 'GET',
            json : true,
            url: 'https://v3.football.api-sports.io/fixtures',
            qs: {team : '1571',next : '10'},
            headers: {
              'x-rapidapi-host': 'v3.football.api-sports.io',
              'x-rapidapi-key': '5102eaf0453d522fecd67130a4a5151d'
            }
        };
        request(options, async function (error, response, body) {
            if (error)
                throw new Error(error)

            // fill to array
            const responseMatch = []
            for(let i=0;i<body.results;i++){
                var cur = body.response[i]
                var match = {}
                match.IDMatch = cur.fixture.id
                match.DateTimeMatch = cur.fixture.date
                match.NameHome = cur.teams.home.name
                match.NameAway = cur.teams.away.name
                match.ScoreHome = cur.goals.home
                match.ScoreAway = cur.goals.away
                match.EventName = cur.league.name
                match.CurrentMinute = cur.fixture.status.elapsed
                match.StatusMatch = cur.fixture.status.short

                responseMatch.push(match)
            }
            console.log("Next = "+responseMatch)

            // insert to database
            for(let i=0;i<responseMatch.length;i++){
                var l = 0
                var r = listIDMatch.length-1
                var found = false
                while(l<=r){
                    var mid = ((l+r)/2) >> 0
                    if(listIDMatch[mid]>=responseMatch[i].IDMatch){
                        r = mid-1
                        if(listIDMatch[mid]==responseMatch[i].IDMatch){
                            found = true
                            break
                        }
                    }else{
                        l = mid+1
                    }
                }
                if(!found){
                    const newMatch = await FootballMatch.create(responseMatch[i])
                    const newGoal = await GoalUpdate.goalUpdate(responseMatch[i].IDMatch)
                    const dateTimeNow = new Date()
                    if(dateTimeNow <= new Date(responseMatch[i].DateTimeMatch)){
                        const startTime = new Date(responseMatch[i].DateTimeMatch)
                        const endTime = startTime.getTime() + 12000000
                        const job = schedule.scheduleJob({start : startTime,end : endTime,rule : '*/5 * * * *'},function(){
                            LiveUpdate.liveUpdate(responseMatch[i].IDMatch)   
                        })
                    }
                }
            }
        });
    }
}