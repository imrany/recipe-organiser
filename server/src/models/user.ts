import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: { type: String, unique: true, required: true },
  type: { type: String, default: 'user', required: true },
  username: { type: String, required: true },
  photo: { type: String },
  created_at: { type: Date, default: Date.now },
  password: { type: String, required: true }
});
const userModel=mongoose.model("User",UserSchema)
export default userModel