const bcrypt = require('bcrypt');
const User = require('../models/User');
const auth = require('../auth');

const { errorHandler } = auth;

//[SECTION] User registration
module.exports.registerUser = (req, res) => {
	if (!req.body.email.includes("@")){
	    return res.status(400).send({ error: 'Email Invalid' });
	}
	else if (req.body.password.length < 8) {
	    return res.status(400).send({ error: 'Password must be at least 8 characters long' });
	} else {
	    let newUser = new User({
	        firstName : req.body.firstName,
	        lastName : req.body.lastName,
	        email : req.body.email,
	        password : bcrypt.hashSync(req.body.password, 10)
	    })

	    return newUser.save()
	    .then((result) => res.status(201).send({message: 'Registered successfully'}))
	    .catch(error => errorHandler(error, req, res));
	}
};

module.exports.loginUser = (req, res) => {
    let { email, password } = req.body;

    if (!email.includes("@") || !email.includes(".")) {
        return res.status(400).send({error:'Invalid Email'});
    }

    User.findOne({ email })
    .then(user => {
        if (!user) {
            return res.status(404).send({error:'No Email Found'});
        }

        const isPasswordCorrect = bcrypt.compareSync(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).send({error: 'Email and password do not match'});
        }

        return res.status(200).send({ access: auth.createAccessToken(user) });
    })
    .catch(error => errorHandler(error, req, res));
};


module.exports.getUserDetails = (req, res) => {
	const userId = req.user.id;

	User.findById(userId)
	.then(user => {
		if(!user) {
			return res.status(404).send({ error: 'User not found' });
		} else {
			return res.status(200).send({ user: user});
		}
	})
	.catch(error => errorHandler(error, req, res))
};


