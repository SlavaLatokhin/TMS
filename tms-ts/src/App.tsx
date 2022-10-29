import React from "react";
import './App.css';
import {Route, Routes, BrowserRouter} from "react-router-dom";
import Suites from "./components/testcases/suites";
import Projects from "./components/projects/projects";
import HeaderComponent from "./components/header";
import Login from "./components/login"
import ProjectSelection from "./components/projects/projectSelection";


function App() {
    return (
        <div>
            <HeaderComponent/>
            <BrowserRouter>
                <Routes>
                    <Route path={"/"} element={<ProjectSelection/>}/>
                    <Route path={"/project"} element={<Projects/>}/>
                    <Route path={"/login"} element={<Login/>}/>
                    <Route path={"/testcases"} element={<Suites/>}/>
                </Routes>
            </BrowserRouter>

        </div>
    );
}

export default App;
