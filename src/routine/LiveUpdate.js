const {sequelize} = require('../models')
const {FootballMatch} = require('../models')
const request = require('request')
const GoalUpdate = require('./GoalUpdate')

module.exports = {
    async liveUpdate(IDMatch){
        var options = {
            method: 'GET',
            json : true,
            url: 'https://v3.football.api-sports.io/fixtures',
            qs: {id:IDMatch},
            headers: {
              'x-rapidapi-host': 'v3.football.api-sports.io',
              'x-rapidapi-key': '5102eaf0453d522fecd67130a4a5151d'
            }
        };
        request(options, async function (error, response, body) {
            if (error)
                throw new Error(error)

            // fill to map
            var cur = body.response[0]
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
            // update match and goal data
            await FootballMatch.update(match,{
                where:{
                    IDMatch : IDMatch
                }
            })
            await GoalUpdate.goalUpdate(IDMatch)
        });
    }
}