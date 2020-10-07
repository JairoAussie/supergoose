const mongoose = require('mongoose');
const expect = require('expect');
const utilities = require('../utils/posts_utilities');
const Post = require('../models/post');

let postId = null;
// set up connection for test database
const dbConn = "mongodb://localhost/blog_app_test"

// Use done to deal with asynchronous code - done is called when the hooks completes
before(done => connectToDb(done))

// Connect to the test database
function connectToDb(done) {
    // Connect to the database (same as we do in app.js)
    mongoose.connect(
        dbConn,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        },
        err => {
            if (err) {
                console.log("Error connecting to database", err)
                done()
            } else {
                console.log("Connected to database!")
                done()
            }
        }
    )
}

// Disconnect from the test database after all tests run. Call done to indicate complete.
after(done => {
    mongoose.disconnect(() => done())
})


// Set up test data before each test
beforeEach(async function () {
    // Load a test record in setupData
    // Use await so we can access the postId, which is used by some tests
    let post = await setupData()
    postId = post._id
})

function setupData() {
    let date = Date.now()
    let testPost = {}
    testPost.title = "Test post 1"
    testPost.username = "tester"
    testPost.create_date = date
    testPost.modified_date = date
    testPost.content = "This is the first test post"
    testPost.category = ""
    return Post.create(testPost)
}

// Delete test data after each test
afterEach((done) => {
    // Execute the deleteMany query
    tearDownData().exec(() => done());
});

function tearDownData() {
    return Post.deleteMany()
}



describe('1. getAllPosts with one post', () => {
    it('should get a post if one exists', async function () {
        let req = {
            query: {}
        };
        await utilities.getAllPosts(req).exec((err, posts) => {
            expect(Object.keys(posts).length).toBe(1);
        });
    });
    it('username of first post should be tester', async function () {
        let req = {
            query: {}
        };
        await utilities.getAllPosts(req).exec((err, posts) => {
            expect(posts[0].username).toBe('tester');
        });

    });
});

describe('2.getPostById', () => {
    it('username of first post should be tester', async function () {
        // Set up req with postId
        let req = {
            params: {
                id: postId
            }
        }
        await utilities.getPostById(req).exec((err, post) => {
            expect(post.username).toBe('tester');
        });
    });
});

// addPost
describe('3.addPost', () => {
    it('should add a post', async function () {
        // define a req object with expected structure
        const req = {
            body: {
                title: "Another post",
                username: "tester",
                content: "This is another blog post!",
                category: ""
            }
        }
        await utilities.addPost(req).save((err, post) => {
            expect(post.title).toBe(req.body.title);
        });
    });
});

// deletePost
describe('4.deletePost', () => {
    it('should delete the specified post', async function () {
        await utilities.deletePost(postId).exec();
        await Post.findById(postId).exec((err, post) => {
            expect(post).toBe(null);
        });
    });
});

// updatePost
describe('5.updatePost', () => {
    it('should update a post', async function () {
        // set up a req object
        const req = {
            params: {
                id: postId
            },
            body: {
                title: "Updated post",
                username: "tester",
                content: "This is an updated blog post!",
                category: ""
            }
        };
        await utilities.updatePost(req).exec((err, post) => {
            expect(post.title).toBe(req.body.title);
        });
    });
});


describe('addComment', () => {
    it('should add a comment to a post', async function () {
        const req = {
            params: {
                postId: postId
            },
            body: {
				username: 'tester2',
                comment: 'This is a comment on the post'
            }
        };
        await utilities.addComment(req).then((post) => {
            expect(post.comments.length).toBe(1);
            expect(post.comments[0].username).toBe('tester2');
        })
    });
});