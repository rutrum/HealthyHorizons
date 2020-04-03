var express = require('express')
var app = express()
var ip = require('ip')
var path = require('path')
var fs = require('fs')

var database = require('./database')
var db = new database.db()

var port = process.env.PORT || 8080

var router = express.Router()

app.set('view engine', 'ejs')

// Allows us to parse POST request data
var bodyParser = require('body-parser')
app.use(bodyParser.json());

// On use of any request
router.use(function(req, res, next) {
    var ip = req.headers['x-real-ip'] || req.connection.remoteAddress;
    console.log("\nNew " + req.method + " request from " + ip)
    console.log(req.originalUrl)
    next()
})

// Set static directory
router.use(express.static('static'))

// All file are served from the /src directory
__dirname = __dirname + "/src"

// Redirect favicon to the resources file
router.get('/favicon.ico', (req, res) => {
    res.sendFile(path.join(__dirname + '/resources/favicon.ico'))
})

router.get("/points", (req, res) => {
    // db.all_users((users) => {
    tasks = [
        {
            point: 1,
            names: ["eat fruit", "eat veggies"]
        },
        {
            point: 10,
            names: ["go the gym", "read the newspaper", "do your homework"]
        },
        {
            point: 5,
            names: ["ride a bike to work", "do PALOTOIES"]
        },
        {
            point: 100,
            names: ["wash dave's car"]
        }
    ]
    res.render("points", {tasks: tasks})
    // })
})

router.get('/prizes', (req, res) => {

    tiers = [
        {
            name : 'Silver',
            point : 150,
            prizes: ['Finglerless Gloves','Pill Dispenser']
        },
        {
            name: 'Gold',
            point : 250,
            prizes: ['Camp/Car LED Lantern','Reusable Utensils & Bag']
        },
        {
            name: 'Platinum',
            point : 350,
            prizes: ['Waterproof Picnic Throw','Bluetooth Earbuds']
        }
    ]

    db.all_prizes_and_tiers(result => {
        res.render("prizes", {tiers: result})
        console.log("rendered prizes")
    })

})

router.get('/:name', (req, res) => {
    res.render(req.params.name)
})

router.get('/', (req, res) => {
    res.render("index")
})

router.post('/prize', (req, res) => {
    submission = req.body
    console.log(submission)

    prize = submission.prize
    tasks = submission.tasks

    if (prize.gold == null) { prize.gold = "N/A" }
    if (prize.platinum == null) { prize.platinum = "N/A" }

    the_data = "Name: " + prize.firstName + " " + prize.lastName + "\n"
    the_data += "Email: " + prize .email + "\n"
    the_data += getDateString() + "\n"
    the_data += "\n"
    the_data += "Total points: " + submission.points + "\n"
    the_data += "Silver prize: " + prize.silver + "\n"
    the_data += "Gold prize: " + prize.gold + "\n"
    the_data += "Platinum prize: " + prize.platinum + "\n"
    the_data += "\n"
    for (let key in tasks) {
        if (tasks.hasOwnProperty(key)) {
            the_data += key + ": " + tasks[key] + "\n"
        }
    }

    let d = new Date();

    let filename = "user_data/" + prize.firstName + "_" + prize.lastName + "_" + d.getTime() + ".txt"

    fs.writeFile(filename, the_data, function (err) {
        if (err) throw err;
        console.log('Updated!');
    });
    res.status(200).end()
})

//  __ _ _ __ (_)
// / _` | '_ \| |
//| (_| | |_) | |
// \__,_| .__/|_|
//      |_|     

router.get('/api/tasks', (req, res) => {
    db.all_tasks((results) => {
        res.send(JSON.stringify(results))
    })
})

// Returns array of the following form as json:
// [ { name: "bronze", points: 250 },
//   { name: "silver", points, 350 },
//   ... ]
router.get("/api/tiers", (req, res) => {

})

// Returns an object of the following form as json:
// { vegetables: 1, water: 1, readbook: 5, pitchinforlunch: 5 }
// Keys should be task names and values should be how many points
// it is worth.
router.get("/api/task_points", (req, res) => {

})

// Returns all user tasks for the user of the given id
// in the given week.  Return value should be like
// { vegetables: 0, water: 2, readbook: 0, pitchinforlunch: 1 }
router.get("api/user_tasks/:user_id/:week_num", (req, res) => {

})

// Updates all user tasks for the user of the given id
// in the given week.  Posted value should be like
// { vegetables: 0, water: 2, readbook: 0, pitchinforlunch: 1 }
// May also need to insert rows if new, or ignore rows that
// are 0 valued.
router.post("api/user_tasks/:user_id/:week_num", (req, res) => {

})

// Other stuff

function getDateString() {
    let d = new Date()
    return d.toString()
}

router.get('/style/:name', (req, res) => {
    res.sendFile(path.join(__dirname + "/style/" + req.params.name))
})

router.get('/script/:name', (req, res) => {
    res.sendFile(path.join(__dirname + "/script/" + req.params.name))
})

router.get('/resources/:name', (req, res) => {
    res.sendFile(path.join(__dirname + "/resources/" + req.params.name))
})

router.get('/test/test', (req, res) => {
    db.all_prizes_and_tiers((result) => {console.log(JSON.stringify(result))})
})

// Attach routes at root
app.use('/', router)

// Start server
app.listen(port)
console.log("Now serving on " + ip.address() + ":" + port + ".")
