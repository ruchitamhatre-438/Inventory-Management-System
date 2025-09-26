require('dotenv').config();
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  password: String
});
const User = mongoose.model('User', userSchema);

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  const newUser = new User({ username: "Ruchita", password: "1234" });
  await newUser.save();
  console.log("User created");
  mongoose.disconnect();
}).catch(console.error);
