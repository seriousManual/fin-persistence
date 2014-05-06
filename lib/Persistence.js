var squel = require('squel');

var OutputStream = require('./OutputStream');

function Persistence(connection) {
    this._connection = connection;
}

Persistence.prototype._query = function(query, parameters) {
    return this._connection.query(query.toString(), parameters).stream();
};

Persistence.prototype._wrap = function (stream) {
    return stream.pipe(new OutputStream());
};

Persistence.prototype.loadLatestPosition = function (mandant) {
    var query = squel.select()
        .from('positions')
        .where('mandant_id = ?')
        .order('id', false)
        .limit(1);

    return this._wrap(this._query(query, [mandant]));
};

module.exports = Persistence;