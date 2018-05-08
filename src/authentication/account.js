const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

let vendorAccountSchema = new mongoose.Schema({
    username: String,
    password: String
});
vendorAccountSchema.plugin(passportLocalMongoose);

let VendorAccount = mongoose.model('VendorAccount', vendorAccountSchema);

module.exports.VendorAccount = VendorAccount;
