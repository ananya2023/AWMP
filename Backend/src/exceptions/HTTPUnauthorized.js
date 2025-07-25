/**
* HTTPUnauthorized
* 
* @author Vikas Sood <vikas@giskernel.com>
* @returns {Object}
* @name HTTPUnauthorized
* @alias HTTPUnauthorized Exception
* @param {Null}
* 
*/
const HTTPError = require('./HTTPError')

class HTTPUnauthorized extends HTTPError {
    constructor(message = 'Bad Credentials') {
        super(401, message)
    }
}

module.exports = HTTPUnauthorized
