import mongoose, { ConnectOptions } from 'mongoose';

const connectDB = async (): Promise<void> => {
  try {

    await mongoose.connect(process.env.DATABASE_URL as string);

    console.log(`Connected to MongoDB Successfully`);
    console.log('  ▀▄   ▄▀');
    console.log(' ▄█▀███▀█▄');
    console.log('█▀███████▀█');
    console.log('█ █▀▀▀▀▀█ █');
    console.log('   ▀▀ ▀▀');
    console.log('Hello Adventurer, a good day to remind you Cristiano Ronaldo still remains the GOAT !!!!');
  } catch (error:any) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
