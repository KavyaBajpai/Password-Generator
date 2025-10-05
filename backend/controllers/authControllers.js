import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const generateToken = (userId, email ,name) => {
    return jwt.sign({id: userId, name: name, email: email}, process.env.JWT_SECRET, {
        expiresIn: "1d"
    });
};

export const signUp = async (req, res) => {
    try{
        const { name, email, password } = req.body;

        if(!email || !name || !password)
             return res.status(401).json({message: "All fields are required."});

        const existingUser = await User.findOne({email});

        if(existingUser)
            return res.status(401).json({message: "This email has already been registered with us."});

        const hashedPassword = await bcrypt.hash( password, 10);

        const user = await User.create(
            {
                name: name, email: email, password: hashedPassword
            }
        );

        return res.status(201).json({message: "Sign up successful."});
    }
    catch(error)
    {
        console.log("Error signing up: ", error);
        return res.status(500).json({message: "Some error occured: ", deatils: error.message})
    }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email. Please sign up." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password." });
    
    const token = generateToken(user._id, user.email, user.name);

    res.status(201).json({ message: "Login successful.", token, user: {
        id: user._id,
        name: user.name,
        email: user.email
    }});
  } catch (err) {

    console.log("Error logging up: ", error);
    return res.status(500).json({message: "Some error occured: ", deatils: error.message})
    //res.status(500).json({ message: err.message });
  }
};

export const reverifyPassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { password } = req.body;

    if (!password) return res.status(400).json({ message: "Password required" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Incorrect password" });

    return res.json({ message: "User verified." });
  } catch (err) {
    console.error("Reverify error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
