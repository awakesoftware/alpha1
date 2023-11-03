const { check, query } = require('express-validator');

exports.editUserAboutValidator = [
    check('about')
        .trim()
        .isLength({ min: 0, max: 250 }).withMessage('About status must be under 250 characters.'),
]

exports.userSignupValidator = [
    // check('image')
    //     .not().isEmpty().withMessage('User image is required.'),
    check('firstName')
        .trim()
        .exists().withMessage('First name is required.')
        .not().isEmpty().withMessage('First name cannot be empty.')
        .isString().withMessage('First name must be a string.')
        .isLength({ min: 1, max: 20 }).withMessage('First name must be between 1-20 characters.'),
    check('lastName')
        .trim()
        .exists().withMessage('Last name is required.')
        .not().isEmpty().withMessage('Last name cannot be empty.')
        .isString().withMessage('Last name must be a string.')
        .isLength({ min: 1, max: 20 }).withMessage('Last name must be between 1-20 characters.'),
    check('email')
        .trim()
        .toLowerCase()
        .exists().withMessage('A valid email is required.')
        .not().isEmpty().withMessage('Email cannot be empty.')
        .isString().withMessage('Email must be a string.')
        .isEmail().normalizeEmail().withMessage('Email must be in the correct format.'),
    check('username')
        .trim()
        .toLowerCase()
        .exists().withMessage('Username is required.')
        .not().isEmpty().withMessage('Username cannot be empty.')
        .isString().withMessage('Username must be a string.')
        .isLength({ min: 6, max: 18 }).withMessage('Username must be between 6-18 characters.'),
    check('password')
        .trim()
        .exists().withMessage('Password is required.')
        .not().isEmpty().withMessage('Password cannot be empty.')
        .isString().withMessage('Password must be a string.')
        .isLength({ min: 6, max: 25 }).withMessage('Password must be between 6-25 characters.'),
    check('phone')
        .trim()
        .exists().withMessage('Phone number is required.')
        .not().isEmpty().withMessage('Phone number cannot be empty.')
        .isString().withMessage('Phone number must be a string.')
        .isLength({ min: 10, max: 10 }).withMessage('Phone number must be 10 digits.'),
    // check('videos')
    //     .isEmpty(),
    // check('about')
    //     .isEmpty()
    //     .trim()
    //     // .not().isEmpty().withMessage('About status cannot be empty.')
    //     .isLength({ min: 0, max: 250 }).withMessage('About status must be under 250 characters.'),
    // check('later')
    //     .isEmpty(),
    // check('playlists')
    //     .isEmpty(),
    // check('liked')
    //     .isEmpty(),
    // check('history')
    //     .isEmpty(),
    // check('memberSince')
    //     .not().isEmpty(),
    // check('isAdmin')
    //     .equals(false)
]

exports.userLoginValidator = [
    check('email')
        .trim()
        .toLowerCase()
        .exists().withMessage('A valid email is required.')
        .not().isEmpty().withMessage('Email cannot be empty.')
        .isString().withMessage('Email must be a string.')
        .isEmail().normalizeEmail().withMessage('Email must be in the correct format.'),
    check('password')
        .trim()
        .exists().withMessage('Password is required.')
        .not().isEmpty().withMessage('Password cannot be empty.')
        .isString().withMessage('Password must be a string.')
        .isLength({ min: 6, max: 25 }).withMessage('Password must be between 6-25 characters.'),
]