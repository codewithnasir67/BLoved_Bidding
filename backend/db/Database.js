// const mongoose = require("mongoose");

// const connectDatabase = () => {
//   mongoose
//     .connect(process.env.DB_URL, {

//     })
//     .then((data) => {
//       console.log(`mongod connected with server: ${data.connection.host}`);
//     });
// };

// module.exports = connectDatabase;
const mongoose = require("mongoose");

const connectDatabase = () => {
  return mongoose
    .connect('mongodb+srv://testingyou9966:Pakistan9786@blovedbidding.6eg17.mongodb.net/?appName=blovedbidding', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((data) => {
      console.log(`mongod connected with server: ${data.connection.host}`);
      return data;
    });
};

module.exports = connectDatabase;



