import sampleReadings from "./data.js";
import mongoose from "mongoose";
import Reading from "../models/readings.model.js";

main().then(() => console.log("connected")).catch(err => console.log(err));
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/sweety');
}

const addData = async () => {
    let result = await Reading.insertMany(sampleReadings);

    console.log(result);
}

addData();