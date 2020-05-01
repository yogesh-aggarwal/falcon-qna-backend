const Answer = require("./models/answers");
const Question = require("./models/questions");
const User = require("./models/users");

const getAnswer = async (_parent: any, args: any, deep: boolean = true) => {
  args = args.args;
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
};

const getQuestion = async (_parent: any, args: any, deep: boolean = true) => {
  args = args.args;
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

    const answers: Array<string> = question["answers"];
    let newAnswers = [];
    for (let i = 0; i < answers.length; i++) {
      try {
        newAnswers.push(
          await getAnswer(null, { args: { _id: answers[i] } }, (deep = false))
        );
      } catch {}
    }
    newAnswers.sort((ans1, ans2) => {
      return ans2.votes.net - ans1.votes.net;
    });
    question["answers"] = newAnswers;
  }
  return question;
};

const getUser = async (_parent: any, args: any, deep: boolean = true) => {
  args = args.args;
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
};

const voteAnswer = async (_parent: any, args: any) => {
  args = args.args;
  const _answerVotes = (
    await getAnswer(null, { args: { _id: args.answerId } }, false)
  ).votes;
  let answerVotes: {
    net: number;
    upvoters: Array<string>;
    downvoters: Array<string>;
  } = {
    net: _answerVotes.net,
    upvoters: Object.values(_answerVotes.upvoters),
    downvoters: Object.values(_answerVotes.downvoters),
  };

  let upvoter: boolean = answerVotes.upvoters.includes(args.uid);
  let downvoter: boolean = answerVotes.downvoters.includes(args.uid);

  if (upvoter && args.score == -1) {
    answerVotes.net -= 2;
    answerVotes.downvoters.push(args.uid);
    answerVotes.upvoters.splice(answerVotes.upvoters.indexOf(args.uid), 1);
  } else if (downvoter && args.score == 1) {
    answerVotes.net += 2;
    answerVotes.upvoters.push(args.uid);
    answerVotes.downvoters.splice(answerVotes.downvoters.indexOf(args.uid), 1);
  } else if (!upvoter && !downvoter) {
    if (args.score == 1) {
      answerVotes.net += 1;
      answerVotes.upvoters.push(args.uid);
    } else if (args.score == -1) {
      answerVotes.net -= 1;
      answerVotes.downvoters.push(args.uid);
    } else {
      throw Error("Invalid vote option!");
    }
  } else {
    return false;
  }

  await Answer.model.updateOne({ _id: args.answerId }, { votes: answerVotes });

  return true;
};

const voteQuestion = async (_parent: any, args: any) => {
  args = args.args;
  const _questionVotes = (
    await getQuestion(null, { args: { _id: args.questionId } }, false)
  ).votes;
  let questionVotes: {
    net: number;
    upvoters: Array<string>;
    downvoters: Array<string>;
  } = {
    net: _questionVotes.net,
    upvoters: Object.values(_questionVotes.upvoters),
    downvoters: Object.values(_questionVotes.downvoters),
  };

  let upvoter: boolean = questionVotes.upvoters.includes(args.uid);
  let downvoter: boolean = questionVotes.downvoters.includes(args.uid);

  if (upvoter && args.score == -1) {
    questionVotes.net -= 2;
    questionVotes.downvoters.push(args.uid);
    questionVotes.upvoters.splice(questionVotes.upvoters.indexOf(args.uid), 1);
  } else if (downvoter && args.score == 1) {
    questionVotes.net += 2;
    questionVotes.upvoters.push(args.uid);
    questionVotes.downvoters.splice(
      questionVotes.downvoters.indexOf(args.uid),
      1
    );
  } else if (!upvoter && !downvoter) {
    if (args.score == 1) {
      questionVotes.net += 1;
      questionVotes.upvoters.push(args.uid);
    } else if (args.score == -1) {
      questionVotes.net -= 1;
      questionVotes.downvoters.push(args.uid);
    } else {
      throw Error("Invalid vote option!");
    }
  } else {
    return false;
  }

  await Question.model.updateOne(
    { _id: args.questionId },
    { votes: questionVotes }
  );

  return true;
};

async function getAllQuestions(_parent: any, args: any) {
  const questions = await Question.model.find({});

  let final = [];
  for (let question of questions) {
    final.push(await getQuestion(null, { args: { _id: question._id } }));
  }
  final.sort((ques1, ques2) => {
    let dateWeight: number = (ques1.postedOn - ques2.postedOn) / 1e7;
    let voteWeight: number = ques1.votes.net - ques2.votes.net;
    console.log(dateWeight, voteWeight);
    return dateWeight + voteWeight;
  });
  return final.reverse();
}

async function checkUserAnswerable(_parent: any, args: any) {
  args = args.args;
  const answer = await Answer.model.findOne({
    owner: args.uid,
    question: args.questionId,
  });
  return answer ? false : true;
}

module.exports = {
  QueryResolver: {
    getAnswer: getAnswer,
    getAllQuestions: getAllQuestions,
    getQuestion: getQuestion,
    getUser: getUser,
    /// Globals
    checkUserAnswerable: checkUserAnswerable,
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
    /// Globals
    voteAnswer: voteAnswer,
    voteQuestion: voteQuestion,
  },
};
