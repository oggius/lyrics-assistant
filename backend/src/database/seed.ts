import { db } from './connection';
import { songs } from './schema';

const sampleSongs = [
  {
    title: 'Amazing Grace',
    author: 'John Newton',
    lyrics: `Amazing grace, how sweet the sound
That saved a wretch like me
I once was lost, but now am found
Was blind, but now I see

'Twas grace that taught my heart to fear
And grace my fears relieved
How precious did that grace appear
The hour I first believed

Through many dangers, toils and snares
I have already come
'Tis grace hath brought me safe thus far
And grace will lead me home`,
    scrollStartDelay: 3,
    scrollSpeed: 4,
  },
  {
    title: 'Happy Birthday',
    author: 'Traditional',
    lyrics: `Happy birthday to you
Happy birthday to you
Happy birthday dear [name]
Happy birthday to you

And many more
On channel four
And Scooby Doo
On channel two`,
    scrollStartDelay: 0,
    scrollSpeed: 6,
  },
];

async function seed() {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Clear existing data
    await db.delete(songs);
    console.log('🧹 Cleared existing songs');
    
    // Insert sample songs
    const insertedSongs = await db.insert(songs).values(sampleSongs).returning();
    console.log(`✅ Inserted ${insertedSongs.length} sample songs`);
    
    console.log('🎉 Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seed();
}

export { seed };