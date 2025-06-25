// import React from 'react';

import {useLocation} from "react-router-dom";

const Exercises = () => {
    const location = useLocation();
    const fullPath = location.pathname; // np. "/exercises/test/abc"
    console.log("fullPath", fullPath)
    const subPath = fullPath.replace(/^\/exercises\/?/, ''); // usuń "/exercises/"
    const lastElement = subPath.split("/")
    console.log(subPath)
    console.log("lastElement", lastElement[lastElement.length-1])
    return (
        <div>
            <h1>Ścieżka: {subPath}</h1>
        </div>
    );
};



export default Exercises;
