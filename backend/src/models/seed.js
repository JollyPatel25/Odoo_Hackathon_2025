import mongoose from 'mongoose';
import User from './User.js';
import SwapSkill from './SwapSkill.js';
import Ratings from './Ratings.js';

const MONGO_URI = 'mongodb+srv://dhwani22:dhwani22@cluster0.p62ch.mongodb.net/Skill_Swap_Platform?retryWrites=true&w=majority&appName=Cluster0';

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ MongoDB connected');

    await User.deleteMany();
    await SwapSkill.deleteMany();
    await Ratings.deleteMany();

    const skillPool = ["React", "Node.js", "Python", "Java", "UI/UX", "Graphic Design", "Photoshop", "Illustrator"];
    const availabilities = ["Weekdays", "Weekends", "Evenings"];
    const names = ["Alice", "Bob", "Charlie", "Diana", "Ethan", "Fiona", "George", "Hina", "Ishaan", "Jaya", "Karan", "Lina", "Manav", "Nina", "Om", "Pia", "Qasim", "Rhea", "Sam", "Tina"];

    const users = [];

    for (let i = 0; i < 20; i++) {
      const offered = [skillPool[i % skillPool.length], skillPool[(i + 2) % skillPool.length]];
      const wanted = [skillPool[(i + 1) % skillPool.length], skillPool[(i + 3) % skillPool.length]];
      const profilePhoto = Math.random() > 0.5 ? 'alice.jpg' : 'bob.jpg';

      users.push({
        name: `${names[i]} ${i % 2 === 0 ? 'Sharma' : 'Mehta'}`,
        email: `${names[i].toLowerCase()}${i}@example.com`,
        password: 'hashedpassword123',
        location: i % 2 === 0 ? 'Delhi' : 'Mumbai',
        profilePhoto,
        skillsOffered: offered,
        skillsWanted: wanted,
        availability: availabilities[i % availabilities.length],
        profilePublic: true,
        rating: (Math.random() * 2 + 3).toFixed(1),
        role: "user"
      });
    }

    const insertedUsers = await User.insertMany(users);
    console.log("✅ Inserted Users:", insertedUsers.length);

    const swap = await SwapSkill.create({
      requestor: insertedUsers[0]._id,
      requested: insertedUsers[1]._id,
      offeredSkill: insertedUsers[0].skillsOffered[0],
      wantedSkill: insertedUsers[0].skillsWanted[0],
      message: "Let's swap our skills!",
      status: "pending"
    });

    console.log("✅ Inserted Swap:", swap);

    const rating = await Ratings.create({
      swapId: swap._id,
      fromUser: insertedUsers[0]._id,
      toUser: insertedUsers[1]._id,
      rating: 5,
      comment: "Awesome experience!"
    });

    console.log("✅ Inserted Rating:", rating);

    await mongoose.disconnect();
    console.log("✅ MongoDB disconnected");
  } catch (err) {
    console.error("❌ Error inserting dummy data:", err);
    process.exit(1);
  }
};

connectDB();
