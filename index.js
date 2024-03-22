const express = require("express");
const mongodb = require("mongodb");
const mongoose = require("mongoose");

const routes = require("./routes/routes");
const cors = require("cors");

const cookieParse = require("cookie-parser");

const app = express();

app.use(
  cors({
    credentials: true,
    origin: ["https://shopcart-izsid2de7-arunsinghpundirs-projects.vercel.app"],
  })
);

app.use(cookieParse());

app.use(express.json());
app.use("/api", routes);
const url = 'mongodb://root:root@ac-hwlrx0j-shard-00-00.xmofpjb.mongodb.net:27017,ac-hwlrx0j-shard-00-01.xmofpjb.mongodb.net:27017,ac-hwlrx0j-shard-00-02.xmofpjb.mongodb.net:27017/?ssl=true&replicaSet=atlas-xjtc2b-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0/cartapp'
const localurl = 'mongodb://localhost:27017'
mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connected to db");
    app.listen(5000, () => {
      console.log("app is active");
    });
  });


  // "mongodb://arunsinghpundir325:mTjlBItRD7WD6JL7@cluster-cartapp-shard-00-00.nbp7d.mongodb.net:27017,cluster-cartapp-shard-00-01.nbp7d.mongodb.net:27017,cluster-cartapp-shard-00-02.nbp7d.mongodb.net:27017/cartapp?ssl=true&replicaSet=atlas-11wic9-shard-0&authSource=admin&retryWrites=true&w=majority

  