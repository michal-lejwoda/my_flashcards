// import React from 'react';

import {useLocation} from "react-router-dom";
import {useEffect} from "react";

const Exercises = () => {
    const location = useLocation();
    const fullPath = location.pathname; // np. "/exercises/test/abc"
    console.log("fullPath", fullPath)
    const subPath = fullPath.replace(/^\/exercises\/?/, '');
    console.log(subPath)
    useEffect(()=>{
        console.log("saddsasdsads", subPath)
    },[])
    return (
        <div>
            <h1></h1>
            {/*<h1>Ścieżka: {subPath}</h1>*/}
        </div>
    );
};



export default Exercises;
