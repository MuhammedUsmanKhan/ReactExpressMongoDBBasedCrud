
import { useState , useRef ,useEffect} from "react";
import axios from "axios";

const Postcard = ({ postDetails }) => {

  console.log(postDetails)


  return (
    <div className="w-full rounded overflow-hidden shadow-lg m-4">
      <div className="px-6 py-4">
        <h2 className="font-bold text-xl mb-2">{postDetails?.PostTitle}</h2>
        <p className="text-gray-700 text-base">{postDetails?.Desc}</p>
      </div>
      <div className="flex justify-end space-x-4 p-5 pt-0">
        <button className="p-2 rounded-xl font-semibold hover:bg-white hover:text-green-600 text-white bg-green-600">Update</button>
        <button className="p-2 rounded-xl font-semibold hover:bg-white hover:text-red-600  text-white bg-red-600">Delete</button>
      </div>
    </div>
  );
};

export default Postcard;
