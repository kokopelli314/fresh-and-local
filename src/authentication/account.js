const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

// Enforce 8-character minimum for passwords
function validatePassword(password, cb) {
    if (password.length >= 8) {
        return cb(null);
    } else {
        return cb(new Error(`Password must be at least 8 characters long.`));
    }
}

// Database schema for producer accounts
const producerAccountSchema = new mongoose.Schema({
    username: String,
    password: String,
    businessName: String,
    address: String,
    postalCode: String,
    city: String,
    state: String,
});
producerAccountSchema.plugin(passportLocalMongoose, {
    passwordValidator: validatePassword
});

const ProducerAccount = mongoose.model('ProducerAccount', producerAccountSchema);
module.exports.ProducerAccount = ProducerAccount;


async function updateProfile(username, params) {
    return new Promise((resolve, reject) => {
        ProducerAccount.findOneAndUpdate(
            { username: username },
            { $set: params },
            { },
            function(err, doc) {
                if (err) {
                    console.log(`Error: ${err}`);
                    reject(err);
                }
                resolve(doc);
            }
        );
    });
}
module.exports.updateProfile = updateProfile;
