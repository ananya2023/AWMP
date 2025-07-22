/**
* HTTPBadRequest
* 
* @author Vikas Sood <vikas@giskernel.com>
* @returns {Object}
* @name HTTPBadRequest
* @alias HTTPBadRequest Exception
* @param {Null}
* 
*/
const HTTPError = require('./HTTPError')

class HTTPBadRequest extends HTTPError {
    constructor(message = 'Bad Request') {
        super(400, message)
    }
}

module.exports = HTTPBadRequest
