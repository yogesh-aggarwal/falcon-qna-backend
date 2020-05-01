import * as mongoose from "mongoose";
const Question = require("./questions");

const Schema = mongoose.Schema;

const Answer = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    default: mongoose.Types.ObjectId,
  },
  body: {
    type: String,
    required: true,
  },
  owner: {
    type: String,
    required: true,
  },
  question: {
    type: String,
    required: true,
  },
  votes: {
    type: {
      net: {
        type: Number,
        required: true,
      },
      upvoters: {
        type: String,
        required: true,
      },
      downvoters: {
        type: String,
        required: true,
      },
    },
    required: true,
    default: {
      net: 0,
      upvoters: [],
      downvoters: [],
    },
  },
  postedOn: {
    type: Date,
    required: true,
    default: Date.now,
  },
  editedBy: {
    type: [String],
    required: true,
    default: [],
  },
  editedOn: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

const AnswerModel = mongoose.model("Answer", Answer, "Answers");

const createAnswer = async (_parent: any, args: any) => {
  try {
    args = args.args;
    let newAnswer = await new AnswerModel(args);
    newAnswer.save();
    Question.model.updateOne  (
      { _id: args.question },
      { $push: { answers: newAnswer._id } },
      () => {}
    );
    return newAnswer._id;
  } catch {
    return false;
  }
};

const updateAnswer = async (_parent: any, args: any) => {
  try {
    await AnswerModel.updateOne({ _id: args.args._id }, args.args, () => {});
    return true;
  } catch {
    return false;
  }
};

const deleteAnswer = async (_parent: any, args: any) => {
  try {
    await AnswerModel.updateOne(args.args._id, () => {});
    return true;
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
