import { FaTrashCan, FaCircleXmark } from "react-icons/fa6";
import React, { Children, useState } from 'react';

const Search = ({ isSearchdetails, children, setiIsSearchdetails }) => {
    return (<>
        {isSearchdetails && (
            <div className="fixed inset-0 flex items-center justify-center z-10">
                <div className=" relative flex justify-center items-center modal-overlay w-full h-full" >
                    <div className="modal-container absolute min-w-[60%]">
                        <div className="bg-white rounded shadow-lg p-6">
                            <div className="flex justify-between m-4 mb-6 mt-0">
                                <h1 className="text-2xl font-semibold ">Related Posts</h1>
                                <button onClick={() => { setiIsSearchdetails(false) }}><FaCircleXmark className="text-2xl hover:text-black hover:bg-white" /></button>
                            </div>
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        )}
    </>
    )
}

export default Search;