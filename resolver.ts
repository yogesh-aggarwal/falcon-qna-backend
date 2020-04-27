const Answer = require("./models/answers");
const Question = require("./models/questions");
const User = require("./models/users");

const getAnswer = async (_parent: any, args: any, deep: boolean = true) => {
  args = args.args;
  try {
    let answer = (await Answer.model.findById(args._id)).toObject();
    if (deep) {
      answer["owner"] = await getUser(
        null,
        { args: { _id: answer["owner"] } },
        (deep = false)
      );
      let editedBy = answer["editedBy"];
      for (let i = 0; i < editedBy.length; i++) {
        editedBy[i] = await getUser(
          null,
          { args: { _id: editedBy[i] } },
          (deep = false)
        );
      }
      answer["editedBy"] = editedBy;
    }
    return answer;
  } catch (err) {
    return false;
  }
};

const getQuestion = async (_parent: any, args: any, deep: boolean = true) => {
  args = args.args;
  try {
    let question = (await Question.model.findById(args._id)).toObject();
    if (deep) {
      question["owner"] = await getUser(
        null,
        { args: { _id: question["owner"] } },
        (deep = false)
      );
      let editedBy = question["editedBy"];
      for (let i = 0; i < editedBy.length; i++) {
        editedBy[i] = await getUser(
          null,
          { args: { _id: editedBy[i] } },
          (deep = false)
        );
      }
      question["editedBy"] = editedBy;
    }
    return question;
    setTimeout(() => {}, 10000);
  } catch (err) {
    return false;
  }
};

const getUser = async (_parent: any, args: any, deep: boolean = true) => {
  args = args.args;
  try {
    let user = (await User.model.findById(args._id)).toObject();
    if (deep) {
      //? For Answers
      let answers = user["answers"];
      for (let i = 0; i < answers.length; i++) {
        answers[i] = await getAnswer(
          null,
          { args: { _id: answers[i] } },
          (deep = false)
        );
      }
      user["answers"] = answers;
      //? For Questions
      let questions = user["questions"];
      for (let i = 0; i < questions.length; i++) {
        questions[i] = await getQuestion(
          null,
          { args: { _id: questions[i] } },
          (deep = false)
        );
      }
      user["questions"] = questions;
    }
    return user;
  } catch (err) {
    throw err;
    return false;
  }
};

module.exports = {
  QueryResolver: {
    getAnswer: getAnswer,
    getQuestion: getQuestion,
    getUser: getUser,
  },
  MutationResolver: {
    /// Answer
    createAnswer: Answer.createAnswer,
    updateAnswer: Answer.updateAnswer,
    deleteAnswer: Answer.deleteAnswer,
    /// Question
    createQuestion: Question.createQuestion,
    updateQuestion: Question.updateQuestion,
    deleteQuestion: Question.deleteQuestion,
    /// User
    createUser: User.createUser,
    updateUser: User.updateUser,
    deleteUser: User.deleteUser,
  },
};
