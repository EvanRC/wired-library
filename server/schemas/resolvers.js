const { User, Book } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        me: async (_, arg, context) => {
            if (context.user) {
                return User.findById(context.user._id).populate('savedBooks');
            }
            throw new AuthenticationError('Login is required for this action!');
        },
    },
    Mutation: {
        login: async (_, { email, password }) => {
            const user = await User.findOne({ email });
            if (!user) {
                throw new AuthenticationError('No user found with this email address');
            }

            const correctPw = await user.isCorrectPassword(password);
            if (!correctPw) {
                throw new AuthenticationError('Incorrect credentials');
            }

            const token = signToken(user);
            return { token, user };
        },
        addUser: async (_, { username, email, password }) => {
            const user = await User.create({ username, email, password });
            const token = signToken(user);
            return { token, user };
        },
        saveBook: async (_, { input }, context) => {
            if (context.user) {
                const updatedUser = await User.findByIdAndUpdate(
                    context.user._id,
                    { $addToSet: { savedBooks: input } },
                    { new: true, runValidators: true }
                ).populate('savedBooks');
                return updatedUser;
            }
            throw new AuthenticationError('Login is required for this action!');
        },
        removeBook: async (_, { bookId }, context) => {
            if (context.user) {
                const updatedUser = await User.findByIdAndUpdate(
                    context.user._id,
                    { $pull: { savedBooks: { bookId } } },
                    { new: true }
                ).populate('savedBooks');
                return updatedUser;
            }
            throw new AuthenticationError('Login is required for this action!')
        },
    },
};

module.exports = { resolvers} ;