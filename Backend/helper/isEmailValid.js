const isEmailValid = (email) => {
  return /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/.test(email);
  //   if (/[a-z0-9]+@[a-z]+\.[a-z]{2,3}/.test(answer.value) === false) {
  //     return true;
  //   }
};

export default isEmailValid;
