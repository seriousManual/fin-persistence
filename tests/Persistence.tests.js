var expect = require('chai').expect;

var OutputStream = require('../lib/OutputStream');
var Persistence = require('../lib/Persistence');

function createConnectionMock() {
    var log = [];

    return {
        log: log,
        query: function(query, parameters) {
            log.push([query, parameters]);

            return {
                stream: function() {
                    return {
                        pipe: function(stream) {
                            return stream;
                        }
                    }
                }
            }
        }
    };
}

describe('persistence', function() {
    it('should', function() {
        var connectionMock = createConnectionMock();
        var myPersistence = new Persistence(connectionMock);

        var outputStream = myPersistence.loadLatestPosition(1);

        expect(outputStream).to.be.instanceof(OutputStream);
        expect(connectionMock.log).to.deep.equal([[
            'SELECT * FROM positions WHERE (mandant_id = ?) ORDER BY id DESC LIMIT 1',
            [1]
        ]]);
    });
});