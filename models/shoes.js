const mongoose = require("mongoose");

const shoesSchema =new mongoose.Schema({
  name: {
    type: String,
  },
  brand: {
    type: String,
  },
  category: {
    type: String,
  },
  rating:{
    type: Number,
  },
  discription:{
    type: String,
  },
  size:{
    type: [{ size: Number, isAvailable: Boolean }],
  },
  image:{
    type: String,
  }
});

const Shoes = new mongoose.model("Shoes", shoesSchema);
module.exports = Shoes;
