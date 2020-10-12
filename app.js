const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
const postRouter = require('./routes/posts_routes');

const port = process.env.PORT || 3009;

const app = express();
app.use(cors());
app.use(bodyParser.json());

// If we are not running in production, load our local .env
if(process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const dbConn = process.env.MONGODB_URI || "mongodb://localhost/blog_app"

// Set three properties to avoid deprecation warnings:
// useNewUrlParser: true
// useUnifiedTopology: true
// useFileAndModify: false
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
    } else {
      console.log("Connected to database!")
    }
  }
)

app.get('/', (req, res) => {
  console.log("get on /");
  res.send("got your request");
})

app.use('/posts', postRouter);

console.log("port: ",process.env.PORT)
console.log(process.env)

app.listen(port, () => {
  console.log(`Blog express app listening on port ${port}`);
});