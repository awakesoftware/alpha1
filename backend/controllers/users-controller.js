/* DEPENDENCIES */
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');


/* CUSTOM IMPORTS */
const HttpError = require('../models/http-error');
const User = require('../models/userSchema');


/* ROUTES */
const getAllUsers = async ( req, res, next ) => {
    let users;

    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return next(new HttpError(`Error: ${ errors.array()[0].msg }`, 422));
    }

    try {
        users = await User.find({}, "email firstName lastName username image");
    } catch (error) {
        return next(new HttpError('Internal error; users cannot be retrieved. ERR_CODE:5.1', 500));
    }

    if(!users || users.length === 0) {
        return next(new HttpError('No users found.', 404));
    }
    
    return res.status(200).json({ users: users.map( user => user.toObject({ getters: true }) ) });
}


const getUsersBySearch = async ( req, res, next ) => {
    const { username } = req.query;
    let pattern;

    try {
        pattern = await new RegExp(username);
    } catch (error) {
        return next(new HttpError('No pattern found.', 404));
    }

    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return next(new HttpError(`Error: ${ errors.array()[0].msg }`, 422));
    }

    try{
        await User.find(!username ? new HttpError('Internal error; users cannot be retrieved. ERR_CODE:5.2', 500) : { username: { $regex: pattern, $options: 'i' } }, (err, name) => {
            if (err) {
                res.status(500);
                return next(err.error);
            }
            return res.status(200).send(name);
        })
    } catch (error) {}
};


const getUserById = async ( req, res, next ) => {
    const uid = req.params.uid;
    let user;

    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return next(new HttpError(`Error: ${ errors.array()[0].msg }`, 422));
    }

    try {
        user = await User.findById(uid, "email firstName lastName username image");
    } catch (error) {
        return next(new HttpError('Internal error; user cannot be retrieved. ERR_CODE:5.3', 500));
    }

    if(!user || user.length === 0) {
        return next(new HttpError('Could not find a user.', 404));
    }

    return res.status(200).json({ user: user.toObject({ getters: true }) });
}


const getUserAbout = async ( req, res, next ) => {
    const uid = req.params.uid;
    let user;

    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return next(new HttpError(`Error: ${ errors.array()[0].msg }`, 422));
    }

    try {
        user = await User.findById(uid, "about");
    } catch (error) {
        return next(new HttpError('Internal error; user cannot be retrieved. ERR_CODE:5.2', 500));
    }

    if(!user || user.length === 0) {
        return next(new HttpError('Could not find a user.', 404));
    }

    return res.status(200).json({ user: user.toObject({ getters: true }) });
}


const userSignup = async ( req, res, next ) => {
    
    const { firstName, lastName, email, username, password, phone, /* address */ } = req.body;

    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return next(new HttpError(`Error: ${ errors.array()[0].msg }`, 422));
    }

    let existingUser;
    // try {
    //     existingUser = await User.findOne({ email: email }, (err, user) => {
    //         if(err) {
    //             res.status(500);
    //             return next(err);
    //         }
    //         if(user){
    //             return next(new HttpError('Email/user already exists, please login instead.', 403))
    //         }
    //     });

    // } catch (error) {
    //     return next(new HttpError('Internal error; signup failed. ERR_CODE:6.1', 500));
    // }
    
    if(existingUser) {
        return next(new HttpError('Email/user already exists, please login instead.', 422));
    }

    let hashedPassword;
    try {
        hashedPassword = await bcrypt.hash(password, 12);
        
    } catch (error) {
        return next(new HttpError('Internal error; signup failed. ERR_CODE:6.2', 500));
    }
    
    const newUser = new User({
        image: req.file.path,
        firstName,
        lastName,
        email: email.toLowerCase(),
        username: username.toLowerCase(),
        password: hashedPassword,
        phone,
        // address,
        videos: [],
        notifications: [],
        subscribedTo: [],
        mySubscribers: []
    });
    
    if(password.length <= 5) {
        return next(new HttpError('Password must be 6 or more characters.', 422));
    }
    if(username.length <= 5) {
        return next(new HttpError('Username must be 6 or more characters.', 422));
    }

    try {
        await newUser.save();

    } catch (error) {
        // possible missing field error cause
        return next(new HttpError('Internal error; signup failed. ERR_CODE:6.3', 500));
    }

    let token;
    try {
        token = jwt.sign(
            {
                userId: newUser.id,
                email: newUser.email,
                image: newUser.image,
                username: newUser.username,
                firstName: newUser.firstName,
                lastName: newUser.lastName
            },
            process.env.SECRET,
            { expiresIn: '8h' }
        )

    } catch (error) {
        return next(new HttpError('Internal error; signup failed. ERR_CODE:6.4', 500));

    }

    return res.status(201).json({
        userId: newUser.id,
        email: newUser.email,
        image: newUser.image,
        username: newUser.username,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        token: token
    });
}


const userLogin = async ( req, res, next ) => {
    const { email, password } = req.body;

    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return next(new HttpError(`Error: ${ errors.array()[0].msg }`, 422));
    }

    let existingUser;
    try {
        existingUser = await User.findOne({ email: email.toLowerCase() }, (err, user) => {
            // if(err) {
            //     res.status(500);
            //     return next(err);
            // }
            // if(!user) {
            //     return next(new HttpError('Invalid credentials; login failed. ERR_CODE:7.2', 403));
            // }
        });
    } catch (error) {
        return next(new HttpError('Internal error; login failed. ERR_CODE:7.1', 500));
    }

    if(!existingUser) {
        return next(new HttpError('Invalid credentials; login failed. ERR_CODE:7.2', 403));
    }

    let isValidPassword = false;
    try {
        isValidPassword = await bcrypt.compare(password, existingUser.password);
        
    } catch (error) {
        return next(new HttpError('Internal error; login failed. ERR_CODE:7.3', 500));
    }
    
    if(!isValidPassword) {
        return next(new HttpError('Invalid credentials; login failed. ERR_CODE:7.2', 403));
    }

    let token;
    try {
        token = jwt.sign(
            {
                userId: existingUser.id,
                email: existingUser.email,
                image: existingUser.image,
                username: existingUser.username,
                firstName: existingUser.firstName,
                lastName: existingUser.lastName
            },
            process.env.SECRET,
            { expiresIn: '8h' }
        )

    } catch (error) {
        return next(new HttpError('Internal error; login failed. ERR_CODE:7.4', 500));
    }

    return res.status(200).json({
        userId: existingUser.id,
        email: existingUser.email,
        image: existingUser.image,
        username: existingUser.username,
        firstName: existingUser.firstName,
        lastName: existingUser.lastName,
        token: token
    });
}


const getUserAdmin = async ( req, res, next ) => {
    const uid = req.params.uid;
    let adminStatus;
    let user;

    try {
        user = await User.findById({_id: uid}, 'isAdmin _id');
    } catch (error) {
        return next(new HttpError('Internal error; user cannot be retrieved. ERR_CODE:5.2', 500));
    }

    if(user.isAdmin === true && user.id === uid) {
        adminStatus = true;
    } else {
        return next(new HttpError('Internal error; ERR_CODE:99.4', 500));
    }

    return res.status(200).json({
        adminStatus: adminStatus
    });
}


const getMySubscribers = async ( req, res, next ) => {
    let uid = req.params.uid;

    let user;

    try {
        user = await User.find({_id: uid}, 'mySubscribers');
    } catch (error) {
        return next(new HttpError('Internal error; user cannot be retrieved. ERR_CODE:5.2', 500));
    }

    return res.status(200).json({ user: user });
}


const getSubscribedTo = async ( req, res, next ) => {
    let uid = req.params.uid;

    let user;

    try {
        user = await User.find({_id: uid}, 'subscribedTo');
    } catch (error) {
        return next(new HttpError('Internal error; user cannot be retrieved. ERR_CODE:5.2', 500));
    }

    return res.status(200).json({ user: user });
}


const subscribeToUser = async ( req, res, next ) => {
    let sid = req.params.sid;
    let rid = req.params.rid;
    let sender;
    let receiver;

    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return next(new HttpError(`Error: ${ errors.array()[0].msg }`, 422));
    }

    try {
        sender = await User.findById(sid);
    } catch (error) {
        return next(new HttpError('Internal error; user not found, please try again. ERR_CODE:2.1', 500));
    }

    try {
        receiver = await User.findById(rid);
    } catch (error) {
        return next(new HttpError('Internal error; user not found, please try again. ERR_CODE:2.1', 500));
    }
    
    // if user is not in DB
    if(!sender || !receiver) {
        return next(new HttpError('User not found.', 404));
    }


    try {
        let foundIndex = sender.subscribedTo.findIndex(u => u.toString() === rid);

        if(foundIndex !== -1) {
            return next(new HttpError(`You are already subscribed to ${receiver.username}`, 404));
        }
    } catch (error) {
        return next(new HttpError(`Internal error - 324.2`, 404));
    }

    try {
        sender.subscribedTo.push(rid);
        sender.save();
        try {
            receiver.mySubscribers.push(sid);
            receiver.save();
            
        } catch (error) {
            return next(new HttpError(`Internal error - 324.3`, 404));
        }
    } catch (error) {
        return next(new HttpError(`Internal error - 324.3`, 404));
    }
    
    return res.status(200).json({ message: `Subscribed to ${receiver.username}` });
}


const editUserAbout = async ( req, res, next ) => {
    const uid = req.params.uid;
    const { about } = req.body;
    let user;

    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return next(new HttpError(`Error: ${ errors.array()[0].msg }`, 422));
    }

    try {
        user = await User.findById(uid, "about");
    } catch (error) {
        return next(new HttpError('Internal error; user cannot be retrieved. ERR_CODE:5.2', 500));
    }

    if(!user || user.length === 0) {
        return next(new HttpError('Could not find a user.', 404));
    }


    // const errors = validationResult(req);
    // if(!errors.isEmpty()) {
    //     return next(new HttpError('Invalid inputs, please check data specifications.', 422));
    // }

    user.about = about;
    
    try {
        await user.save();
    } catch (error) {
        return next(new HttpError('Internal error; video was not updated. ERR_CODE:3.2', 500));
    }
        
    return res.status(200).json({ user: user.toObject({ getters: true }) });
}


const editUserProfilePicture = async ( req, res, next ) => {
    let uid = req.params.uid;
    let image = req;

    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return next(new HttpError(`Error: ${ errors.array()[0].msg }`, 422));
    }

    let user;
    try {
        user = await User.findById( uid );

    } catch (error) {
        return next(new HttpError('Internal error; Cannot find user.', 500));
    }
    
    if(!user) {
        return next(new HttpError('Internal error; Cannot find user.', 500));
    }

    console.log(image);
    // user.image = req.file.path;

    try {
        await user.save();

    } catch (error) {
        // possible missing field error cause
        return next(new HttpError('Internal error; User was not updated.', 500));
    }

    return res.status(200).json({ user: user.toObject({ getters: true }) });
}


/* EXPORTS */
exports.getAllUsers = getAllUsers;
exports.getUserById = getUserById;
exports.getUsersBySearch = getUsersBySearch;
exports.getUserAbout = getUserAbout;
exports.userSignup = userSignup;
exports.userLogin = userLogin;
exports.getUserAdmin = getUserAdmin;
exports.subscribeToUser = subscribeToUser;
exports.getMySubscribers = getMySubscribers;
exports.getSubscribedTo = getSubscribedTo;
exports.editUserAbout = editUserAbout;
exports.editUserProfilePicture = editUserProfilePicture;