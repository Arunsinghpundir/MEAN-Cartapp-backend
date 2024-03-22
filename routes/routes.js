const { Router } = require("express");

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");
const User = require("../models/user");

const router = Router();

// router.post("/register", async (req, res) => {
//   let email = req.body.email;
//   let password = req.body.password;
//   let name = req.body.name;
//   const salt = await bcrypt.genSalt(10);
//   const hashpassword = await bcrypt.hash(password, salt);

//   const record = await User.findOne({ email: email });
//   if (record) {
//     return res.status(400).json({
//       message: "Email already exists",
//     });
//   } else {
//     const user = new User({
//       email: email,
//       password: hashpassword,
//       name: name,
//     });
//   }
//   const user = new User({
//     email: email,
//     password: hashpassword,
//     name: name,
//   });

//   const result = await user.save();

//   //jwt token
//   const { _id } = await result.toJSON();
//   const token = jwt.sign({ _id: _id }, "secret");

//   res.cookie("jwt", token, {
//     httpOnly: true,
//     maxAge: 24 * 60 * 60 * 1000,
//   });


//   res.json({
//     message: "Success"
//   });

  
//   res.json({
//     user: result,
//   });
// });
router.post("/register", async (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  let name = req.body.name;
  const salt = await bcrypt.genSalt(10);
  const hashpassword = await bcrypt.hash(password, salt);

  const record = await User.findOne({ email: email });
  if (record) {
    return res.status(400).json({
      message: "Email already exists",
    });
  } else {
    const user = new User({
      email: email,
      password: hashpassword,
      name: name,
    });
    
    const result = await user.save();

    //jwt token
    const { _id } = await result.toJSON();
    const token = jwt.sign({ _id: _id }, "secret");

    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.json({
      message: "Success",
      user: result,
    });
  }
});

router.post("/login", async (req, res) => {
  res.json("login user");
});

router.get("/user", async (req, res) => {
  try{
    const token = req.cookies.jwt;
    const decoded = jwt.verify(token, "secret");
    console.log("decoded", decoded);
    if(!decoded){
      return res.status(401).json({
        message: "decoded not found - Unauthorized"
      })
    }
    const { _id } = decoded;
    const user = await User.findById(_id);
    console.log("user", user)
    const {password,...data}= await user.toJSON();
    res.json({
      user: data,
    });
  } catch(err){
    return res.status(401).json({
      message: "master err - Unauthorized" + err;
    })
  }
});

module.exports = router;
