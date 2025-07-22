/**
* HTTPInternalServerError
* 
* @author Vikas Sood <vikas@giskernel.com>
* @returns {Object}
* @name HTTPInternalServerError
* @alias HTTPInternalServerError Exception
* @param {Null}
* 
*/
const HTTPError = require('./HTTPError')

class HTTPInternalServerError extends HTTPError {
    constructor(message = 'Internal Server Error') {
        super(500, message)
    }
}

module.exports = HTTPInternalServerError
