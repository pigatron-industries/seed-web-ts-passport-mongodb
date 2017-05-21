import * as mongoose from "mongoose";
import {IUser} from "../entity/IUser";

interface UserModel extends IUser, mongoose.Document {
}

const userSchema = new mongoose.Schema({
    username: {type: String, required:true, unique:true},
    password: {type: String, required:true},
    enabled: Boolean
});

export const User = mongoose.model<UserModel>("User", userSchema);

