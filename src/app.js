const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const config = require("./config/config")
const {sequelize} = require('./models')
const schedule = require('node-schedule');
const fs = require('fs');
const RefreshDaily = require('./routine/RefreshDaily')
const LiveUpdate = require('./routine/LiveUpdate')

const app = express()
app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(cors())

require('./routes')(app)

process.env.TZ = "Asia/Jakarta";

const rule = new schedule.RecurrenceRule();
rule.hour = 13;
rule.tz = 'Asia/Jakarta';

console.log(new Date())

let data = fs.readFileSync('update.json')
let update = JSON.parse(data);

if(new Date() - new Date(update.lastUpdated)>=86400000){
    update.lastUpdated = (new Date()).getTime()
    fs.writeFileSync('update.json', JSON.stringify(update))
    RefreshDaily.refreshDaily()
}
if(new Date() - new Date(update.nextStartTime) >= 300000 && new Date()<new Date(update.nextEndTime)){
    LiveUpdate.liveUpdate(update.nextIDMatch)
    update.nextStartTime = (new Date()).getTime()
    fs.writeFileSync('update.json', JSON.stringify(update))
}

sequelize.sync({force:false})
    .then(() => {
        app.listen(config.port)
    })