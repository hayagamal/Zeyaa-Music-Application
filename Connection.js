const mongoose = require('mongoose');

module.exports = async () => {
  const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true
  };
  try {
    await mongoose.connect("mongodb+srv://habiba:1234@cluster0.l4qtr.mongodb.net/cluster0?retryWrites=true&w=majority", connectionParams);
    console.log("connected to database successfully")
  } catch (error) {
    console.log("Could not connect to database !", error)
  }
}
//module.exports = connectDB;
