import React, { useState, useEffect } from 'react';
import "./Container.css";

function SongComponent({ songs }) {
    const [selectedSong, setSelectedSong] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [isMusicPlayerVisible, setMusicPlayerVisible] = useState(false);

    useEffect(() => {
        const songElement = document.getElementById('song');
        if (songElement) {
            // Update the time and progress when the audio element's time changes
            songElement.addEventListener('timeupdate', handleTimeUpdate);
            return () => {
                // Remove the event listener when the component unmounts
                songElement.removeEventListener('timeupdate', handleTimeUpdate);
                songElement.removeEventListener('ended', handleSongEnd);
            };
        }
    }, [selectedSong]);

    const handleSongClick = (song) => {
        setSelectedSong(song);
        setIsPlaying(true);
        setMusicPlayerVisible(true); // Show the music player
        console.log("Song audio path:", song.song_audio);
    };

    const handleSongEnd = () => {
        // Reset state when the song ends
        setIsPlaying(false);
        setSelectedSong(null);
        setProgress(0);
    };  


    const handleTimeUpdate = () => {
        const songElement = document.getElementById('song');
        if (songElement) {
            const { currentTime, duration } = songElement;
            const progressPercentage = (currentTime / duration) * 100;
            setProgress(progressPercentage);
        }
    };

    const handleSeekChange = (event) => {
        const songElement = document.getElementById('song');
        if (songElement) {
            const seekValue = event.target.value;
            setProgress(seekValue);
            const seekTime = (seekValue / 100) * songElement.duration;
            songElement.currentTime = seekTime;
        }
    };

    const handleControls = () => {
        const songElement = document.getElementById('song');
        if (songElement) {
            if (isPlaying) {
                songElement.pause();
            } else {
                songElement.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleBackward = () => {
        if (selectedSong && songs.length > 1) {
            const currentIndex = songs.findIndex(song => song.id === selectedSong.id);
            const newIndex = (currentIndex - 1 + songs.length) % songs.length;
            setSelectedSong(songs[newIndex]);
            setIsPlaying(true);
        }
    };

    const handleForward = () => {
        if (selectedSong && songs.length > 1) {
            const currentIndex = songs.findIndex(song => song.id === selectedSong.id);
            const newIndex = (currentIndex + 1) % songs.length;
            setSelectedSong(songs[newIndex]);
            setIsPlaying(true);
        }
    };

    const handleBackButtonClick = () => {

        const musicPlayer = document.querySelector('.music-player');
        const miniMusicPlayerContainer = document.querySelector('.miniPosition');

        if (musicPlayer) {
            musicPlayer.classList.add('playerNone');
        }
        if (miniMusicPlayerContainer) {
            miniMusicPlayerContainer.classList.remove('miniPosition');
            miniMusicPlayerContainer.classList.add('divMini');
        }

    };

    const handelMiniVisibility = () =>{
        const musicPlayer = document.querySelector('.music-player');
        const miniMusicPlayerContainer = document.querySelector('.divMini');

        miniMusicPlayerContainer.classList.remove('divMini');
        miniMusicPlayerContainer.classList.add('miniPosition');
        musicPlayer.classList.remove('playerNone');
    }
    const handleClosePlayer = () => {
        const songElement = document.getElementById('song');

        if (songElement) {
            songElement.pause(); // Pause the audio
            songElement.currentTime = 0; // Reset the playback position to the beginning
        }

        setSelectedSong(null);
        setIsPlaying(false);
        setMiniPlayerVisible(false); // Show the mini player
    };

    return (
        <div>
            <div className="heading">
                <h1>Click on Any Image to Play Song</h1>
            </div>
            <div className="container">
                {songs.map((song, index) => (
                    <div className="songs" key={index} onClick={() => handleSongClick(song)}>
                        <img
                            className="img-radius1"
                            src={song.song_image}
                            alt={song.songname}
                        />
                    </div>
                ))}
            </div>

            {/* Music Player  */}
            {isMusicPlayerVisible && selectedSong && (
                <div className="music-player">
                    <div className="player-nav">
                        <div className="circle" id="back" onClick={handleBackButtonClick}>
                            <i className="fa-solid fa-angle-left"></i>
                        </div>
                        <div className="circle" id="close" onClick={handleClosePlayer}>
                            <i className="fa-solid fa-xmark"></i>
                        </div>
                    </div>
                    <div className="song-png">
                        {selectedSong && <img className="img-radius1" src={selectedSong.song_image} alt={`Selected Song`} />}
                    </div>
                    <h1 id="song-name">
                        {selectedSong && selectedSong.songname}
                    </h1>
                    <p id="artist-name">
                        {selectedSong && selectedSong.artistname}
                    </p>

                    {/* Working well */}
                    <audio
                        id="song"
                        controls
                        autoPlay={isPlaying}
                        onEnded={handleClosePlayer}
                        src={selectedSong.song_audio}
                    ></audio>

                    {/* <input type="range" defaultValue="0" id="progress" /> */}

                    <input
                        type="range"
                        defaultValue="0"
                        id="progress"
                        onChange={handleSeekChange}
                        value={progress}
                    />

                    <div className="controls">
                        <div className="backward" onClick={handleBackward}>
                            <i className="fa-solid fa-backward"></i>
                        </div>
                        <div className="CtrlPause" onClick={handleControls}>
                            {isPlaying ? <i className="fa-solid fa-pause"></i> : <i className="fa-solid fa-play"></i>}
                        </div>
                        <div className="forward" onClick={handleForward}>
                            <i className="fa-solid fa-forward"></i>
                        </div>
                    </div>

                </div>
            )}
            {/* Mini Music Player  */}
            <div className="miniPosition" onClick={handelMiniVisibility}>
                <div className="mini-musicplayer ">
                    <div className="song-png-mini">
                        {selectedSong && <img src={selectedSong.song_image} alt={`Selected Song`} />}
                    </div>
                    <div className="songdetails">
                        <p id="song-name-mini">{selectedSong && selectedSong.songname} </p>
                        <p id="artist-name-mini"> {selectedSong && selectedSong.artistname} </p>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default SongComponent;

// import React, { useState } from 'react';
// import MainMusicPlayer from '../musicPlayer/player';
// import MiniMusicPlayer from '../miniPlayer/miniMusicPlayer';
// import "./Container.css";

// function SongComponent({ songs }) {
//     const [selectedSong, setSelectedSong] = useState(null);
//     const [isMusicPlayerVisible, setMusicPlayerVisible] = useState(false);

//     const handleSongClick = (song) => {
//         setSelectedSong(song);
//         setMusicPlayerVisible(true);
//         console.log("Song audio path:", song.song_audio);
//     };

//     const handleClosePlayer = () => {
//         setSelectedSong(null);
//         setMusicPlayerVisible(false);
//     };

//     const handleExpandPlayer = () => {
//         setMusicPlayerVisible(true);
//     };

//     return (
//         <>
//             <div>
//                 <div className="heading">
//                     <h1>Click on Any Image to Play Song</h1>
//                 </div>
//                 <div className="container">
//                     {songs.map((song, index) => (
//                         <div className="songs" key={index} onClick={() => handleSongClick(song)}>
//                             <img
//                                 className="img-radius1"
//                                 src={song.song_image}
//                                 alt={song.songname}
//                             />
//                         </div>
//                     ))}
//                 </div>

//                 {isMusicPlayerVisible && selectedSong && (
//                     <MainMusicPlayer
//                         selectedSong={selectedSong}
//                         onClosePlayer={handleClosePlayer}
//                     />
//                 )}

//                 <MiniMusicPlayer
//                     selectedSong={selectedSong}
//                     onExpandPlayer={handleExpandPlayer}
//                 />
//             </div>

//         </>
//     );
// }

// export default SongComponent;
