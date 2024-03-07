// import React from "react";
// import { useState } from 'react'
import React from 'react';
import "./navbar.css";

function Navbar() {

    return (
        <>
            <nav className="navbar">
                <div className="main">
                    <ul className="logo">
                        <a href="#">That Usinque Music Player</a>
                    </ul>
                    <ul className="menu">
                        <a href="#">Home</a>
                        <a href="#">All songs</a>
                        <a href="#">Addsong</a>
                        {/* <a href="#">MusicPlayer</a> */}
                    </ul>
                </div>    
                    <div className="serch">
                        <input type="text" placeholder="Serch" />
                        <i className="fa-solid fa-magnifying-glass"></i>
                    </div>
            </nav>
        </>

    )
}

export default Navbar;