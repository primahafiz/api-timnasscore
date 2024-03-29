const moment = require('moment')

module.exports = (sequelize, DataTypes) => {
    const FootballMatch = sequelize.define('FootballMatch', {
        IDMatch : {
            type : DataTypes.INTEGER,
            primaryKey : true
        },
        DateTimeMatch :{
            type :  DataTypes.DATE,
            get() {
                return moment(this.getDataValue('DateTimeMatch')).tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm')
            }
        },
        NameHome : DataTypes.STRING,
        NameAway : DataTypes.STRING,
        ScoreHome : DataTypes.INTEGER,
        ScoreAway : DataTypes.INTEGER,
        ShotsHome : DataTypes.INTEGER,
        ShotsAway : DataTypes.INTEGER,
        ShotsOnTargetHome : DataTypes.INTEGER,
        ShotsOnTargetAway : DataTypes.INTEGER,
        PossesionHome : DataTypes.INTEGER,
        PossesionAway : DataTypes.INTEGER,
        YellowCardHome : DataTypes.INTEGER,
        YellowCardAway : DataTypes.INTEGER,
        RedCardHome : DataTypes.INTEGER,
        RedCardAway : DataTypes.INTEGER,
        EventName : DataTypes.STRING,
        CurrentMinute : DataTypes.INTEGER,
        StatusMatch : DataTypes.STRING
    })
  
    FootballMatch.associate = function (models) {
    }
  
    return FootballMatch
  }