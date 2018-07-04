/**
 * Created by minhhung on 7/3/18.
 */
const admin = require('firebase-admin');

// Firebase functions run on top of Node, by default not has access to ES6 system, but CommonJS module system
module.exports = function (request, response) {
    "use strict";
    ///verify a user provided a phone
    if (!request.body.phone) {
        return response.status(422).send({error: 'Phone number is required'});
    }

    // Sanitize phone number
    const digit_reg = /[^\d]/g;
    const phone_len_reg = /[^\d]{10,11}$/;
    const phone = String(request.body.phone).replace(digit_reg, '');
    if(!phone_len_reg.test(phone)){
        return response.status(422).send({error: 'Phone number is not valid'});
    }

    // Create new account and response to user
    // admin.auth() return a Promise
    admin.auth().createUser({uid: phone})
        .then(user => response.send(user))
        .catch(err => response.status(422).send({error: err}));
};