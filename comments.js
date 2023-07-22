//Create web server
var express = require('express');
var router = express.Router();
var Comment = require('../models/comment');
var Post = require('../models/post');

// Get all comments
router.get('/', function(req, res, next) {
    Comment.find(function(err, comments) {
        if (err) { return next(err); }
        res.json({'comments': comments});
    });
});

// Get a specific comment
router.get('/:id', function(req, res, next) {
    Comment.findById(req.params.id, function(err, comment) {
        if (err) { return next(err); }
        res.json({'comment': comment});
    });
});

// Create a comment
router.post('/', function(req, res, next) {
    var comment = new Comment(req.body);
    comment.save(function(err, comment) {
        if (err) { return next(err); }
        res.json({'comment': comment});
    });
});

// Update a comment
router.put('/:id', function(req, res, next) {
    Comment.findById(req.params.id, function(err, comment) {
        if (err) { return next(err); }
        comment.body = req.body.body;
        comment.save(function(err, comment) {
            if (err) { return next(err); }
            res.json({'comment': comment});
        });
    });
});

// Delete a comment
router.delete('/:id', function(req, res, next) {
    Comment.findByIdAndRemove(req.params.id, function(err, comment) {
        if (err) { return next(err); }
        res.json({'comment': comment});
    });
});

// Get all comments for a post
router.get('/post/:post_id', function(req, res, next) {
    Comment.find({post_id: req.params.post_id}, function(err, comments) {
        if (err) { return next(err); }
        res.json({'comments': comments});
    });
});

// Create a comment for a post
router.post('/post/:post_id', function(req, res, next) {
    var comment = new Comment(req.body);
    comment.post_id = req.params.post_id;
    comment.save(function(err, comment) {
        if (err) { return next(err); }
        Post.findById(req.params.post_id, function(err, post) {
            if (err) { return next(err); }
            post.comments.push(comment._id);
            post.save(function(err, post) {
                if (err) {