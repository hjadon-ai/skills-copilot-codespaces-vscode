// Create web server
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fs = require('fs');
var path = require('path');
var commentsPath = path.join(__dirname, 'comments.json');

app.use(express.static('public'));
app.use(bodyParser.json());

app.get('/comments', function(req, res) {
  fs.readFile(commentsPath, function(err, data) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    res.json(JSON.parse(data));
  });
});

app.post('/comments', function(req, res) {
  fs.readFile(commentsPath, function(err, data) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    var comments = JSON.parse(data);
    comments.push(req.body);
    fs.writeFile(commentsPath, JSON.stringify(comments, null, 4), function(err) {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      res.json(comments);
    });
  });
});

app.listen(3000, function() {
  console.log('Server started on port 3000');
});

// Path: public/index.html
<!DOCTYPE html>
<html>
  <head>
    <title>Comments</title>
  </head>
  <body>
    <div id="comments"></div>
    <form>
      <input type="text" id="author" placeholder="Author" /><br />
      <textarea id="text" placeholder="Comment"></textarea><br />
      <input type="submit" value="Post" />
    </form>
    <script src="https://unpkg.com/react@16/umd/react.production.min.js"></script>
    <script src="https://unpkg.com/react-dom@16/umd/react-dom.production.min.js"></script>
    <script src="https://unpkg.com/babel-standalone@6/babel.min.js"></script>
    <script type="text/babel">
      class Comment extends React.Component {
        render() {
          return (
            <div>
              <h3>{this.props.author}</h3>
              <p>{this.props.text}</p>
            </div>
          );
        }
      }

      class CommentList extends React.Component {
        render() {
          return (
            <div>
              {this.props.comments.map((comment, idx) => (
                <Comment