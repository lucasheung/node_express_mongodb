import { User, Stock, Position } from '../models/StockSchema'
import { Request, Response } from "express";
export const getUserPositions = async (req: Request, res: Response) => {
    try {
        // Extract username from the request parameters
        const { username } = req.params;

        // Find the user by username
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Find positions for the user and populate the stock information
        const positions = await Position.find({ user_id: user._id })
            .populate({
                path: 'stock_id',
                select: 'stock_name current_price' // Select the fields you want to include
            });

        // Map the positions to include only the required data
        const formattedPositions = positions.map((position: { stock_id: { stock_name: any; current_price: any; }; shares_owned: any; average_price: any; }) => ({
            stock_name: position.stock_id.stock_name,
            current_price: position.stock_id.current_price,
            shares_owned: position.shares_owned,
            average_price: position.average_price
        }));

        // Send the formatted positions as the response
        res.json(formattedPositions)
    } catch (error) {
        // Handle errors
        console.error('Error getting positions:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
export const createStockRecord = async (req: Request, res: Response): Promise<void> => {
    try {
        // const stock = await Stock.find({})
        Stock.insertMany(req.body)

            .then(() => {
                console.log('Mock data inserted successfully!');
                res.status(200).json({ message: "data inserted successfully!" });
            })
            .catch((error: Error) => {
                console.error('Error inserting mock data:', error);
                res.status(500).json({ message: error.message });
            });
    } catch (error) {
        console.error('Error fetching user positions:', error);
        res.status(500)
        throw error;
    }
}

export const addPosition = async (req: Request, res: Response): Promise<void> => {
    try {
        // Extract data from the request body
        const { username, stock_name, shares_owned, average_price } = req.body;

        // Find the user by username
        const user = await User.findOne({ username });

        // Find the stock by stock_name
        const stock = await Stock.findOne({ stock_name });
        if ((!user || !stock) && stock != null) {
            res.status(400).json({ error: 'User or stock not found' });
        }

        // Create a new position document
        const newPosition = new Position({
            user_id: user._id,
            stock_id: stock._id,
            shares_owned,
            average_price
        });

        // Save the new position to the database
        const savedPosition = await newPosition.save();

        // Send a success response
        res.status(201).json(savedPosition);
    } catch (error) {
        // Handle errors
        console.error('Error adding position:', error);
        res.status(500).json({ error: 'Internal server error' });
    }

}

export const getAllStock = async (req: Request, res: Response): Promise<void> => {
    try {
        const stock = await Stock.find({})
        res.status(200).json(stock);
    } catch (error) {
        console.error('Error fetching user positions:', error);
        throw error;
    }
}

export const updateUserPosition = async (req: Request, res: Response) => {
    try {
        const { username } = req.params;
        const { stock_name, shares_owned, average_price } = req.body;

        // Find the user by username
        const user = await User.findOne({ username });

        if (!user) {
            res.status(404).json({ error: 'User not found' });
        }

        // Find the stock by name
        const stock = await Stock.findOne({ stock_name });

        if (!stock && stock != null) {
            res.status(404).json({ error: 'Stock not found' });
        }

        // Find the position by user ID and stock ID
        let position = await Position.findOne({ user_id: user._id, stock_id: stock._id });

        if (!position) {
            res.status(404).json({ error: 'Position not found' });
        }

        // Update position properties
        position.shares_owned = shares_owned;
        position.average_price = average_price;

        // Save the updated position record
        position = await position.save();

        // Send the updated position as response
        res.json(position);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const deletePosition = async (req: Request, res: Response) => {
    try {
        const { username } = req.params;
        const stock_names = req.body;
        // Find the user by username
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }


        // Find the stocks by their names
        const stocks = await Stock.find({ stock_name: { $in: stock_names } });
        // Get stock IDs
        const stockIds = stocks.map((stock: { _id: any; }) => stock._id);
        // Delete positions by user ID and array of stock IDs
        const positions = await Position.deleteMany({ user_id: user._id, stock_id: { $in: stockIds } });

        // Send success message as response
        res.json({ message: `${positions.deletedCount} position(s) deleted successfully` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

