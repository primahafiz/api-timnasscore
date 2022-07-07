module.exports = (sequelize, DataTypes) => {
    const Goal = sequelize.define('Goal', {
        IDGoal : {
            type : DataTypes.INTEGER,
            primaryKey : true,
            autoIncrement: true
        },
        IDMatch : {
            type : DataTypes.INTEGER,
            references : {
                model : 'FootballMatches',
                key : 'IDMatch'
            }
        },
        Minute : DataTypes.INTEGER,
        ExtraMinute : DataTypes.INTEGER,
        PlayerName : DataTypes.STRING,
        TeamName : DataTypes.STRING
    })
  
    Goal.associate = function (models) {
    }
  
    return Goal
  }