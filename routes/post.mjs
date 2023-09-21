import express from 'express'
import { ObjectId } from 'mongodb';
import { client } from '../mongodb.mjs'
import OpenAI from "openai";
import 'dotenv/config'
const db = client.db('PostCrud')
const col = db.collection("Posts");
let router = express.Router()
const openaiClient = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});
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


router.get('/search', async (req, res, next) => {

    try {
        const response = await openaiClient.embeddings.create({
            model: "text-embedding-ada-002",
            input: req.query.q,
        });
        const vector = response?.data[0]?.embedding
        console.log("vector: ", vector);
        // [ 0.0023063174, -0.009358601, 0.01578391, ... , 0.01678391, ]

        // Query for similar documents.
        const documents = await col.aggregate([
            {
                "$search": {
                    "index": "crudVectorindex",
                    "knnBeta": {
                        "vector": vector,
                        "path": "embedding",
                        "k": 10 // number of documents
                    },
                    "scoreDetails": true

                }
            },
            {
                "$project": {
                    "embedding": 0,
                    "score": { "$meta": "searchScore" },
                    "scoreDetails": { "$meta": "searchScoreDetails" }
                }
            }
        ]).toArray();

        documents.map(eachMatch => {
            console.log(`score ${eachMatch?.score?.toFixed(3)} => ${JSON.stringify(eachMatch)}\n\n`);
        })
        console.log(`${documents.length} records found `);

        res.send(documents);

    } catch (e) {
        console.log("error getting data mongodb: ", e);
        res.status(500).send('server error, please try later');
    }

})
export default router