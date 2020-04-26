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

const UserModel = mongoose.model("User", User, "users");

const createUser = (_parent: any, args: any) => {
  try {
    args = args.args;
    UserModel.create(
      {
        _id: args.uname,
        name: args.name,
        email: args.email,
      },
      () => {}
    );
  } catch {
    return false;
  }
};

const updateUser = (_parent: any, args: any) => {
  try {
    UserModel.updateOne({ _id: args.args._id }, args.args, () => {});
  } catch {
    return false;
  }
};

const deleteUser = (_parent: any, args: any) => {
  try {
    UserModel.updateOne(args.args._id, () => {});
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
