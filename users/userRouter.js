const express = require('express');

const Users = require('./userDb');
const Posts = require('../posts/postDb');

const router = express.Router();

router.post('/', validateUser, (req, res) => {
  Users.insert(req.body)
    .then(user => {
      res.status(201).json(user);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({message: "error adding the user"})
    });
});

router.post('/:id/posts', validateUserId, (req, res) => {
  const postInfo = {...req.body, user_id: req.params.id};
  
  Posts.insert(postInfo)
    .then(post => {
      res.status(201).json(post);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({message: "error adding the post"})
    });
    
});

router.get('/', (req, res) => {
  Users.get(req.query)
    .then(user => {
      res.status(200).json(user);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({message: "user information not found"})
    });
});

router.get('/:id', validateUserId, (req, res) => {
  Users.getById(req.params.id)
    .then(user => {
      res.status(201).json(user);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({message: "user not found"})
    });
});

router.get('/:id/posts', validateUserId, (req, res) => {
  Posts.getById(req.params.id)
    .then(post => {
      res.status(201).json(post);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({message: "posts not found"})
    });
});

router.delete('/:id', validateUserId, (req, res) => {
  Users.remove(req.params.id)
    .then(count => {
      if (count > 0) {
        res.status(200).json({message: "user has been deleted"})
      } else {
        res.status(404).json({message: "user not found"})
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ message: 'Error removing the user'});
    });
});

router.put('/:id', validateUserId, validateUser, (req, res) => {
  Users.update(req.params.id, req.body)
    .then(user => {
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(400).json({message: "user not found"});
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({message: "error updating user"});
    });
});

//custom middleware

function validateUserId(req, res, next) {
  const {id} = req.params;

  Users.getById(id)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(error => {
      res.status(404).json({message: "invalid user id"})
    });
};

function validateUser(req, res, next) {
  const body = req.body;
  // const name = req.body.name;

  !body || body === {}?
    res.status(400).json({message: "missing user data"})
    :
  !body.name ? 
    res.status(400).json({message: "missing required name field"})
    :
  next();
};

function validatePost(req, res, next) {
  const body = req.body;

  !body || body === {}?
    res.status(400).json({message: "missing post data"})
    :
  !body.text ?
    res.status(400).json({message: "missing required text field"})
    :
  next();
};

module.exports = router;
