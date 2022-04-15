const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();

//Welcome route
app.get('/api', (req, res) => {
    res.json({
        message: 'Welcome to API'
    })
})

// NOTE: passing a middleware function.. Use Token to access protected route
app.post('/api/posts', verifyToken, (req, res) => {

    // Get the data(user payload) was passed in /api/login
    jwt.verify(req.token, 'secretkey', (err, authData) => { // pass in the token, authData: user details
        if (err) {
            res.sendStatus(403);
        } else {
            res.json({
                message: 'Post Created...',
                authData
            })
        }
    })
})

// A way to get the token
app.post('/api/login', (req, res) => {

    // Goes through : send the login details, authentication stuff to db, return the user (skipping) 
    // Mock user : returned user
    const user = {
        id: 1,
        username: 'manu',
        email: 'manushreemallaraju@gmail.com'
    }

    // sign asyncronously : {payload}, 'secretkey', callback
    jwt.sign({ user }, 'secretkey', { expiresIn: '300s' }, (err, token) => { //payload.. { user: user } => ES6 : user
        res.json({
            token //token: token => ES6
        })
    });
})

// NOTE: FORMAT OF TOKEN
// Authorization: 'Bearer <access_token>' => pull the token out..

// Verify Token : middleware function.. '/api/posts'
function verifyToken(req, res, next) { // do something, then call next to proceed

    // Get auth header value
    const bearerHeader = req.headers[`authorization`];

    // Check if bearer is undefined
    if (typeof bearerHeader !== 'undefined') {

        //Split at the space
        const bearer = bearerHeader.split(' ');

        // Get token from array
        const bearerToken = bearer[1];

        // Set the token
        req.token = bearerToken;

        // Call Next middleware
        next();

    } else {
        // Forbidden
        res.sendStatus(403);
    }

}

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log('Server stated on 5000');
})



