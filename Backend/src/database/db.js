import mongoose from "mongoose";
import {dbname} from "../constant.js"
const con = async () => {
  try {
   const connection = await mongoose.connect(`${process.env.DbUrl}/${dbname}`);
    console.log("Database connected:" + connection.connection.host);
    
  } catch (e) {
    console.log("error" + e);
  }
};

export default con;
