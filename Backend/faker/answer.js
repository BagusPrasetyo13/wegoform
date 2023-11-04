import { faker } from "@faker-js/faker";
import Answer from "../model/Answer.js";

const run = async () => {
  try {
    let data = [];
    for (let i = 0; i < 10; i++) {
      data.push({
        "6521d2efee4459e908d3632e": faker.person.fullName(),
        "651e8a0aab24b4dbf983dc54": faker.helpers.arrayElement(["42", "31"]),
        "651eb7f69682bff50536f6f4": faker.helpers.arrayElements([
          "Semur",
          "Rendang",
          "Nasi Uduk",
          "Dendeng",
        ]),
        formId: "651e8928e2ee8025fc558ab0",
        userId: "650c1d0b5131f1d3108a2715",
      });
    }

    // kegunaan await untuk menunggu proses input fake data selesai
    // setelah selesai, program akan dihentikan dengan menggunakan process.exit()
    const fakeData = await Answer.insertMany(data);
    if (fakeData) {
      console.log(fakeData); // -> untuk melihat data yang telah diinsert melalui terminal
      process.exit();
    }
  } catch (error) {
    console.log(error);
    process.exit();
  }
};

export { run };
