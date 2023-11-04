import connection from "./connection.js";

connection();

const args = process.argv; // -> process.argv digunakan untuk mendapatkan argumen yang dikirimkan melalui console

// console.log(args);
/** HASIL CONSOLE.LOG
 * [
 *  'C:\\Program Files\\nodejs\\node.exe', [0]
 *  'D:\\Projects\\wegoform\\faker.js' [1]
 *  'answer' [2]
 * ]
 * penambahan argumen melalui terminal -> node faker.js answer
 */
const fakerFile = args[2]; // -> argumen ke 2 ke answer
const faker = await import(`./faker/${fakerFile}.js`); // -> hasil answer.js yang ada di foler faker

faker.run(); // run;
