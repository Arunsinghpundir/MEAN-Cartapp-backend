const { Router } = require("express");

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Product = require("../models/products");

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

// router.post("/login", async (req, res) => {
//   const user = await User.findOne({ email: req.body.email });
//   if (!user) {
//     return res.status(404).send({
//       message: "User not found",
//     });
//   }

//   if (!(await bcrypt.compare(req.body.password, user.password))) {
//     return res.status(400).send({
//       message: "Password is incorrect",
//     });
//   }

//   const token = jwt.sign({ _id: user._id }, "secret");

//   res.cookie("jwt", token, {
//     httpOnly: true,
//     maxAge: 60 * 60 * 1000, 
//   });
//   res.send({
//     user: user,
//     token: token,
//   })
 
// });
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).send({
        message: "User not found",
      });
    }

    const passwordMatch = await bcrypt.compare(req.body.password, user.password);
    if (!passwordMatch) {
      return res.status(400).send({
        message: "Password is incorrect",
      });
    }

    const token = jwt.sign({ _id: user._id }, "secret", { expiresIn: '1h' });

    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: 60 * 60 * 1000, 
      secure: true, // Set this if your app runs on HTTPS
      sameSite: 'lax' // Set this to mitigate CSRF attacks
    });
    res.json({
      userId: user._id,
      email: user.email,
      // You can include other necessary user data here
      token: token,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// router.get("/user", async (req, res) => {
//   try {
//     const token = req.cookies.jwt;
//     const decoded = jwt.verify(token, "secret");
//     console.log("decoded", decoded);
   
//     console.log("here", "129 line pr");

//     const { _id } = decoded;
//     console.log("here", "132 line pr");
//     const user = await User.findById(_id);
//     console.log("here", "134 line pr" ,user);
//     const {password,...data}=  user.toJSON();
//     res.json({
//       user: data,
//     });
//   } catch (err) {
//     return res.status(401).json({
//       message: "Master err - Unauthorized" + err
//     })
//   }
// });
router.post("/user", async (req, res) => {
  try {
    const token = req.cookies.jwt;
    const decoded = jwt.verify(token, "secret");
  
    const { _id } = decoded;
    const user = await User.findById(_id);
    const {password,...data}=  user.toJSON();
    res.json({
      user: data,
    });
  } catch (err) {
    return res.status(401).json({
      message: "Master err - Unauthorized" + err
    })
  }
});

router.post("/logout", (req, res) => {
  res.cookie("jwt", "", { maxAge: 0 });

  res.send({
    message: "success",
  });
});


router.get("/products", async (req, res) => {
  try {
    // Verify JWT token
    const token = req.cookies.jwt;
    const decoded = jwt.verify(token, "secret");
    if (!decoded) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }
    
    // Fetch all products from the database
    const products = await Product.find();
    
    // Return the products
    res.send(products);
  } catch (err) {
    // Handle errors
    console.error(err);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
});
module.exports = router;