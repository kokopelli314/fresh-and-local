const should = require('should');
const mongoose = require('mongoose');
const account = require('../src/authentication/account');
let db;

describe('Vendor Account', function () {
    before(function (done) {
        db = mongoose.connect('mongodb://localhost/test');
        done();
    });

    after(function (done) {
        mongoose.connection.close();
        done();
    });

    beforeEach(function (done) {
        let user = new account.VendorAccount({
            username: '12345',
            password: 'testy'
        });
        user.save(function (err) {
            if (err) console.log(`error ${err.message}`);
            else console.log('no error');
            done();
        });
    });

    it('find a user by username', async function () {
        let user = await account.VendorAccount.findOne({ username: '12345' }).exec();
        user.username.should.eql('12345');
        console.log(`    username: ${user.username}`);
    });

    afterEach(function (done) {
        account.VendorAccount.remove({}, function () {
            done();
        });
    });
});
