// app/api/auth/signup/route.ts
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs'; // Import bcryptjs
import { supabaseAdmin } from '@/lib/supabaseAdmin'; // Import Supabase admin client

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    console.log("Signup attempt:", { name, email }); // Log received data

    // --- Placeholder Logic ---
    // TODO: Validate input (name, email format, password strength)
    // TODO: Check if user with this email already exists in your database
    // TODO: Hash the password (e.g., const hashedPassword = await bcrypt.hash(password, 10);)
    // TODO: Save the new user to your database (e.g., await db.createUser({ name, email, password: hashedPassword });)
    // --- End Placeholder ---

    // Simulate success for now
    if (!name || !email || !password) {
       return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // --- Supabase Logic ---
    // Check if user exists
    const { data: existingUserData, error: existingUserError } = await supabaseAdmin
      .from('users') // Your table name
      .select('email')
      .eq('email', email)
      .maybeSingle(); // Use maybeSingle() if email is unique

    if (existingUserError && existingUserError.code !== 'PGRST116') { // Ignore 'No rows found' error
        console.error("Supabase check user error:", existingUserError);
        return NextResponse.json({ message: 'Database error checking user' }, { status: 500 });
    }

    if (existingUserData) {
        return NextResponse.json({ message: 'User already exists' }, { status: 409 }); // Conflict
    }

    // Hash password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10); // Hash with 10 salt rounds

    // Save new user
    const { data: newUser, error: insertError } = await supabaseAdmin
      .from('users') // Your table name
      .insert([
        { name, email, hashed_password: hashedPassword } // Ensure column name matches your DB
      ])
      .select(); // Optionally select the inserted data

    if (insertError) {
        console.error("Supabase insert user error:", insertError);
        return NextResponse.json({ message: 'Database error creating user' }, { status: 500 });
    }

    console.log("User created successfully:", newUser);
    // --- End Supabase Logic ---

    // Respond with success
    return NextResponse.json({ message: 'User created successfully' }, { status: 201 });

  } catch (error) {
    console.error("Signup API Error:", error);
    return NextResponse.json({ message: 'An error occurred during sign up.' }, { status: 500 });
  }
}