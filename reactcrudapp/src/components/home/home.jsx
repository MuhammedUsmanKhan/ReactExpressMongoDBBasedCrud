import { useState, useRef, useEffect } from "react";
import axios from 'axios'
import Createcard from '../createcard/card'
import Postcard from '../postcard/postcard'

const Home = () => {

    const [posts, setPosts] = useState([]);


    const readPost = async (e) => {
        // console.log("location: ", location);
        try {
            // console.log(postHeadingRef.current.value)
            // console.log(postDetailsRef.current.value)

            const getPost = await axios.get(`/api/v1/posts`)

            setPosts(getPost.data)
            console.log(getPost.data);


        } catch (error) {
            // handle error
            console.log(error);

        }
    }


    const deletePost = async (e) => {
        console.log(e.target.dataset.postid)
        const postID = e.target.dataset.postid
        try {

            const delPost = await axios.delete(`/api/v1/post/delete/${postID}`)

            console.log(delPost);
            readPost()

            } catch (error) {
                // handle error
                console.log(error);

            }
        }

    useEffect(() => {


            // const controller = new AbortController();


            readPost()
            // return () => {
            //   // cleanup function
            //   controller.abort();
            // };
        }, []);

        const addNewPost = async (newPost) => {
            try {
                const response = await axios.post(`/api/v1/post`, newPost);
                console.log(response)
                // Update the state to include the new post
                readPost()

            } catch (error) {
                console.error("Error adding new post: ", error);
            }
        };


        return (
            <div className=''>
                <div className='flex justify-center text-4xl  p-4'>
                    <h1 className=''>React ExpressServer Based CrudApp</h1>
                </div>
                <div className='container  mx-auto flex flex-col space-y-4'>
                    <div className='flex justify-center '>
                        <Createcard createPost={addNewPost} />
                    </div>
                    <div className='flex flex-col items-center '>
                        {posts.toReversed().map((eachpost, index) => {
                            return <Postcard key={index} postDetails={eachpost} delpost={deletePost} />;
                        })}
                    </div>
                </div>
            </div>

        );
    };

    export default Home;
