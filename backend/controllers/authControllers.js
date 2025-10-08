import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Vault from '../models/Vault.js';
import mongoose from 'mongoose';
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
            return res.status(401).json({ message: "This email has already been registered with us."});

        const hashedPassword = await bcrypt.hash( password, 10);

        const user = await User.create(
            {
                name: name, email: email, password: hashedPassword
            }
        );

        return res.status(201).json({success:true, message: "Sign up successful."});
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

// export const reverifyPassword = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const { password } = req.body;

//     if (!password) return res.status(400).json({ message: "Password required" });

//     const user = await User.findById(userId);
//     if (!user) return res.status(404).json({ message: "User not found" });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(401).json({ message: "Incorrect password" });

//     return res.json({ message: "User verified." });
//   } catch (err) {
//     console.error("Reverify error:", err);
//     return res.status(500).json({ message: "Server error" });
//   }
// };

export const reverifyAndDelete = async (req, res) => {
  const userId = req.user.id;
  const { password } = req.body;
  const { id } = req.params; // ✅ vault id from URL param
  console.log("id of password: ", id);
  try {
    const user = await User.findById(userId);
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ success: false, message: "Invalid password" });

    const deletedVault = await Vault.findOneAndDelete(id);
    if (!deletedVault)
      return res.status(404).json({ success: false, message: "Vault entry not found" });

    res.status(200).json({ success: true, message: "Vault entry deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" , details: error.message});
  }
};

export const reverifyAndEdit = async (req, res) => {
  const userId = req.user.id;
  const {password, newPassword, newSiteName} = req.body;
  const {id} = req.params;

  try{
    if(!password || !newPassword || !newSiteName)
      return res.status(401).json({success:false, message: "All fields are necessary."})
    const user = await User.findById(userId);
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ success: false, message: "Invalid password" });

    const item = await Vault.findOne({_id: id});
        if (!item) return res.status(404).json({ message: "Item not found" });
    
        if (newSiteName) item.siteName = newSiteName;
        if (newPassword) item.hashedPassword = newPassword;
    
        await item.save();
        console.log(item.siteName, item.hashedPassword)
        return res.status(201).json({ message: "Vault item updated successfully", item });
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" , details: error.message});
  }
}