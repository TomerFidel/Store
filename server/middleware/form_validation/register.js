var db = require('../../config/db');
var con = db.getPool();

module.exports = {
    validate: function(req, res, next) {
        const { tz, first_name, last_name, username, email, password, city, street } = req.body;

        if (tz.length < 1 || 
            tz.length > 10 ||
            first_name.length < 4 ||
            first_name.length > 30 ||
            last_name.length < 4 ||
            last_name.length > 30 ||
            username.length < 4 ||
            username.length > 30 ||
            !emailValidation(email) ||
            password.length < 4 ||
            password.length > 30 ||
            city.length < 4 ||
            city.length > 30 ||
            street.length < 4 ||
            street.length > 30 ) return res.status(400).end();

        let q = "SELECT * FROM `users` WHERE tz = ? OR username = ? OR email = ? LIMIT 1";
        let entries = [tz, username, email];
        con.query(q, entries, function(err, result) {
            if (err) return res.status(500).end();

            if (result.length == 1) return res.status(400).end();

            next();
        });

        
    }
}

function emailValidation(email) {
    return /\S+@\S+\.\S+/.test(email)
}
