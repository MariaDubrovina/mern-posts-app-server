const { model, Schema } = require('mongoose');

const PostSchema = new Schema({
    body: String,
    username: String,
    createdAt: String,
    comments: [
        {
            body: String,
            username: String,
            createdAt: String,
        }
    ],
    likes: [
        {
            username: String,
            createdAt: String,
        }
    ],
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users' //name of collection at MongoDB, this let us automattically populate user using Mongoose
    }
});

module.exports = model('Post', PostSchema);