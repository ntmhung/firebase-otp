/**
 * Created by minhhung on 7/11/18.
 */
const admin = require('firebase-admin');

module.exports = function (request, response) {
    "use strict";
    if (!request.body.phone || request.body.code) {
        return response.status(422).send({error: "Phone and Code must be provided"});
    }

    const phone = String(request.body.phone).replace(/[^\d]/g, '');
    const code = parseInt(request.body.code);

    admin.auth().getUser(phone)
        .then(() => {
            const ref = admin.database().ref('users/' + phone);

            ref.on('value', snapshot => {
                /*
                 * stop listening for data change on user data since on('value', ...) still processing listening for
                 * data change to user model
                 */
                ref.off();

                const user = snapshot.val();

                if (user.code !== code || !user.codeValid) {
                    return response.status(422).send({error: "Code not valid"});
                }

                ref.update({codeValid: false});

                //generate JSON Web Token (JWT)
                admin.auth().createCustomToken(phone)
                    .then(token => {
                        return response.send({token: token})
                    })
                    .catch();
            })
        })
        .catch((error) => {
            return response.status(422).send({error: error});
        })
};