/* DEPENDENCIES */
const express = require('express');
const userRouter = express.Router();


/* CUSTOM IMPORTS */
const usersController = require('../controllers/users-controller');
const fileUpload = require('../middleware/file-upload');
const {
    userSignupValidator,
    userLoginValidator,
    editUserAboutValidator
} = require('../validators/userAuth');


/* LOCAL VARIABLES */
const {
    getAllUsers,
    getUserById,
    getUsersBySearch,
    getUserAbout,
    userSignup,
    userLogin,
    getUserAdmin,
    getMySubscribers,
    getSubscribedTo,
    subscribeToUser,
    editUserAbout,
    editUserProfilePicture
} = usersController;


/* ROUTES */
// get all users
userRouter.get('/', getAllUsers);

// get user by search
userRouter.get('/search', getUsersBySearch);

// get users about
userRouter.get('/about/:uid', getUserAbout);

// get user by id
userRouter.get('/:uid', getUserById);

// user signup
userRouter.post('/signup',
    fileUpload.single('image'),
    userSignupValidator,
    userSignup
);

// user login
userRouter.post('/login',
    userLoginValidator,
    userLogin
);

// get admin status
userRouter.get('/admin/:uid', getUserAdmin);

// get users mySubscribers
userRouter.get('/mysubscribers/:uid', getMySubscribers);

// get user subscribedTo
userRouter.get('/subscribedto/:uid', getSubscribedTo);

// subscribe to user
userRouter.post('/subscribe/:sid/:rid', subscribeToUser);

// edit users about
userRouter.put('/about/:uid',
    editUserAboutValidator,    
    editUserAbout
);

// edit profile picture
userRouter.put('/profile/edit/picture/:uid', editUserProfilePicture);


/* EXPORTS */
module.exports = userRouter;