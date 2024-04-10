import React, {Suspense} from 'react'
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
import "../i18n.tsx"
import Account from "./components/Account.tsx";
import Preview from "./components/Preview.tsx";
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import ChooseAndLearn from "./components/ChooseAndLearn.tsx";
import {AuthProvider} from "./context/AuthContext.tsx";


ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <Suspense fallback="loading">
            <AuthProvider>
                <BrowserRouter>
                    <Navbar/>
                    <div className="main">
                        <Routes>
                            <Route path="/" element={<Decks/>}/>
                            <Route path="/search" element={<Search/>}/>
                            <Route path="/create" element={<CreateComponent/>}/>
                            <Route path="/learn/:slug" element={<LearnFlashcards/>}/>
                            <Route path="/add_file" element={<AddFile/>}/>
                            <Route path="/login" element={<Login/>}/>
                            <Route path="/register" element={<Register/>}/>
                            <Route path="/account" element={<Account/>}></Route>
                            <Route path="/preview" element={<Preview/>}></Route>
                            <Route path="/choose_and_learn" element={<ChooseAndLearn/>}></Route>
                        </Routes>
                    </div>
                    <Footer/>
                </BrowserRouter>
            </AuthProvider>
        </Suspense>
    </React.StrictMode>,
)
