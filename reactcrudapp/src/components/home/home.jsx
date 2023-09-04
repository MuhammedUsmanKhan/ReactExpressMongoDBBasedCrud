import { useState, useRef, useEffect } from "react";
import axios from 'axios'
import Createcard from '../createcard/card'
import Postcard from '../postcard/postcard'

const Home = () => {

    const [posts, setPosts] = useState([]);

    useEffect(() => {


        // const controller = new AbortController();


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

        readPost()
        // return () => {
        //   // cleanup function
        //   controller.abort();
        // };
    }, []);

    const addNewPost = async (newPost) => {
        try {
            const response = await axios.post(`/api/v1/post`, newPost);
            // Update the state to include the new post
            setPosts([...posts, response.data]);
            console.log(posts.data)
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
                    {posts.map((eachpost, index) => {
                        return <Postcard key={index} postDetails={eachpost} />;
                    })}
                </div>
            </div>
        </div>

    );
};

export default Home;
