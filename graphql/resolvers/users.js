const User = require('../../models/User');
const { SECRET_KEY } = require('../../config');
const { validateRegisterInput, validateLoginInput } = require('../../util/validation')

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserInputError } = require('apollo-server');

const generateToken = (user) => {
    return jwt.sign({
        id: user.id,
        email: user.email,
        username: user.username
    }, SECRET_KEY, {expiresIn: '1h'});
}

module.exports = {
    Mutation: {
        async login(_, { username, password }) {
            const {valid, errors} = validateLoginInput(username, password);
            if (!valid) {
                throw new UserInputError('Errors', {errors});
            }

            const user = await User.findOne({username});
            if (!user) {
                errors.general = 'User not found';
                throw new UserInputError('User not found', {errors});
            }

            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                errors.general = 'Wrong Password';
                throw new UserInputError('Wrong Password', {errors});
            }

            const token = generateToken(user);
           
            return {
                ...user._doc,
                id: user.id,
                token
            };
        },

        async register(_, { 
            registerInput: { username, email, password, confirmPassword} 
        }) {
            //TODO: Validate user data
            const {valid, errors} = validateRegisterInput(username, email, password, confirmPassword);
            if (!valid) {
                throw new UserInputError('Errors', {errors});
            }

            //TODO: Make sure user doesn't already exist
            const user = await User.findOne({username});
            if (user) {
                throw new UserInputError('This username is taken', {
                    errors: {
                        username: 'This username is taken'
                    }
                })
            }

            //Hash password and create an auth token
            password = await bcrypt.hash(password, 12);

            const newUser = new User({
                username,
                email,
                password,
                createdAt: new Date().toISOString()
            });

            //Save user to DB
            const res = await newUser.save();

            const token = generateToken(res);

            return {
                ...res._doc,
                id: res.id,
                token
            };
        }
    }
};
