const jwt = require('jsonwebtoken');
const HttpError = require("../models/http-error");

// Validate incoming request for token
module.exports = ( req, res, next ) => {
    // check req method === OPTIONS
    if(req.method === 'OPTIONS') {
        return next();
    }

    // check for token; added in authorization header
    try {
        const token = req.headers.authorization.split(' ')[1];
        
        if(!token) {
            throw new Error('Authentication failed. ERR_CODE:8.1');
        }
        // verify token; check if valid
            // returns object; payload encoded in the token (userid, email, token)
            // goes to catch block on failure
        const decodedToken = jwt.verify(token, process.env.SECRET);

        // can get userId, email from payload

        // add user data to req object
        req.userData = {
            userId: decodedToken.userId,
            email: decodedToken.email,
            image: decodedToken.image,
            username: decodedToken.username,
            firstName: decodedToken.firstName,
            lastName: decodedToken.lastName
        };

        next();

    } catch (error) {
        return next(new HttpError('Session expired. Please refresh and login.', 401));
        
    }

}