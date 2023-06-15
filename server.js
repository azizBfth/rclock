const express = require("express");
const mongoose = require("mongoose");
const Accident = require("./models/accidentModel");
const app = express();
const axios = require("axios");
const User = require("./models/user");
const userRoutes = require("./routes/users");
const accidentRoutes = require("./routes/accidents");

const sessionRoutes = require("./routes/session");
const isAuth = require(".//middlewares/is-auth");
const path = require("path");

const cookieParser = require("cookie-parser");

const cors = require("cors");


app.use(cookieParser());

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(isAuth);




app.use(express.static(path.join(__dirname, "build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});



app.get("/api/weather", async (req, res) => {
  try {
    const response = await axios.get(
      "http://api.open-meteo.com/v1/forecast?latitude=34.3260314&longitude=8.384242&current_weather=true"
    );
    res.send(response.data);
    console.log(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send(`Server Error ${error}`);
  }
});

app.get("/accidents", async (req, res) => {
  try {
    const accidents = await Accident.find({});
    const response = await axios.get(
      "http://api.open-meteo.com/v1/forecast?latitude=34.3260314&longitude=8.384242&current_weather=true"
    );
    const weatherData = await response.data
   // console.log(response);

  const fAcc =  await Accident.findOneAndUpdate(
      { _id: accidents[0]._id },
      {
        temperature:Math.round(weatherData.current_weather.temperature),
      },
      { upsert: true, new: true }
    );

    res.status(200).json(fAcc);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});




// mongoose cloud
// mongodb+srv://emkatech:EE06BC23F2@devgafsaapi.mkcickp.mongodb.net/api?retryWrites=true&w=majority'
mongoose.set("strictQuery", false);
mongoose
  .connect("mongodb://mongo:27017/accidentsdb", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connected to MongoDB");
    app.listen(80, () => {
      console.log(`Node API app is running on port 80`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
