/**
 * Created by minhhung on 7/4/18.
 */
const twilio = require('twilio');
const twilio_credential = require('./twilio_credential.json');

const accountSid = twilio_credential.accountSid;
const authToken = twilio_credential.authToken;

module.exports = new twilio.Twilio(accountSid, authToken);