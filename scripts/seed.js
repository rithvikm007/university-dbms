import sequelize from "../src/utils/db.js";
import User from "../src/models/User.js";

const seedUsers = async () => {
  try {
    // Create dummy data
    const users = [
      {
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone_no: '1234567890',
        user_type: 'student', // Can be 'student', 'faculty', or 'admin'
        password: 'password123',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        phone_no: '0987654321',
        user_type: 'faculty',
        password: 'password123',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Alice Johnson',
        email: 'alice.johnson@example.com',
        phone_no: '1122334455',
        user_type: 'admin',
        password: 'password123',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    // Insert data into Users table
    await User.bulkCreate(users);

    console.log('✅ Dummy users data added successfully!');
  } catch (error) {
    console.error('❌ Error adding dummy data:', error);
  }
};

// Run the seeding function
(async () => {
  await seedUsers();
})();
