const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const config = require("./config/config")
const {sequelize} = require('./models')
const schedule = require('node-schedule');
const RefreshDaily = require('./routine/RefreshDaily')

const app = express()
app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(cors())

require('./routes')(app)

process.env.TZ = "Asia/Jakarta";

const rule = new schedule.RecurrenceRule();
rule.hour = 13;
rule.tz = 'Asia/Jakarta';

RefreshDaily.refreshDaily()

const job = schedule.scheduleJob(rule, function(){
    RefreshDaily.refreshDaily()
});

sequelize.sync({force:false})
    .then(() => {
        app.listen(config.port)
    })