var expect = require('chai').expect;
var moment = require('moment');

var OutputStream = require('../lib/OutputStream');

describe('outputStream', function() {
    var stream;

    beforeEach(function() {
        stream = new OutputStream();
    });

    it('should output an position instance', function(done) {
        var collection = [];

        stream.on('finish', function() {
            var entry = collection[0];

            expect(collection.length).to.equal(1);
            expect(entry.id()).to.equal(1);
            expect(entry.mandant()).to.equal(2);
            expect(entry.date().format('YYYY-MM-DD')).to.equal('2014-01-01');
            expect(entry.purpose()).to.equal('foo');
            expect(entry.classification()).to.equal('fooClassi');
            expect(entry.partner()).to.equal('partnerFoo');
            expect(entry.partnerAccountNumber()).to.equal('partnerFooAccountNumber');
            expect(entry.partnerBank()).to.equal('partnerFooBank');
            expect(entry.amount()).to.equal(100);

            done();
        });

        stream.on('data', function(data) {
            collection.push(data);
        });

        stream.write({
            id: 1,
            mandant_id: 2,
            date: '2014-01-01',
            purpose: 'foo',
            classification: 'fooClassi',
            amount: 100,
            partner: 'partnerFoo',
            partnerAccountNumber: 'partnerFooAccountNumber',
            partnerBank: 'partnerFooBank'
        });

        stream.end();
    });
});