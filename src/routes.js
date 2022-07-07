const FootballMatchController = require('./controller/FootballMatchController')
const GoalController = require('./controller/GoalController')

module.exports = (app) => {

    app.get('/',FootballMatchController.getAllData)

    app.get('/goal',GoalController.getAllMatchGoal)

}