const { check } = require('express-validator');

exports.postVideoValidator = [
    check('title')
        .trim()
        .exists().withMessage('Title is required.')
        .not().isEmpty().withMessage('Title cannot be empty.')
        .isString().withMessage('Title must be a string.')
        .isLength({ min: 5, max: 75 }).withMessage('Title must be between 5-75 characters long.'),
    check('description')
        .trim()
        .exists().withMessage('Description is required.')
        .not().isEmpty().withMessage('Description cannot be empty.')
        .isString().withMessage('Description must be a string.')
        .isLength({ min: 5, max: 250 }).withMessage('Description must be between 5-75 characters long.'),
    check('category')
        .trim()
        .exists().withMessage('Category is required.')
        .not().isEmpty().withMessage('Category cannot be empty.')
        .isString().withMessage('Category must be a string.')
        .isIn([
            'default',
            'action',
            'animation',
            'bts',
            'fantasy',
            'historical',
            'thriller'
        ]).withMessage('Invalid category.'),
    // check('private')
    //     .trim()
    //     .exists().withMessage('Video privacy is undefined.')
    //     .not().isEmpty().withMessage('Video privacy cannot be undefined.')
    //     .isBoolean().withMessage('Video privacy must be set to TRUE or FALSE.')
    //     .equals(false).withMessage('Video privacy must be set to FALSE.'),
    // check('thumbnailPath')
    //     .trim()
    //     .exists().withMessage('Thumbnail image is required.')
    //     .not().isEmpty().withMessage('Thumbnail image cannot be empty.')
    //     .isString().withMessage('Thumbnail image must be a string.'),
    // check('filePath')
    //     .trim()
    //     .exists().withMessage('Video file is required.')
    //     .not().isEmpty().withMessage('Video file cannot be empty.')
    //     .isString().withMessage('Video file must be a string.'),
    // check('views')
    //     .trim()
    //     .exists().withMessage('Views are undefined.')
    //     .not().isEmpty().withMessage('Views cannot be undefined.')
    //     .isNumeric().withMessage('Views must a number.')
    //     .equals(0).withMessage('Views must be set to 0.'),
    // check('likes')
    //     .trim()
    //     .exists().withMessage('Likes are undefined.')
    //     .not().isEmpty().withMessage('Likes cannot be undefined.')
    //     .isNumeric().withMessage('Likes must a number.')
    //     .equals(0).withMessage('Likes must be set to 0.'),
    // check('displaying')
    //     .trim()
    //     .exists().withMessage('Video displaying is undefined.')
    //     .not().isEmpty().withMessage('Video displaying cannot be undefined.')
    //     .isBoolean().withMessage('Video displaying must be set to TRUE or FALSE.')
    //     .equals(true).withMessage('Video displaying must be set to TRUE.'),
]