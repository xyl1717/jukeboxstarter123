const express = require('express');
const bodyParser = require('body-parser');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();

app.use(bodyParser.json());

// Users Routes
app.get('/users', async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

app.get('/users/:id', async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: parseInt(req.params.id) },
    include: { playlists: true },
  });
  res.json(user);
});

// Playlists Routes
app.get('/playlists', async (req, res) => {
  const playlists = await prisma.playlist.findMany({
    include: { tracks: true },
  });
  res.json(playlists);
});

app.post('/playlists', async (req, res) => {
  const { name, description, ownerId, trackIds } = req.body;

  const playlist = await prisma.playlist.create({
    data: {
      name,
      description,
      ownerId,
      tracks: {
        connect: trackIds.map(id => ({ id })),
      },
    },
  });

  res.json(playlist);
});

app.get('/playlists/:id', async (req, res) => {
  const playlist = await prisma.playlist.findUnique({
    where: { id: parseInt(req.params.id) },
    include: { tracks: true },
  });
  res.json(playlist);
});

// Tracks Routes
app.get('/tracks', async (req, res) => {
  const tracks = await prisma.track.findMany();
  res.json(tracks);
});

app.get('/tracks/:id', async (req, res) => {
  const track = await prisma.track.findUnique({
    where: { id: parseInt(req.params.id) },
  });
  res.json(track);
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
