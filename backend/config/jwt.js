import jwt from "jsonwebtoken";
import Token from "../models/Token.js";


const generateAccessToken=(userId) => {
    return jwt.sign({ userId }, process.env.JWT_ACCESS_SECRET, {
      expiresIn: "15m",
    });     
}

const generateRefreshToken = async (userId) => {  
    
    const refreshToken = jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, {
      expiresIn: "7d",
    });

    const expiresAt = new Date();   
    expiresAt.setDate(expiresAt.getDate() + 7);
    
    await Token.create(userId, refreshToken, expiresAt);
    
    return refreshToken;

}

export  { generateAccessToken, generateRefreshToken }