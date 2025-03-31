import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import sequelize from '../../../utils/db';
import User from '../../../models/User';

export async function POST(req) {
  try {
    const { email, password } = await req.json(); 
    console.log("Email:", email); 

    const user = await User.findOne({ where: { email } });
    console.log("User found:", user);  

    if (!user) {
      console.log("Error: User not found");
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match:", isMatch);  
    if (!isMatch) {
      console.log("Error: Password mismatch");
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = jwt.sign(
      { userId: user.user_id, userType: user.user_type },
      process.env.JWT_SECRET, 
      { expiresIn: '1d' }
    );
    console.log("Token generated:", token); 
    return NextResponse.json({ token });

  } catch (error) {
    console.error("Login error:", error); 
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
