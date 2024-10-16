const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Create Users
  const user1 = await prisma.user.create({
    data: { username: 'user1' },
  });
  const user2 = await prisma.user.create({
    data: { username: 'user2' },
  });

  // Create Tracks
  const track1 = await prisma.track.create({ data: { name: 'Track 1' } });
  const track2 = await prisma.track.create({ data: { name: 'Track 2' } });
  const track3 = await prisma.track.create({ data: { name: 'Track 3' } });

  // Create Playlists and link them to users and tracks
  await prisma.playlist.create({
    data: {
      name: 'Chill Vibes',
      description: 'Relaxing tracks',
      ownerId: user1.id,
      tracks: {
        connect: [{ id: track1.id }, { id: track2.id }],
      },
    },
  });

  await prisma.playlist.create({
    data: {
      name: 'Workout Mix',
      description: 'Get pumped!',
      ownerId: user2.id,
      tracks: {
        connect: [{ id: track2.id }, { id: track3.id }],
      },
    },
  });

  console.log('Database has been seeded.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
