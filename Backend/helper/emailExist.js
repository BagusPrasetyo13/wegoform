import User from "../model/User.js";

const emailExists = async (email) => {
  const user = await User.findOne({ email: email });
  if (user) {
    return true;
  }
  return false;
};

export default emailExists;
