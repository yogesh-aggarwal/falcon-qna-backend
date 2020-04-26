import * as mongoose from "mongoose";

const Schema = mongoose.Schema;

const Question = new Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    default: mongoose.Types.ObjectId(Date.now()),
  },
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  views: {
    type: Number,
    required: true,
    default: 0
  },
  isSuspended: {
    type: Boolean,
    required: true,
    default: false
  },
  owner: {
    type: String,
    required: true,
  },
  tags: {
    type: [String],
    required: true,
    default: []
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

const QuestionModel = mongoose.model("Question", Question, "Questions");

const createQuestion = (_parent: any, args: any) => {
  try {
    args = args.args;
    QuestionModel.create(
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

const updateQuestion = (_parent: any, args: any) => {
  try {
    QuestionModel.updateOne({ _id: args.args._id }, args.args, () => {});
  } catch {
    return false;
  }
};

const deleteQuestion = (_parent: any, args: any) => {
  try {
    QuestionModel.updateOne(args.args._id, () => {});
  } catch {
    return false;
  }
};

module.exports = {
  model: QuestionModel,
  createQuestion: createQuestion,
  updateQuestion: updateQuestion,
  deleteQuestion: deleteQuestion,
};
