var express = require('express');
var bodyParser = require('body-parser');
var accounts = require('./accounts.json');


var app = express();
app.use(bodyParser.json());

app.get('/api/accounts', function(req, res, next) {
    var results, query = req.query;
    if (query.cardtype) {
        results = accounts.filter(function(e) {
            // console.log(e.card_type);
            return e.card_type === query.cardtype;
        });
        // console.log(results);
        res.send(results);
    } else if (query.firstname) {
        // console.log("firstname1", query.firstname);
        results = accounts.filter(function(e) {
            return e.first_name.toLowerCase() === query.firstname.toLowerCase();
        });
        // console.log("firstname results",results);
        res.send(results);
    } else if (query.lastname) {
        results = accounts.filter(function(e) {
            return e.last_name.toLowerCase() === query.lastname.toLowerCase();
        });
        // console.log(results);
        res.send(results);
    } else if (query.balance) {
        results = accounts.filter(function(e) {
            return +e.balance === +query.balance;
        });
        // console.log(results);
        res.send(results);
    } else if (query.cardtype) {
        results = accounts.filter(function(e) {
            return e.card_type.toLowerCase() === query.cardtype.toLowerCase();
        });
        // console.log(results);
        res.send(results);
    } else {
        // console.log(results);
        res.send(accounts);
    }
});

app.get('/api/accounts/:id', function(req, res, next) {
    var id = req.params.id,
        results, flag;
    accounts.map(function(e, i) {
        if (e.id === +id) {
            res.json(e);
            flag = true;
        }
    });
    if (!flag) res.sendStatus(404);
});

app.post('/api/accounts', function(req, res, next) {
    var newId = accounts.length + 1;
    // console.log(req.body.approved_states);
    var states = [req.body.approved_states]; //This may be a problem.  Check approvestates if this doesn't work
    var newAccount = {
        id: newId,
        card_number: req.body.card_number,
        card_type: req.body.card_type,
        balance: req.body.balance,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        approved_states: states
    };
    accounts.push(newAccount);
    // console.log("New Account", newAccount);
    res.json(newAccount);
    // console.log("Starting Here");
});

app.post('/api/accounts/cardtype/:id', function(req, res, next) {
    var type = req.body.card_type;
    var id = Number(req.params.id);
    var results = {};
    accounts.map(function(e, i) {
        if (e.id === id) {
            e.card_type = type;
            // console.log("Card", e);
            res.json(e);
        }
    });
});

app.post('/api/accounts/approvedstates/:id', function(req, res, next) {
    var id = +req.params.id;
    var newStates = req.body.add;
    accounts.map(function(e, i) {
        if (e.id === id) {
            e.approved_states.push(newStates);
            res.sendStatus(200);
        } //check the json that is being added.  This may cause problems
    });
});

app.delete('/api/accounts/approvedstates/:accountId/', function(req, res, next) {
    var xState = req.query.state;
    var id = +req.params.accountId;
    accounts.map(function(e, i) {
        if (e.id === id) {
            e.approved_states.splice(e.approved_states.indexOf(xState), 1);
            res.json(e.approved_states);
        }
    });
});

app.delete('/api/accounts/:accountId', function(req, res, send) {
    var ids = +req.params.accountId;
    accounts.map(function(e, i) {
        if (e.id === ids) {
            accounts.splice(i, 1);
            res.sendStatus(200);
        }
    });
});

app.put('/api/accounts/:accountId', function(req, res, next) {
    var ids = +req.params.accountId;
    accounts.map(function(e, i) {
        if (e.id === ids) {
            for (var key in req.body) {
                e[key] = req.body[key];
            }
            res.json(e);
        }
    });
});

app.listen(3000, function() {
    console.log('Listening on port', 3000);
});

module.exports = app;
