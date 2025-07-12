// seed_skills.js
import mongoose from 'mongoose';
import Skills from './Skills.js';

const MONGO_URI = 'mongodb+srv://dhwani22:dhwani22@cluster0.p62ch.mongodb.net/Skill_Swap_Platform?retryWrites=true&w=majority&appName=Cluster0';

const seedSkills = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    await Skills.deleteMany();

    const skillData = [
      {
        category: "frameworks",
        skills: ["React", "Angular", "Vue.js", "Django", "Spring Boot", "Express"]
      },
      {
        category: "languages",
        skills: ["JavaScript", "Python", "Java", "C++", "Ruby", "Go", "TypeScript"]
      },
      {
        category: "tools",
        skills: ["Git", "Docker", "Webpack", "Postman", "Jenkins", "VSCode"]
      },
      {
        category: "design",
        skills: ["Figma", "Sketch", "Photoshop", "Illustrator", "Canva"]
      },
      {
        category: "databases",
        skills: ["MongoDB", "MySQL", "PostgreSQL", "SQLite", "Firebase"]
      },
      {
        category: "others",
        skills: ["UI/UX", "Agile", "Scrum", "SEO", "Testing", "Data Structures"]
      }
    ];

    const result = await Skills.insertMany(skillData);
    console.log(`✅ Inserted ${result.length} skill categories`);

    await mongoose.disconnect();
    console.log("✅ MongoDB disconnected");
  } catch (err) {
    console.error("❌ Error inserting skills:", err);
    process.exit(1);
  }
};

seedSkills();
