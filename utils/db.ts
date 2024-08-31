import mongoose from 'mongoose';
require('dotenv').config();

const db: string = process.env.DB_URI || '';

const connectDB = async () => {
  try {
    await mongoose.connect(db).then((data: any) => {
      console.log('conexao com o banco de dados realizado com sucesso');
    });
  } catch (error: any) {
    console.log(error.message);
  }
};

export default connectDB;
