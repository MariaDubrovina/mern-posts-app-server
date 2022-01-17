const Post = require('../../models/Post');
const checkAuth = require('../../util/check_auth');
const { UserInputError, AuthenticationError } = require('apollo-server');


module.exports = {
    Mutation: {
        async createComment(_, { postId, body }, context) {
            const {username} = checkAuth(context);

            if (body.trim() === '') {
                throw new UserInputError('Empty comment', {
                    errors: {
                        body: 'Comment body must not be empty'
                    }
                })
            }

            const post = await Post.findById(postId);

            if (post) {
                post.comments.unshift({
                    body,
                    username,
                    createdAt: new Date().toISOString()
                })
                await post.save();

                return post;
            } else throw new UserInputError('Post is not found')
        },
        async deleteComment(_, { postId, commentId }, context) {
            const {username} = checkAuth(context);

            
                const post = await Post.findById(postId);

                if (post) {
                    const commentIndex = post.comments.findIndex(c => c.id === commentId);

                    if (username === post.comments[commentIndex].username) {
                        await post.comments.splice(commentIndex, 1);
                        await post.save();
                        return post;
                    } else {
                        throw new AuthenticationError('You are not an author of that comment');
                    }
                } else throw new UserInputError('Post is not found')

        }
    }
}