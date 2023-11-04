const optionValueNotExist = async (form, answers) => {
  const found = form.questions.filter((question) => {
    if (question.type == "Radio" || question.type == "Dropdown") {
      /**
       * variable answer untuk menampung pengecekan
       * answers.find -> cari ke dalam array 'answers' lalu cek satu object satu persatu
       * lalu cocokkan dengan id dari question
       */
      const answer = answers.find((answer) => answer.questionId == question.id);

      // console.log(answer);
      if (answer) {
        const option = question.options.find(
          (option) => option.value == answer.value
        );
        // console.log(option);
        if (option === undefined) {
          return true;
        }
      }
    } else if (question.type == "Checkbox") {
      const answer = answers.find((answer) => answer.questionId == question.id);
      // console.log(answer);
      if (answer) {
        // -> PENGGUNAAN some untuk mengakses answer.value dari jawaban satu persatu
        return answer.value.some((value) => {
          const option = question.options.find(
            (option) => option.value == value
          );
          if (option == undefined) {
            return true;
          }
        });
      }
    }
  });

  // 'found[0].question' -> hanya menampilkan error satu persatu
  // tidak langsung semua nilai dikeluarkan atau ditampilkan
  // '.question' -> menampilkan pertanyaan dari jawaban yang tidak sesuai atau error
  return found;
  // return true;
};

export default optionValueNotExist;
