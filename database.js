var mysql = require("mysql");

exports.db = class database {

    // Creates a new connection with healthy horizons database
    constructor() {
        let creds = require("./db_credentials.json")
        this.connection = mysql.createConnection(creds)
        this.connection.connect()
        console.log("Connected to database!")
    }

    // Ends connection with database
    destroy() {
        this.connection.end()
    }

    // Queries the database with the given query and parameters
    query_db(query, params, callback) {
        this.connection.query(query, params, (error, results) => {
            if (error) throw error
            callback(results)
        })
    }

    /// Task related functions

    // Gets all tasks
    all_tasks(callback) {
        let q = "SELECT task.*, tasktype.type FROM task, tasktype WHERE task.type_id = tasktype.id"
        this.query_db(q, [], callback)
    }

    // Gets the task of the given id
    task(id, callback) {
        let q = "SELECT * FROM task, tasktype WHERE task.type_id = tasktype.id AND id = ?"
        this.query_db(q, [id], callback)
    }

    // Adds the given task
    add_task(task, callback) {
        let q = "INSERT INTO task SET ?;"
        this.query_db(q, [task], callback)
    }

    /// User related functions

    // Gets all users
    all_users(callback) {
        let q = `SELECT * from user;`
        this.query_db(q, [], callback)
    }

    // Gets a user of the given id
    user(id, callback) {
        let q = `SELECT * FROM user WHERE id = ?;`
        this.query_db(q, [id], callback)
    }

    // Adds the current user
    add_user(user, callback) {
        let q = "INSERT INTO user SET ?"
        this.query_db(q, user, callback)
    }

    /// Usertask related functions

    usertasks(user_id, week_num, semester, callback) {
        let q = "SELECT usertask.* FROM usertask WHERE user_id = ? AND week = ? AND semester_id = ?"
        this.query_db(q, [user_id, week_num, semester], callback)
    }

    // Given a user_id, week_num, update the database
    // with the contents of data.
    // data: {water: 4, fruit: 5, thousand_steps: 2}
    update_usertasks(user_id, week_num, semester, data, callback) {
        console.log(week_num)
        let q = "";
        for (let [task_id, freq] of Object.entries(data)) {
            let oneq = mysql.format("INSERT INTO usertask (user_id, week, semester_id, task_id, frequency) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE frequency = ?; ", [user_id, week_num, semester, task_id, freq, freq]);
            q += oneq
        }
        this.query_db(q, [], callback)
    }


    /// Prize and tier related functions

    all_tiers(callback) {
        let q = "SELECT * FROM tier ORDER BY points ASC"
        this.query_db(q, [], callback)
    }

    all_prizes(callback) {
        let q = "SELECT * FROM prize"
        this.query_db(q, [], callback)
    }

    // Move this functionality somewhere else
    all_prizes_and_tiers(callback) {
        this.all_tiers(tiers => {
            this.all_prizes(prizes => {
                let result = []
                tiers.forEach(tier => {
                    let prize_names = prizes.filter(prize => prize.tier_id == tier.id).map(prize => prize.description)
                    result.push({
                        name: tier.name.replace(/^\w/, c => c.toUpperCase()),
                        point: tier.points,
                        prizes: prize_names
                    })
                })
                console.log(JSON.stringify({result: result}))
                callback(result)
            })
        })
    }
}
