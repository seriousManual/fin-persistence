var expect = require('chai').expect;

var OutputStream = require('../lib/OutputStream');
var Persistence = require('../lib/Persistence');

function createConnectionMock() {
    var log = [];

    return {
        log: log,
        query: function(query, parameters, callback) {
            log.push([query, parameters]);

            process.nextTick(function() {
                callback(null, [
                    {
                        id: 'fooId',
                        mandant_id: 'fooMandant',
                        purpose: 'fooPurpose',
                        classification: 'fooClassi',
                        partner: 'fooPartner',
                        partnerAccountNumber: 'fooPartnerAcountNr',
                        partnerBank: 'fooBank',
                        amount: 1,
                        date: '2014-01-01 10:10:10'
                    }
                ]);
            });

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
    it('should', function(done) {
        var connectionMock = createConnectionMock();
        var myPersistence = new Persistence(connectionMock);

        myPersistence.loadLatestPosition(1, function(error, result) {
            expect(result.mandant()).to.equal('fooMandant');
            expect(result.date().format('YYYY-MM-DD')).to.equal('2014-01-01');
            expect(result.purpose()).to.equal('fooPurpose');
            expect(result.classification()).to.equal('fooClassi');
            expect(result.partner()).to.equal('fooPartner');
            expect(result.partnerAccountNumber()).to.equal('fooPartnerAcountNr');
            expect(result.partnerBank()).to.equal('fooBank');
            expect(result.amount()).to.equal(1);

            expect(connectionMock.log).to.deep.equal([[
                'SELECT * FROM positions WHERE (mandant_id = ?) ORDER BY id DESC LIMIT 1',
                [1]
            ]]);

            done();
        });
    });
});