import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import User from '../../../models/User';  // Sequelize model

export async function POST(req) {
  try {
    // Get the request body
    const { name, email, phone_no, password } = await req.json();

    // Check if any of the required fields are missing
    if (!name || !email || !phone_no || !password) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // Validate the email (simple check)
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new admin user
    const newUser = await User.create({
      name,
      email,
      phone_no,
      user_type: 'admin',  // Always set the user type as admin
      password: hashedPassword,  // Store the hashed password
    });

    // Return success response
    return NextResponse.json({ message: 'Admin created successfully', user: newUser });

  } catch (error) {
    console.error('Error creating admin:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
