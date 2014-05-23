var squel = require('squel');

var createPosition = require('./createPosition');
var OutputStream = require('./OutputStream');

function Persistence(connection) {
    this._connection = connection;
}

Persistence.prototype._queryStream = function(query, parameters) {
    return this._connection.query(query.toString(), parameters).stream();
};

Persistence.prototype._query = function(query, parameters, callback) {
    return this._connection.query(query.toString(), parameters, function(error, rows, fields) {
        if (error) return callback(error);

        callback(null, rows.map(function(positionData) {
            return createPosition(positionData);
        }));
    });
};

Persistence.prototype._wrap = function (stream) {
    return stream.pipe(new OutputStream());
};

Persistence.prototype.loadLatestPosition = function (mandant, callback) {
    var query = squel.select()
        .from('positions')
        .where('mandant_id = ?')
        .order('id', false)
        .limit(1);

    this._query(query, [mandant], function (error, result) {
        if (error) return callback(error);

        if (result.length > 0) {
            callback(null, result[0])
        } else {
            callback(null, null);
        }
    });
};

module.exports = Persistence;