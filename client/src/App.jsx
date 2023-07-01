import React,{ useState } from "react";
import './App.css';
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Signup from "./components/signup";
import Login from "./components/Login";
import Join from "./components/Join";
import Chat from "./components/Chat";
import PageNotFound from "./pages/PageNotFound";

export default function App() {
  
  return (
   <>
    <Router>
        <Routes>
          <Route path="/" element={<Login/>} />
          <Route path="/signup" element={<Signup/>} />
          <Route path="/join" element={<Join/>} />
          <Route path="/chat" element={<Chat/>} />
          <Route path="*" element={<PageNotFound/>} />

        </Routes>  
      </Router>
   </>
  );
}
