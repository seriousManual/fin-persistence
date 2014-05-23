var moment = require('moment');

var common = require('fin-common');
var positionFields = require('./fields').Position;
var Position = common.Models.Position;

module.exports = function (data) {
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