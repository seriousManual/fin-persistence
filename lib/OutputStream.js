var stream = require('stream');
var util = require('util');
var Transform = stream.Transform;

var createPosition = require('./createPosition');

function OutputStream() {
    Transform.call(this, {objectMode: true});
}

util.inherits(OutputStream, Transform);

OutputStream.prototype._transform = function (chunk, enc, cb) {
    try {
        this.push(createPosition(chunk));
        cb();
    } catch (error) {
        this.emit('error', error);
    }
};

module.exports = OutputStream;