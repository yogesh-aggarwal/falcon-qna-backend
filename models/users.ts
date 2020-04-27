import * as mongoose from "mongoose";

const Schema = mongoose.Schema;

const User = new Schema({
  _id: {
    type: String,
    required: true,
  },
  isBanned: {
    type: Boolean,
    required: true,
    default: false,
  },
  reputation: {
    type: Number,
    required: true,
    default: 1,
  },
  name: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
    required: true,
    default: "This user is used to have clouds of mystery on their bio.",
  },
  email: {
    type: String,
    required: true,
  },
  questions: {
    type: [String],
    required: true,
    default: [],
  },
  answers: {
    type: [String],
    required: true,
    default: [],
  },
  joinedOn: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

const UserModel = mongoose.model("User", User, "Users");

const createUser = async (_parent: any, args: any) => {
  try {
    args = args.args;
    let a = await UserModel.create({
      _id: args.uname,
      name: args.name,
      email: args.email,
    });
    return true;
  } catch (err) {
    throw err;
    return false;
  }
};

const updateUser = async (_parent: any, args: any) => {
  try {
    await UserModel.updateOne({ _id: args.args._id }, args.args, () => {});
    return true;
  } catch {
    return false;
  }
};

const deleteUser = async (_parent: any, args: any) => {
  try {
    await UserModel.updateOne(args.args._id, () => {});
    return true;
  } catch {
    return false;
  }
};

module.exports = {
  model: UserModel,
  createUser: createUser,
  updateUser: updateUser,
  deleteUser: deleteUser,
};
