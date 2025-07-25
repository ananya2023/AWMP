/**
 * Validation middleware functions
 */

const { check, validationResult, query, header, body, param } = require('express-validator')

module.exports = {
    failIfLimitAndOffsetAreInvalid: [
        query('limit')
            .trim()
            .optional()
            .isInt({ min: 1, max: 50 })
            .withMessage('Invalid value'),
        query('offset')
            .trim()
            .optional()
            .isInt({ min: 0 })
            .withMessage('Invalid value')
    ],
    validate: (req, res, next) => {
        const errors = validationResult(req)
        if (errors.isEmpty()) {
            return next()
        }
        const extractedErrors = []

        errors.array().map(err => extractedErrors.push({ [err.path]: err.msg }))
        const Response = { message: 'Bad Request', error: extractedErrors }

        /* Send Back An HTTP Response */
        res.status(400)['json'](Response)
        res.end()
    }

}
