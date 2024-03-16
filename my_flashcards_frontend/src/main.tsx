import React from 'react'
import ReactDOM from 'react-dom/client'
import {BrowserRouter, Route, Routes,} from "react-router-dom";
import './index.css'
import LearnFlashcards from "./components/LearnFlashcards.tsx";
import Footer from "./components/Footer.tsx";
import Navbar from "./components/Navbar.tsx";
import Decks from "./components/Decks.tsx";
import Search from "./components/Search.tsx";
import CreateComponent from "./components/CreateComponent.tsx";
import Register from "./components/Register.tsx";
import Login from "./components/Login.tsx";
import AddFile from "./components/AddFile.tsx";


ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <BrowserRouter>
            <Navbar/>
            <Routes>
                <Route path="/" element={<Decks/>}/>
                <Route path="/search" element={<Search/>}/>
                <Route path="/create" element={<CreateComponent/>}/>
                <Route path="/learn/:slug" element={<LearnFlashcards/>}/>
                <Route path="/add_file" element={<AddFile/>}/>
                <Route path="login" element={<Login/>}/>
                <Route path="register" element={<Register/>}/>
            </Routes>
            <Footer/>
        </BrowserRouter>
    </React.StrictMode>,
)
