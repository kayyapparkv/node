const User = require('../schema/user.schema');
const Post = require('../schema/post.schema');
const { asyncForEach } = require('../helpers/async.helper');

module.exports.getUsersWithPostCount = async (req, res) => {
    // http://localhost:3000/users?page=8&pageLength=10
    try {
        let skip, limit;
        if (req.query.pageLength) {
            limit = Number(req.query.pageLength);
        } else {
            limit = 10
        }
        if (req.query.page) {
            skip = Number(req.query.page) * Number(limit);
        } else {
            skip = 0;
        }
        const users = await User.find({}).skip(skip).limit(limit).lean();
        const userCount = await User.find({}).count();
        await asyncForEach(users, async (user, i) => {
            const posts = await Post.find({userId: user._id}).count();
            users[i].posts = posts;
        });

        res.send({ users,
            meta: {
                totalCount: users.length,
                currentPage: skip/limit,
                totalPages: userCount/limit,
                hasNextPage : skip < userCount,
                hasPreviousPage: skip/limit > 0,
                limit: limit,
            }
        });
    } catch (error) {
        res.send({error: error.message});
    }
}