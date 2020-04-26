import * as mongoose from "mongoose";

const Schema = mongoose.Schema;

const Answer = new Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    default: mongoose.Types.ObjectId(Date.now()),
  },
  body: {
    type: String,
    required: true,
  },
  owner: {
    type: String,
    required: true,
  },
  votes: {
    type: Number,
    required: true,
    default: 0,
  },
  postedOn: {
    type: Date,
    required: true,
    default: Date.now,
  },
  editedBy: {
    type: [String],
    required: true,
  },
  editedOn: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

const AnswerModel = mongoose.model("Answer", Answer, "Answers");

const createAnswer = (_parent: any, args: any) => {
  try {
    AnswerModel.create(args.args, () => {});
  } catch {
    return false;
  }
};

const updateAnswer = (_parent: any, args: any) => {
  try {
    AnswerModel.updateOne({ _id: args.args._id }, args.args, () => {});
  } catch {
    return false;
  }
};

const deleteAnswer = (_parent: any, args: any) => {
  try {
    AnswerModel.updateOne(args.args._id, () => {});
  } catch {
    return false;
  }
};

module.exports = {
  model: AnswerModel,
  createAnswer: createAnswer,
  updateAnswer: updateAnswer,
  deleteAnswer: deleteAnswer,
};
