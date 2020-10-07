const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define Post schema
const Post = new Schema({
    title: {
        type: String,
        required: true
    },
    create_date: {
        type: Date,
        required: true
    },
    modified_date: {
        type: Date,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    category: String,
    comments: [{
        username: String,
        comment: String
    }]
});

Post.methods.narrativeComments = function() {
    return this.comments.map((com) => `${com.username} says that ${com.comment}`)
}


module.exports = mongoose.model('Post', Post);