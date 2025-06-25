import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Creator from '../models/Creator.js';
import Video from '../models/Video.js';
import Category from '../models/Category.js';
import { generateConfirmationCode } from '../utils/helpers.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Creator.deleteMany({}),
      Video.deleteMany({}),
      Category.deleteMany({})
    ]);
    console.log('🗑️ Cleared existing data');

    // Insert categories
    const categories = [
      { name: 'Class 1', icon: '1' },
      { name: 'Class 2', icon: '2' },
      { name: 'Class 3', icon: '3' },
      { name: 'Class 4', icon: '4' },
      { name: 'Class 5', icon: '5' },
      { name: 'Class 6', icon: '6' },
      { name: 'Class 7', icon: '7' },
      { name: 'Class 8', icon: '8' }
    ];

    const createdCategories = await Category.insertMany(categories);
    console.log('📚 Categories created');

    // Create category map for easy reference
    const categoryMap = {};
    createdCategories.forEach(cat => {
      categoryMap[cat.name] = cat._id;
    });

    // Insert sample users
    const users = [
      {
        username: 'johndoe',
        email: 'john@example.com',
        password: 'password123',
        name: 'John Doe',
        bio: 'Enthusiastic learner',
        profilePic: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=600'
      },
      {
        username: 'janesmith',
        email: 'jane@example.com',
        password: 'password123',
        name: 'Jane Smith',
        bio: 'Always curious, always learning',
        profilePic: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=600'
      }
    ];

    const createdUsers = await User.insertMany(users);
    console.log('👥 Users created');

    // Insert sample creators
    const creators = [
      {
        username: 'alexj',
        email: 'alex@example.com',
        password: 'password123',
        name: 'Alex Johnson',
        bio: 'Mathematics professor with 10+ years of teaching experience',
        profilePic: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=600',
        youtubeChannel: 'https://youtube.com/alexjohnson',
        instagramHandle: 'https://instagram.com/alexjohnson',
        linkedinProfile: 'https://linkedin.com/in/alexjohnson',
        confirmationCode: generateConfirmationCode(),
        isVerified: true
      },
      {
        username: 'sarahc',
        email: 'sarah@example.com',
        password: 'password123',
        name: 'Sarah Chen',
        bio: 'Science educator specializing in physics and astronomy',
        profilePic: 'https://images.pexels.com/photos/3394347/pexels-photo-3394347.jpeg?auto=compress&cs=tinysrgb&w=600',
        youtubeChannel: 'https://youtube.com/sarahchen',
        instagramHandle: 'https://instagram.com/sarahchen',
        linkedinProfile: 'https://linkedin.com/in/sarahchen',
        confirmationCode: generateConfirmationCode(),
        isVerified: true
      },
      {
        username: 'michaelr',
        email: 'michael@example.com',
        password: 'password123',
        name: 'Michael Rodriguez',
        bio: 'Computer Science professor focusing on algorithms and data structures',
        profilePic: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=600',
        youtubeChannel: 'https://youtube.com/michaelrodriguez',
        instagramHandle: 'https://instagram.com/michaelrodriguez',
        linkedinProfile: 'https://linkedin.com/in/michaelrodriguez',
        confirmationCode: generateConfirmationCode(),
        isVerified: true
      }
    ];

    const createdCreators = await Creator.insertMany(creators);
    console.log('🎓 Creators created');

    // Insert sample videos
    const videos = [
      {
        title: 'Introduction to Algebra',
        description: 'Learn the basics of algebra with simple examples',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        thumbnailUrl: 'https://images.pexels.com/photos/4144179/pexels-photo-4144179.jpeg?auto=compress&cs=tinysrgb&w=600',
        creator: createdCreators[0]._id,
        category: categoryMap['Class 8']
      },
      {
        title: 'Understanding Equations',
        description: 'Master the art of solving equations',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        thumbnailUrl: 'https://images.pexels.com/photos/6238050/pexels-photo-6238050.jpeg?auto=compress&cs=tinysrgb&w=600',
        creator: createdCreators[0]._id,
        category: categoryMap['Class 7']
      },
      {
        title: 'Geometry Basics',
        description: 'Introduction to geometric shapes and concepts',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        thumbnailUrl: 'https://images.pexels.com/photos/3768894/pexels-photo-3768894.jpeg?auto=compress&cs=tinysrgb&w=600',
        creator: createdCreators[0]._id,
        category: categoryMap['Class 6']
      },
      {
        title: 'Introduction to Physics',
        description: 'Explore the fundamental concepts of physics',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        thumbnailUrl: 'https://images.pexels.com/photos/2156881/pexels-photo-2156881.jpeg?auto=compress&cs=tinysrgb&w=600',
        creator: createdCreators[1]._id,
        category: categoryMap['Class 8']
      },
      {
        title: 'Solar System Exploration',
        description: 'Journey through our solar system',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        thumbnailUrl: 'https://images.pexels.com/photos/73873/star-clusters-rosette-nebula-star-galaxies-73873.jpeg?auto=compress&cs=tinysrgb&w=600',
        creator: createdCreators[1]._id,
        category: categoryMap['Class 5']
      },
      {
        title: 'Introduction to Algorithms',
        description: 'Learn the basics of computer algorithms',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        thumbnailUrl: 'https://images.pexels.com/photos/1181271/pexels-photo-1181271.jpeg?auto=compress&cs=tinysrgb&w=600',
        creator: createdCreators[2]._id,
        category: categoryMap['Class 8']
      },
      {
        title: 'Data Structures Fundamentals',
        description: 'Understanding basic data structures',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        thumbnailUrl: 'https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg?auto=compress&cs=tinysrgb&w=600',
        creator: createdCreators[2]._id,
        category: categoryMap['Class 7']
      },
      {
        title: 'Basic English Grammar',
        description: 'Learn fundamental English grammar rules',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        thumbnailUrl: 'https://images.pexels.com/photos/256417/pexels-photo-256417.jpeg?auto=compress&cs=tinysrgb&w=600',
        creator: createdCreators[0]._id,
        category: categoryMap['Class 3']
      }
    ];

    const createdVideos = await Video.insertMany(videos);
    console.log('🎥 Videos created');

    // Update creators with their video references
    for (let i = 0; i < createdCreators.length; i++) {
      const creatorVideos = createdVideos.filter(video => 
        video.creator.toString() === createdCreators[i]._id.toString()
      );
      
      await Creator.findByIdAndUpdate(createdCreators[i]._id, {
        videos: creatorVideos.map(v => v._id)
      });
    }

    console.log('✅ Database seeded successfully!');
    console.log('📝 Sample login credentials:');
    console.log('   Users: johndoe/password123, janesmith/password123');
    console.log('   Creators: alexj/password123, sarahc/password123, michaelr/password123');
    
  } catch (error) {
    console.error('❌ Seeding error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

// Run seeding if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase();
}

export default seedDatabase;