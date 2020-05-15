const express = require('express');

const Posts = require ('./postDb');

const router = express.Router();


router.get('/', (req, res) => {
  Posts.get(req.query)
  .then(user => {
    res.status(201).json(user);
  })
  .catch(error => {
    console.log(error);
    res.status(500).json({message: "posts not found"})
  });
});

router.get('/:id', validatePostId, (req, res) => {
  Posts.getById(req.params.id)
    .then(post => {
      res.status(201).json(post);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({message: "post not found"})
    });
});

router.delete('/:id', validatePostId, (req, res) => {
  Posts.remove(req.params.id)
    .then(count => {
      if (count > 0) {
        res.status(200).json({message: "post has been deleted"})
      } else {
        res.status(404).json({message: "post not found"})
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ message: 'Error removing the post'});
    });
});

router.put('/:id', validatePostId, (req, res) => {
  Posts.update(req.params.id, req.body)
    .then(post => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(400).json({message: "post not found"});
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({message: "error updating post"});
    });
});

// custom middleware

function validatePostId(req, res, next) {
  const {id} = req.params;

  Posts.getById(id)
    .then(post => {
      req.post = post;
      next();
    })
    .catch(error => {
      res.status(404).json({message: "invalid post id"})
    });
}

module.exports = router;
