// const express = require('express');
import express from 'express';
import  mysql from 'mysql2';
import fileUpload  from 'express-fileupload';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();

//for connection
import cors from 'cors';
app.use(cors());

app.use(express.static('dist')); //for frontend

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'mysql',
  database: 'musicplayer',
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
  } else {
    console.log('Connected to MySQL');
  }
});

app.use(express.urlencoded({ extended: false }));
app.use(fileUpload());
app.use(express.static(path.join(__dirname, 'public')));

//new
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));
app.use(express.static(path.join(__dirname, 'public')));

// Create
app.post('/api/songs', (req, res) => {
  const { songname, artistname, year } = req.body;

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({ error: 'No files were uploaded.' });
  }

  const songImg = req.files.song_image;
  const songAudio = req.files.song_audio;

  const imgOriginalName = songImg.name;
  const audioOriginalName = songAudio.name;

  const imgPath = `uploads/images/${imgOriginalName}`;
  const audioPath = `uploads/audio/${audioOriginalName}`;

  songImg.mv(`public/${imgPath}`, (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    songAudio.mv(`public/${audioPath}`, (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      const sql = 'INSERT INTO test (songname, artistname, year, song_image, song_audio) VALUES (?, ?, ?, ?, ?)';
      db.query(sql, [songname, artistname, year, imgPath, audioPath], (err, result) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }

        res.json({ message: 'Song added successfully.' });
      });
    });
  });
});

// Read (All)
app.get('/api/songs', (req, res) => {
  const sql = 'SELECT * FROM test';
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json(results);
  });
});

// Update
app.put('/api/songs/:id', (req, res) => {
  const songId = req.params.id;
  const { songname, artistname, year } = req.body;

  const sql = 'UPDATE test SET songname = ?, artistname = ?, year = ? WHERE id = ?';

  db.query(sql, [songname, artistname, year, songId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json({ message: 'Song updated successfully.' });
  });
});

// Delete
app.delete('/api/songs/:id', (req, res) => {
  const songId = req.params.id;

  const sql = 'DELETE FROM test WHERE id = ?';

  db.query(sql, [songId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json({ message: 'Song deleted successfully.' });
  });
});


// SEt Port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

function deleteFile(filePath) {
  try {
    fs.unlinkSync(filePath);
    console.log(`File deleted: ${filePath}`);
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.log(`File not found: ${filePath}`);
    } else {
      console.error(`Error deleting file ${filePath}:`, err);
    }
  }
}

