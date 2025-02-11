import User from "../model/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET_KEY = "your_jwt_secret";

export const signup = async (req, res) => {
  try {
    const {name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: "Email already in use." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({name: name, email, password: hashedPassword });
    res.status(201).json({ message: "User signed up successfully", user });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong", error: err });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user.id, name: user.name, email: user.email }, JWT_SECRET_KEY, { expiresIn: "1h" });
    res.json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong", error: err });
  }
};

export const upgradeToPremium = async function upgradeUserToPremium(req, res) {

  try {
  const userId = req.body.userId;
  const expiryDate = new Date();
  expiryDate.setHours(expiryDate.getHours() + 1); // Set 1-hour expiry

  console.log("from upgradeToPremium , userId = ", userId);

  await User.update({ 
    have_premium: true, 
    premium_expires_at: expiryDate 
  }, { where: { id: userId } });

  console.log(`User ${userId} upgraded to premium until ${expiryDate}`);
  res.status(200).json({ message: `User ${userId} upgraded to premium until ${expiryDate}`});

  } catch (err) {
    res.status(500).json({ message: "Something went wrong", error: err });
    console.error(err);
  }
}


export const checkPremium = async function upgradeUserToPremium(req, res) {

  try {
    const {user_id} = req.query;

  const user = await User.findOne({ where: { id: user_id } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

  const premiumStatus = user.have_premium
  res.status(200).json({   havePremium: premiumStatus, message: `User status fetched successfully`});

  } catch (err) {
    res.status(500).json({ message: "Something went wrong", error: err });
    console.error(err);
  }
}

export const getExpiryTime = async function getExpiryTime(req, res){
  try {
    const {user_id} = req.query;

  const user = await User.findOne({ where: { id: user_id } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

  const expiryTime = user.premium_expires_at;
  res.status(200).json({   expiryTime: expiryTime, message: `User expiry time fetched successfully`});

  } catch (err) {
    res.status(500).json({ message: "Something went wrong", error: err });
    console.error(err);
  }
}
