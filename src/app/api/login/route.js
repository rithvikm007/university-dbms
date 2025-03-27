import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import sequelize from '../../../utils/db';
import User from '../../../models/User';

export async function POST(req) {
  try {
    const { email, password } = await req.json();  // Ensure proper destructuring of request body
    console.log("Email:", email);  // Log to ensure the data is captured

    const user = await User.findOne({ where: { email } });
    console.log("User found:", user);  // Check if user is found in the database

    // If the user doesn't exist, return an error
    if (!user) {
      console.log("Error: User not found");
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Compare the password hash
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match:", isMatch);  // Log the result of the password comparison
    if (!isMatch) {
      console.log("Error: Password mismatch");
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = jwt.sign(
      { userId: user.user_id, userType: user.user_type },
      process.env.JWT_SECRET,  // Ensure this environment variable is set
      { expiresIn: '1h' }
    );
    console.log("Token generated:", token);  // Log the generated token
    return NextResponse.json({ token });

  } catch (error) {
    console.error("Login error:", error);  // Log the error for debugging
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
