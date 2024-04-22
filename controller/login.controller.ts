import { Request, Response } from "express";
import bcrypt from 'bcrypt';
import { User } from "../models/StockSchema";
export const checkUserLogin = async (req: Request, res: Response): Promise<void> => {
    const { username, password }: { username: string, password: string } = req.body;
    try {
        // Find the user by username
        const user = await User.findOne({ username });
        console.log(user)
        if (!user) {
            res.status(404).json('User not found');
        }
        // Compare the provided password with the hashed password in the database
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (passwordMatch) {
            res.status(200).json('Login successful');
        } else {
            res.status(401).json('Invalid password');
        }
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json('Internal server error');
    }
};

export const registerUser = async (req: Request, res: Response) => {
    const { username, password }: { username: string, password: string } = req.body;
    try {
        console.log(username, password)
        // Hash the password before saving it to the database
        const hashedPassword: string = await bcrypt.hash(password, 10);
        // Save the username and hashed password to the database
        // Example: User.create({ username, password: hashedPassword });
        const newUser = new User({ username, password: hashedPassword });
        // Save the user document to the database
        await newUser.save();
        res.status(200).json('User registered successfully.');
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json('Internal server error');
    }
};