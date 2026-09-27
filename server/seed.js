require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Opportunity = require('./models/Opportunity');
const connectDB = require('./config/db');

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany();
    await Opportunity.deleteMany();

    console.log('Data cleared');

    // Create Admin
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@test.com',
      password: 'password123',
      role: 'admin',
    });

    console.log('Admin created');

    // Create Opportunities
    const opportunities = [
      {
        title: 'Software Engineering Internship',
        description: 'Join our team for a 3-month summer internship and work on scalable web applications.',
        organization: 'Tech Innovations Inc.',
        type: 'Internship',
        location: 'San Francisco, CA (Hybrid)',
        mode: 'Hybrid',
        applicationUrl: 'https://example.com/apply',
        deadline: new Date(new Date().setMonth(new Date().getMonth() + 1)), // 1 month from now
        startDate: new Date(new Date().setMonth(new Date().getMonth() + 2)),
        skills: ['React', 'Node.js', 'MongoDB'],
        eligibility: 'Pre-final or final year CS students',
        stipend: '$3000/month',
        category: 'Technology',
        createdBy: adminUser._id
      },
      {
        title: 'Global Hackathon 2026',
        description: 'Compete with developers around the world to build innovative solutions.',
        organization: 'Global Hackers',
        type: 'Hackathon',
        mode: 'Online',
        applicationUrl: 'https://example.com/hackathon',
        deadline: new Date(new Date().setMonth(new Date().getMonth() + 2)), 
        startDate: new Date(new Date().setMonth(new Date().getMonth() + 3)),
        skills: ['Any'],
        eligibility: 'Open to all students',
        category: 'Technology',
        createdBy: adminUser._id
      },
      {
        title: 'AI/ML Workshop',
        description: 'A 2-day intensive workshop on modern AI techniques and machine learning models.',
        organization: 'Data Science Society',
        type: 'Workshop',
        location: 'New York, NY',
        mode: 'Offline',
        applicationUrl: 'https://example.com/workshop',
        deadline: new Date(new Date().setDate(new Date().getDate() + 15)), // 15 days from now
        startDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
        skills: ['Python', 'Machine Learning'],
        eligibility: 'Basic knowledge of Python',
        category: 'Data Science',
        createdBy: adminUser._id
      },
      {
        title: 'Cloud Computing Certification',
        description: 'Earn a certification in cloud architecture and services.',
        organization: 'Cloud Masters',
        type: 'Certification',
        mode: 'Online',
        applicationUrl: 'https://example.com/cert',
        deadline: new Date(new Date().setDate(new Date().getDate() + 5)), // 5 days from now
        skills: ['AWS', 'Cloud'],
        eligibility: 'None',
        category: 'Cloud',
        createdBy: adminUser._id
      },
      {
        title: 'UI/UX Design Competition',
        description: 'Design the best user interface for a new mobile app concept.',
        organization: 'Design Hub',
        type: 'Competition',
        mode: 'Online',
        applicationUrl: 'https://example.com/design',
        deadline: new Date(new Date().setDate(new Date().getDate() - 5)), // Expired 5 days ago
        skills: ['Figma', 'UI/UX'],
        eligibility: 'Design students',
        category: 'Design',
        createdBy: adminUser._id
      }
    ];

    await Opportunity.insertMany(opportunities);

    console.log('Opportunities created');
    console.log('Seed completed successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error with data import: ${error}`);
    process.exit(1);
  }
};

seedData();
