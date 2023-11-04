import isEmailValid from "../helper/isEmailValid.js";

const emailNotValid = async (form, answers) => {
  const found = form.questions.filter((question) => {
    if (question.type == "Email") {
      const answer = answers.find((answer) => answer.questionId == question.id);

      // UNTUK SKIP PENGECEKAN EMAIL JIKA REQUIRED === FALSE DAN JIKA TIDAK ADA JAWABAN
      if (question.required === false) {
        if (
          answer === undefined ||
          answer.value === undefined ||
          answer.value === null ||
          answer.value === ""
        ) {
          return false;
        }
      }

      if (answer) {
        /**
         * regex -> ["a-z" -> semua huruf alphabet boleh digunakan]
         * -> ["0-9" -> semua angka boleh digunakan]
         * -> +@[a-z] -> wajib menggunakan at '@' dan harus ada alphabet lagi
         * -> +\. -> wajib menggunakan titik
         * -> {2,3} -> 2 sampai 3 characters
         */
        if (!isEmailValid(answer.value)) {
          return true;
        }
      }
    }
  });

  return found;
};

export default emailNotValid;
