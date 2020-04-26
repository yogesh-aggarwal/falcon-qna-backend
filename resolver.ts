const Answer = require("./models/answers");
const Question = require("./models/questions");
const User = require("./models/users");

const getAnswer = (_parent: any, args: any, deep: boolean = true) => {
  args = args.args;
  console.log(args);
  try {
    let answer = Answer.model.findById(args._id).toObject();
    if (deep) {
      answer["owner"] = getUser(
        null,
        { args: { _id: answer["owner"] } },
        (deep = false)
      );
      let editedBy = answer["editedBy"];
      for (let i = 0; i < editedBy.length; i++) {
        editedBy[i] = getUser(
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

const getQuestion = (_parent: any, args: any, deep: boolean = true) => {
  args = args.args;
  try {
    let question = Question.model.findById(args._id).toObject();
    if (deep) {
      question["owner"] = getUser(
        null,
        { args: { _id: question["owner"] } },
        (deep = false)
      );
      let editedBy = question["editedBy"];
      for (let i = 0; i < editedBy.length; i++) {
        editedBy[i] = getUser(
          null,
          { args: { _id: editedBy[i] } },
          (deep = false)
        );
      }
      question["editedBy"] = editedBy;
    }
    return question;
  } catch (err) {
    return false;
  }
};

const getUser = (_parent: any, args: any, deep: boolean = true) => {
  args = args.args;
  try {
    let user = User.model.findById(args._id).toObject();
    if (deep) {
      //? For Answers
      let answers = user["answers"];
      for (let i = 0; i < answers.length; i++) {
        answers[i] = getAnswer(
          null,
          { args: { _id: answers[i] } },
          (deep = false)
        );
      }
      user["answers"] = answers;
      //? For Questions
      let questions = user["questions"];
      for (let i = 0; i < questions.length; i++) {
        questions[i] = getQuestion(
          null,
          { args: { _id: questions[i] } },
          (deep = false)
        );
      }
      user["questions"] = questions;
    }
    return user;
  } catch (err) {
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
