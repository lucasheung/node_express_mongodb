const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

const stockSchema = new mongoose.Schema({
    stock_name: { type: String, required: true, unique: true },
    current_price: Number
});

const positionSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    stock_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Stock' },
    shares_owned: Number,
    average_price: Number
});
userSchema.index({ username: 1 }, { unique: true });
stockSchema.index({ stock_name: 1 }, { unique: true });
positionSchema.index({ user_id: 1, stock_id: 1 }, { unique: true });

export const User = mongoose.model('User', userSchema);
export const Stock = mongoose.model('Stock', stockSchema);
export const Position = mongoose.model('Position', positionSchema);
