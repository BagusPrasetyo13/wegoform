const questionIdNotValid = async (form, answers) => {
  const found = answers.filter((answer) => {
    let question = form.questions.some(
      (question) => question.id == answer.questionId
    );

    if (question === false) {
      return true;
    }
  });

  //   console.log(found);
  return found;
  //   return true;
};

export default questionIdNotValid;
