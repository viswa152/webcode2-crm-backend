const express = require("express");
const mongoose = require("mongoose");
const bycrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Auth = require("./Models/Auth");
const mailFunction = require("./Mailer/mailer");
const cors = require("cors");
const Customers = require("./Models/Customers");
const Products = require("./Models/Products");
const Imgs = require("./Models/Imgs");
require("dotenv").config();

const app = express();
mongoose.connect(process.env.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});
app.use(cors());

//Middleware
app.use(express.json());

//Authantication

app.post("/signin", async function (req, res) {
  try {
    let salt = await bycrypt.genSalt(10);
    let hash = await bycrypt.hash(req.body.Password, salt);
    req.body.Password = hash;
    let data = await Auth.create(req.body);
    if (data) {
      res.status(200).json({ message: "SignIn Successfull " });
    } else {
      res.status(500).json({ message: "Somthing went Wrong" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "SignIn Not Successfull" });
  }
});
app.post("/login", async function (req, res) {
  try {
    let user = await Auth.findOne({ Email: req.body.Email });
    if (user) {
      let compare = await bycrypt.compare(req.body.Password, user.Password);
      if (compare) {
        let createdToken = jwt.sign({ _id: user._id }, process.env.SECRET, {
          expiresIn: "30m",
        });
        res.json({ createdToken });
        res.json(user);
        res.json({ message: "Login Successfull" });
      } else {
        res.status(401).json({ message: "Username / Password is Wrong" });
      }
    } else {
      res.status(401).json({ message: "User not found" });
    }
  } catch (error) {}
});

app.post("/forgot", async function (req, res) {
  try {
    let user = await Auth.findOne({ Email: req.body.Email });
    if (user) {
      if (user.Email == req.body.Email) {
        let resetToken = jwt.sign({ _id: user._id }, process.env.SECRET, {
          expiresIn: "10m",
        });
        user.updateOne({ resetToken: resetToken }, function (err, success) {
          if (err) {
            console.log(err);
          } else {
            res.status(200).json({ message: "restLink Updated" });
          }
        });
        const maildetails = {
          usermail: user.Email,
          mailsubject: "Password reset link from fluentCRM",
          mailcontent: `Click the link below to reset you password -- 
                    ${process.env.CLINT_URL}/${resetToken}/${user._id}`,
        };
        const mailresponse = await mailFunction(maildetails);
      }
    } else {
      res.status(404).json({ message: "Usern not available" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "somthing went wrong" });
  }
});
app.put("/:token/:userid", async function (req, res) {
  try {
    let data = await Auth.findOne({ _id: req.params.userid });
    if (data) {
      let verifyToken = jwt.verify(req.params.token, process.env.SECRET);
      if (verifyToken) {
        try {
          let salt = await bycrypt.genSalt(10);
          let hash = await bycrypt.hash(req.body.Password, salt);
          req.body.Password = hash;
          await Auth.findByIdAndUpdate(data._id, {
            $set: { Password: req.body.Password, resetToken: "" },
          });
          res.status(200).json({ message: "Password reset successfully" });

          const maildetails = {
            usermail: data.Email,
            mailsubject: "Password reset fluentCRM",
            mailcontent: `Your password has been reseted Successfully`,
          };
          const mailresponse = await mailFunction(maildetails);
        } catch (error) {
          console.log(error);
          res.status(500).json({ message: "sothing wrong in reset password" });
        }
      } else {
        res.status(404).json({ message: "link expired" });
      }
    } else {
      res.status(500).json({ message: "somthing went wrong" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "somthing went wrong" });
  }
});

app.get("/auth", async function (req, res) {
  try {
    let data = await Auth.find();
    res.json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "somthing went wrong" });
  }
});
app.get("/auth/:Email", async function (req, res) {
  try {
    let data = await Auth.find({ Email: req.params.Email });
    if (!data) {
      res.status(404).json({ message: "User not Available" });
    } else {
      res.json(data);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "somthing went wrong" });
  }
});
app.post("/product", async function (req, res) {
  try {
    let data = await Auth.create(req.body);
    if (data) {
      res.status(200).json({ message: "Product Added" });
    }
  } catch (error) {
    res.status(500).json({ message: "somthing went wrong" });
  }
});
app.get("/product", async function (req, res) {
  try {
    let data = await Auth.find();
    res.json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "somthing went wrong" });
  }
});
app.post("/message", async function (res, res) {
  try {
    let data = await Auth.create(req.body);
    if (data) {
      res.status(200).json({ message: "Product Added" });
    }
  } catch (error) {
    res.status(500).json({ message: "somthing went wrong" });
  }
});
app.get("/message", async function (req, res) {
  try {
    let data = await Auth.find();
    res.json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "somthing went wrong" });
  }
});
app.post("/employee", async function (req, res) {
  try {
    let salt = await bycrypt.genSalt(10);
    let hash = await bycrypt.hash(req.body.Password, salt);
    req.body.Password = hash;
    let data = await Auth.create(req.body);
    if (data) {
      res.status(200).json({ message: "Employee created" });
    } else {
      res.status(500).json({ message: "Somthing went Wrong" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Somthing went Wrong" });
  }
});
app.get("/employee", async function (req, res) {
  try {
    let data = await Auth.find({ Type: "Employee" });
    res.json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "somthing went wrong" });
  }
});
app.delete("/employee/:id", async function (req, res) {
  try {
    let data = await Auth.deleteOne({ _id: req.params.id });
    res.json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "somthing went wrong" });
  }
});

app.post("/customers", async function (req, res) {
  try {
    let data = await Customers.create(req.body);
    if (data) {
      res.status(200).json({ message: "Employee Added" });
    }
  } catch (error) {
    res.status(500).json({ message: "somthing went wrong" });
  }
});
app.post("/customers/:id", async function (req, res) {
  try {
    let data = await Customers.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { Status: req.body.Status } }
    );
    if (data) {
      res.status(200).json({ message: "Employee Added" });
    }
  } catch (error) {
    res.status(500).json({ message: "somthing went wrong" });
  }
});
app.get("/customers", async function (req, res) {
  try {
    let data = await Customers.find();
    res.json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "somthing went wrong" });
  }
});
app.get("/customers/:_id", async function (req, res) {
  try {
    let data = await Customers.findOne({ _id: req.params._id });
    if (!data) {
      res.status(404).json({ message: "User not Available" });
    } else {
      res.json(data);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "somthing went wrong" });
  }
});

app.post("/products", async function (req, res) {
  try {
    let data = await Products.create(req.body);
    if (data) {
      res.status(200).json({ message: "products created" });
    } else {
      res.status(500).json({ message: "Somthing went Wrong" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Somthing went Wrong" });
  }
});
app.get("/products", async function (req, res) {
  try {
    let data = await Products.find();
    res.json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "somthing went wrong" });
  }
});
app.delete("/products/:id", async function (req, res) {
  try {
    let data = await Products.deleteOne({ _id: req.params.id });
    res.json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "somthing went wrong" });
  }
});
app.get("/imgs", async function (req, res) {
  try {
    let data = await Imgs.find();
    res.json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "somthing went wrong" });
  }
});
app.post("/imgs", async function (req, res) {
  try {
    let data = await Imgs.create(req.body);
    res.json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "somthing went wrong" });
  }
});
app.listen(process.env.PORT || 5000);