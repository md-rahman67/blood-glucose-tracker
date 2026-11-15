import mongoose from "mongoose";
const Schema = mongoose.Schema;
import passportLocalMongoose from "passport-local-mongoose";

const User = new Schema({
    email: {
        type: String,
        required: true
    }
});

User.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", User);
