/* DEPENDENCIES */
const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const helmet = require('helmet');
const expressJwt = require('express-jwt');
const chalk = require('chalk');
require('dotenv').config();


/* CUSTOM IMPORTS */
const userRouter = require('./routes/user-routes');
const videoRouter = require('./routes/video-routes');
const playlistRouter = require('./routes/playlist-routes');
const commentRouter = require('./routes/comment-routes');
const notificationRouter = require('./routes/notification-routes');
const replyRouter = require('./routes/reply-routes');
const HttpError = require('./models/http-error');


/* MIDDLEWARE */
app.use(helmet());
app.use('/uploads/images', express.static(path.join('uploads', 'images')));
app.use('/uploads/thumbnails', express.static(path.join('uploads', 'thumbnails')));
app.use('/uploads/videos', express.static(path.join('uploads', 'videos')));
app.use(express.static('public'));  // serve static files
app.use(express.json());            // parse json data into req.body
app.use(express.urlencoded({ extended: false }));   // parse urlencoded data into req.body


/* CORS HEADERS */
module.exports = app.use((req, res, next) => {
    // any domain can send requests
    res.setHeader('Access-Control-Allow-Origin', '*');
    // which headers inc req's may have to be handled
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    // which HTTP methods may be used on frontend
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');

    next();
})


/* ROUTES */
// app.use('/api', expressJwt({ secret: process.env.SECRET, algorithms: ['HS256'] }));
app.use('/api/users', userRouter);
app.use('/api/videos', videoRouter);
app.use('/api/playlists', playlistRouter);
app.use('/api/comments', commentRouter);
app.use('/api/notifications', notificationRouter);
app.use('/api/replies', replyRouter);


/* 404 ROUTE */
app.use((req, res, next) => {
    return next(new HttpError('404 - Could not find this page.', 404));
})


/* ERROR HANDLER */
app.use(( error, req, res, next ) => {
    // unauthorized error
    if(error.name === 'UnauthorizedError') {
        return res.status(error.status).send({ errMsg: error.message });
    }

    // check if file has been attached
    if(req.file) {
        // deletes file/image on error
        fs.unlink(req.file.path, (err) => {
            console.log(chalk.red(err));
        });
    }

    // if response has already been sent
    if(res.headerSent) {
        return next(error);
    }

    // no response has been sent yet
    return res.status(error.code || 500).json({ message: error.message || "An unknown error occurred." });
})


/* CONNECTIONS */
if(process.env.ENVIRONMENT.toLowerCase() == 'staging') {
    mongoose.connect(
        process.env.STAGING_DATABASE,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        }
    )
        .then(() => {
            console.log(chalk.magenta.bold.inverse(`\nConnected to database: ${process.env.STAGING_DATABASE_NAME}`));
    
            app.listen(process.env.STAGING_PORT, () => {
                console.log(chalk.blue.bold.inverse(`Connected to server:  ${process.env.STAGING_PORT} STAGING`));
                console.log(chalk.green.bold.inverse(`Connected:   ${process.env.STAGING_CLIENT_URL}`));
                console.log(chalk.cyan(  '***********************************************************************************************'));
                console.log(chalk.yellow('*** WARNING: This is the development environment. Do not use it in a production deployment. ***'));
                console.log(chalk.cyan(  '***********************************************************************************************\n'));
            })
        })
        .catch((err) => {
            console.log(chalk.red(err));
        })

} else if(process.env.ENVIRONMENT.toLowerCase() == 'production') {
    mongoose.connect(
        process.env.PRODUCTION_DATABASE,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        }
    )
        .then(() => {
            console.log(chalk.magenta.bold.inverse(`\nConnected to database: ${process.env.PRODUCTION_DATABASE_NAME}`));
    
            app.listen(process.env.PRODUCTION_PORT, () => {
                console.log(chalk.blue.bold.inverse(`Connected to server:  ${process.env.PRODUCTION_PORT} PRODUCTION`));
                console.log(chalk.green.bold.inverse(`Connected:      ${process.env.PRODUCTION_CLIENT_URL}`));
                console.log(chalk.red('****************************************************************'));
                console.log(chalk.red('*** This is the production environment. DO NOT MAKE EDITS!!! ***'));
                console.log(chalk.red('****************************************************************\n'));
            })
        })
        .catch((err) => {
            console.log(chalk.red(err));
        })
}