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
    .connect('DB URL', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((data) => {
      console.log(`mongod connected with server: ${data.connection.host}`);
      return data;
    });
};

module.exports = connectDatabase;



