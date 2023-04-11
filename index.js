const functions = require("firebase-functions")
const cors = require("cors")
const app = require('express')();

app.use(cors())
const PORT = 9090;


let users = [
    {
        name: 'Dwight',
        email: 'dwight@diesmo.co',
        password: 'password',
        balance: 0.0
    }
]


app.get('/', (req, res) => {
    res.status(200);
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ msg: 'hello_world' }));
});


app.get('/users', (req, res) => {
    res.status(200);
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(users));
});


app.get('/users/:email/:password', (req, res) => {
    const { email, password } = req.params;

    let existingUser = {}
    users.map((user) => {
        if (user.email == email && user.password == password) {
            existingUser = user;
        }
    })
    res.status(200);
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(existingUser));
});

app.post('/users/:name/:email/:password', (req, res) => {
    const { name, email, password } = req.params;

    let userExists = false;
    users.map((user) => {
        if (user.email == email) {
            userExists = true;
        }
    });

    if (!userExists) {
        let newUser = {
            name: name, email: email, password: password, balance: 0.0
        }
        users = [...users, newUser];
        res.status(201);
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(newUser));
    } else {
        res.status(400);
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({user_exists: userExists}));
    }
});


app.post('/deposit/:email/:amount', (req, res) => {
    const { email, amount } = req.params;

    let float_amount = parseFloat(amount)
    if (isNaN(float_amount)) {
        res.status(404);
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({error: `${float_amount} is not a valid input`}));
    } else {
        let userObject = {};
        let userExists = false;
        users.map((user) => {
            if (user.email == email) {
                userExists = true;
            }
            user.balance += float_amount;
            userObject = user;
        });

        if (!userExists) {
            res.status(404);
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({user_exists: userExists}));
        } else {
            res.status(201);
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(userObject));
        }
    }
});

app.post('/withdraw/:email/:amount', (req, res) => {
    const { email, amount } = req.params;

    let float_amount = parseFloat(amount)
    if (isNaN(float_amount)) {
        res.status(404);
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({error: `${float_amount} is not a valid input`}));
    } else {
        let userObject = {};
        let userExists = false;
        users.map((user) => {
            if (user.email == email) {
                userExists = true;
            }
            user.balance -= float_amount;
            userObject = user;
        });

        if (!userExists) {
            res.status(404);
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({user_exists: userExists}));
        } else {
            res.status(201);
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(userObject));
        }
    }
});


app.listen(
    PORT,
    () => console.log(`Live on http://localhost:${PORT}`)
)

exports.app = functions.https.onRequest(app)