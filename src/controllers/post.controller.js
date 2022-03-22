const Post = require('../schema/post.schema');
const ObjectID = require('mongoose').Types.ObjectId;
module.exports.createPost = async (req, res) => {
    // TODO: Task #2
    if (!req.body.userId || !req.body.title || !req.body.description) {
        return res.status(422).json({
            error: "Missing params"
        })
    }
    if (!ObjectID.isValid(req.body.userId) || Number.isInteger(req.body.userId)) {
        return res.status(422).json({
            error: "Invalid userId"
        });
    }
    if (req.body.title.replace(/\s/g, '').length < 10) {
        return res.status(422).json({
            error: "title must have minimum of 10 characters"
        });
    }
    if (req.body.description.replace(/\s/g, '').length < 50) {
        return res.status(422).json({
            error: "description must have minimum of 50 characters"
        });
    }
    try {
        const post = await Post.create({
            userId: ObjectID(req.body.userId),
            title: req.body.title,
            description: req.body.description
        })
        res.status(201).json({
            ...post._doc
        });
    } catch (err) {
        res.json({
            error: 'Something went wrong' 
        });
    }
}