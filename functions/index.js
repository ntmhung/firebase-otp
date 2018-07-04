const admin = require('firebase-admin');
const functions = require('firebase-functions');
const createUser = require('./create_user');
const serviceAccount = require('./service_account.json');


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://sample-one-time-password-969d8.firebaseio.com"
});

exports.createUser = functions.https.onRequest(createUser);