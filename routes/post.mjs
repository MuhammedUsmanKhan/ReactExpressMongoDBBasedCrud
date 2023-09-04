import express from 'express'
import { ObjectId } from 'mongodb';
import { client } from '../mongodb.mjs'
const db = client.db('PostCrud')
const col = db.collection("Posts");
let router = express.Router()
// let posts = [
//     {
//         title: "ExpressCrudApp By Usman",
//         text: "in this app we can post put delete get etc",
//     }
// ]

// POST //create   /api/v1/post
router.post('/post', async (req, res, next) => {
    console.log('This is create post request', new Date());

    if (
        (req.body.PostTitle.trim().length == 0) || (req.body.Desc.trim().length == 0)
    ) {
        res.status(403);
        res.send(`required parameters missing, 
        example request body:
        {
            PostTitle: "abc post title",
            PostDesc: "some post text"
        } `);
        return;
    }


    // Insert a single document, wait for promise so we can read it back
    const insertedDocResponse = await col.insertOne({
        "PostTitle": req.body.PostTitle,
        "Desc": req.body.Desc, // May 23, 1912                                                                                                                                 
    });

    console.log(insertedDocResponse);


    res.send('Post created');
})
// GET     /api/v1/posts/:userId
router.get('/posts', async (req, res, next) => {
    console.log('this is posts v1', new Date());

    const cursor = col.find({});
    let PostArr = await cursor.toArray()
    res.send(PostArr)

})
// GET     /api/v1/post/:userId/:postId
router.get('/post/:postId', async (req, res, next) => {
    console.log('this is specific post request v1', new Date());
    //res.send('this is created post v1');
    const postId = new ObjectId(req.params.postId);
    const cursor = col.find({
        _id: postId
    });
    let PostArr = await cursor.toArray()
    if (PostArr) {
        res.send(PostArr)
    } else {
        res.status(404)
        res.send("Post Unavailable")
    }
})
// PUT     /api/v1/post/:userId/:postId
router.put('/post/update/:postId', async (req, res, next) => {
    console.log('this is post v1', new Date());

    const postId = new ObjectId(req.params.postId);
    if (postId && req.body.PostTitle.trim().length != 0 && req.body.Desc.trim().length != 0) {
        let updtPostObj = await col.updateOne(
            { _id: postId },
            {
                $set: { 'PostTitle': req.body.PostTitle, 'Desc': req.body.Desc },
                $currentDate: { lastModified: true }
            }
        );
        res.send(`Post Updated Succesfully`)
        return;
    }

    res.send(`Please donot leave the given fields Empty`)
    res.status(422)

})
// DELETE  /api/v1/post/:userId/:postId
router.delete('/post/delete/:postId', async (req, res, next) => {
    console.log('this is delete post v1', new Date());

    const postId = new ObjectId(req.params.postId);
    if (postId) {
        let delResp = await col.deleteOne({ _id: postId });
        res.send(`Successfully deleted the Post`)
        return;
    }

    res.send('Please enter an valid PostID');
    res.status(404)
})
export default router