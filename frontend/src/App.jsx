import { useEffect, useState } from 'react'
import './App.css'
import Navbar from './navbarComp/navbar';
import SongComponent from './containerComp/Container';

import axios from 'axios';

function App() {
  
  const [songs, setSongs] = useState([]);

  useEffect (() =>{
    axios.get('/api/songs')
    .then((response) =>{
      setSongs(response.data)
    }
    )
    .catch((error) =>{
      console.log(error);
    })
  })

  return (
    <>
      <Navbar></Navbar>
      <p>Songs: {songs.length}</p>
      <SongComponent songs = {songs}/>
    </>
  )
}

export default App
