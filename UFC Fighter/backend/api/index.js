import dotenv from 'dotenv';
dotenv.config();
import connectDB from '../src/config/db.js';
import app from '../src/app.js';

let isConnected = false;

const connectOnce = async () => {
  if (!isConnected) {
    await connectDB();
    isConnected = true;
  }
};

export default async function handler(req, res) {
  await connectOnce();
  return app(req, res);
}