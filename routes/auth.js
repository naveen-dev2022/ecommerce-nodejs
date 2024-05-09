const express = require("express");
const bcryptjs = require("bcryptjs");
const User = require("../models/user");
const Shoes = require("../models/shoes");
const authRouter = express.Router();
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");

// Sign Up
authRouter.post("/api/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ msg: "User with same email already exists!" });
    }

    const hashedPassword = await bcryptjs.hash(password, 8);

    let user = new User({
      email,
      password: hashedPassword,
      name,
    });
    user = await user.save();
    res.json(user);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});


// Sign In
authRouter.post("/api/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ msg: "User with this email does not exist!" });
    }

    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Incorrect password." });
    }

    const token = jwt.sign({ id: user._id }, "passwordKey", { expiresIn: '5m' });

    res.json({ token, ...user._doc });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// get user data
authRouter.get("/", auth, async (req, res) => {

  const user = await User.findById(req.user);
  res.json({ ...user._doc, token: req.token });

});

// fetch post

authRouter.get("/api/shoes",async (req, shoeRes) => {

  try {

    // let shoe =  ShoesModelData({
    //   name:res.name,
    //   brand:res.brand,
    //   category:res.category,
    //   rating:res.rating,
    //   discription:res.discription,
    //   size:res.size,
    //   image:res.image,
    // });

    // res.json(shoe._doc);

    console.log(`step 1`);

     await Shoes.find().then((res)=>{
      shoeRes.json(res);
    });

   // console.log(`step 2 ${user._doc}`);

 // const user = await Shoes.find();

  } catch (e) {
    res.status(500).json({ error: e.message });
  }

});

// app.post('/api/shoes', upload.single('image'), (req, res, next) => { 
  
//   const data = {
//    image: req.file.path
//   }
  
//   cloudinary.uploader.upload(data.image)
//   .then((result)=>{
//    const image = new imgModel({
//           img: result.url
//       });
//       const response = image.save();
//    res.status(200).send({
//     message: "success",
//     result
//    });
//   }).catch((error) => {
//    res.status(500).send({
//     message: "failure",
//     error
//    });
//   });
// });

// authRouter.post("/api/shoes", (req, res) => {
//   upload(req,res, (err) => {
//     if (err) {
//      return res.status(500).json({ error: err.message });
//     }
//     else {
//       const newShoesData = new ShoesModelData(
//         {
//           name: req.body.name,
//           brand: req.body.brand,
//           category: req.body.category,
//           imageURL: {
//             data: req.file.filename,
//             contentType: 'image/png'
//           }
//         }
//       );

//       newShoesData.save().then(()=>  res.send("Successfully uploaded")).catch((err)=>{
//         res.status(400).json({ error: err.message });
//       });

//     }
//   })
// });

module.exports = authRouter;
