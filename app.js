const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

mongoose.connect('mongodb://localhost:27017/wikiDB', {useNewUrlParser: true})
const articleSchema = {
  title: String,
  content: String
};
const Article = mongoose.model('Article', articleSchema);

app.route('/articles')
    .get(function(req, res) {
      Article.find(function(err, result) {
        if (err) {
          res.send(err);
        } else {
          res.send(result)
        }
      })
    })
    .post(function(req, res) {
      const title = req.body.title;
      const content = req.body.content;
      const article = new Article({title: title, content: content});
      article.save(function(err) {
        if (err) {
          res.send(err);
        } else {
          res.send('successfully sent');
        }
      });
    })
    .delete(function(req, res) {
      Article.deleteMany(function(err) {
        if (err) {
          res.send(err);
        } else {
          res.send('Deleted all articles');
        }
      });
    });


app.route('/articles/:articleTitle')
    .get(function(req, res) {
      Article.findOne(
          {title: req.params.articleTitle}, function(err, foundArticle) {
            if (foundArticle) {
              res.send(foundArticle);
            } else {
              res.send('No article matching the requested title found');
            }
          })
    })
    .put(function(req, res) {
      Article.update(
          {title: req.params.articleTitle},
          {title: req.body.title, content: req.body.content}, {overwrite: true},
          function(err) {
            if (err) {
              res.send(err);
            } else {
              res.send('sucessfully updated');
            }
          })
    })
    .patch(function(req, res) {
      Article.update(
          {title: req.params.articleTitle}, {$set: req.body}, function(err) {
            if (err) {
              res.send(err);
            } else {
              res.send('sucessfully updated articles');
            }
          })
    })
    .delete(function(req, res) {
      Article.deleteOne({title: req.params.articleTitle}, function(err) {
        if (err) {
          res.send(err);
        } else {
          res.send('sucessfully deleted ' + req.params.articleTitle);
        }
      })
    });
app.listen(3000, function() {
  console.log('Server started on port 3000');
});