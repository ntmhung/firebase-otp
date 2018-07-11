/**
 * Created by minhhung on 7/9/18.
 */
const admin = require('firebase-admin');
const twilio = require('./twilio');

module.exports = function (request, response) {
    "use strict";
    if (!request.body.phone) {
        return response.status(422).send({error: 'You must provide a phone number'});
    }

    const phone = String(request.body.phone).replace(/[^\d]/g, '');

    admin.auth().getUser(phone)
        .then(userRecord => {
            const code = Math.floor(Math.random() * 8999 + 1000);

            twilio.messages.create({
                body: 'Your code is' + code,
                to: phone,
                from: '+184436627146'
            }, (err) => {
                if (err) {
                    return response.status(422).send({error: err})
                }
                admin.database().ref('users/' + phone)
                    .update({code: code, codeValid: true}, () => {
                        return response.send({success: true});
                    })

            });
        })
        .catch((error) => {
            return response.status(422).send({error: error});
        });
};