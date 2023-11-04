// PENGECEKAN JIKA ADA JAWABAN YANG SAMA ATAU DUPLICATE

// (answers) -> plural
const answerDuplicate = async (answers) => {
  var seen = new Set(); // new Set() adalah collection yang menyimpan nilai unik
  // answers.some((answer)) -> parameter answers diambil dari parameter answers yang diatas lalu dipecah
  // menjadi single answer ((answer))
  return answers.some((answer) => {
    // JIKA VARIABLE SEEN DIATAS SUDAH MEMILIKI QUESTIONID
    // RETURN TRUE ARTINYA DATA DUPLICATE
    if (seen.has(answer.questionId)) {
      return true;
    }
    seen.add(answer.questionId); // JIKA VARIABLE SEEN TIDAK MEMILIKI QUESTIONID MAKA AKAN TAMBAHIN QUESTIONID
  });
};

export default answerDuplicate;
