import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import {BrowserRouter, Route, Routes,} from "react-router-dom";
import './index.css'
import LearnFlashcards from "./components/LearnFlashcards.tsx";
import Footer from "./components/Footer.tsx";
import Navbar from "./components/Navbar.tsx";


ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <BrowserRouter>
                <Navbar/>
                <Routes>
                    <Route path="/" element={<App/>}/>
                    <Route path="/learn" element={<LearnFlashcards/>}/>
                    {/*<Route path="login" element={<LoginForm/>}/>*/}
                    {/*<Route path="register" element={<RegisterForm/>}/>*/}
                    {/*<Route path="contact" element={<Contact/>}/>*/}
                    {/*<Route path="reservation" element={<Booking/>}/>*/}
                    {/*<Route path="about-me" element={<AboutMe/>}/>*/}
                    {/*<Route path="transformations" element={<Transformations/>}/>*/}
                    {/*<Route path="terms-and-conditions" element={<TermsAndConditions/>}/>*/}
                    {/*<Route path="cookies-policy" element={<CookiesPolicy/>}/>*/}
                    {/*<Route path="private-policy" element={<PrivatePolicy/>}/>*/}
                    {/*<Route path="reset_password/:id/:name" element={<ResetPassword/>}/>*/}
                    {/*<Route path="password_reminder" element={<ResetPasswordBasedonEmail/>}/>*/}
                </Routes>
                <Footer/>
        </BrowserRouter>
    </React.StrictMode>,
)
