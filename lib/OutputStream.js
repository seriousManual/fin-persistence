var stream = require('stream');
var util = require('util');
var Transform = stream.Transform;

var moment = require('moment');

var common = require('fin-common');
var Position = common.Models.Position;

var positionFields = require('./fields').Position;

function OutputStream(options) {
    options = options || {};
    options.objectMode = true;

    Transform.call(this, options);
}

util.inherits(OutputStream, Transform);

OutputStream.prototype._transform = function (chunk, enc, cb) {
    try {
        this.push(this._convertData(chunk));
        cb();
    } catch (error) {
        this.emit('error', error);
    }
};

OutputStream.prototype._convertData = function (data) {
    var positionData = {
        id: data[positionFields.id],
        mandant: data[positionFields.mandant],
        date: moment(data[positionFields.date]),
        classification: data[positionFields.classi],
        purpose: data[positionFields.purpose],
        partner: data[positionFields.partner],
        partnerAccountNumber: data[positionFields.partnerAccountNumber],
        partnerBank: data[positionFields.partnerBank],
        amount: data[positionFields.amount]
    };

    return new Position(positionData);
};

module.exports = OutputStream;