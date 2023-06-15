const express = require('express');
const cron = require('node-cron');

const router = express.Router();

const axios = require("axios");
const {getLoggerUser,

} = require('../helper/user_permission');
const Accident = require('../models/accidentModel');



async function updateEntity(req, res) {
  try {
    const accidents = await Accident.find({});
  

    console.log("ACCIDENT::::::",accidents[0])

  const fAcc =  await Accident.findOneAndUpdate(
      { _id: accidents[0]._id },
      {
        nbr_jours_sans_accident:accidents[0].nbr_jours_sans_accident +1,
      },
      { upsert: true, new: true }
    );
    console.log('Entity updated!');

  } catch (error) {
    //res.status(500).json({ message: error.message });
    console.log("ERROR:",error);
    }

}

cron.schedule('0 0 * * *', () => {
  updateEntity();
});

router.get("/accidents", async (req, res) => {
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
  
  router.get("/accidents/:id", async (req, res) => {
    const user = await getLoggerUser(req.userId);

    if (!req.isAuth ) {
      return res.status(401).json({ message: 'Unauthenticated!' });
    }
    try {
      const { id } = req.params;
      const accident = await Accident.findById(id);
      res.status(200).json(accident);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  router.post("/accidents", async (req, res) => {
    const user = await getLoggerUser(req.userId);

    if (!req.isAuth || !user.administrator) {
      return res.status(401).json({ message: 'Unauthenticated!' });
    }
    try {
      const accident = await Accident.create(req.body);
      res.status(200).json(accident);
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ message: error.message });
    }
  });
  
  // update a accident
  router.put("/accidents/:id", async (req, res) => {
    const user = await getLoggerUser(req.userId);

    if (!req.isAuth ) {
      return res.status(401).json({ message: 'Unauthenticated!' });
    }
    try {
      const { id } = req.params;
      console.log("ACCIDENT PUT:",req.body);
      const accident = await Accident.findByIdAndUpdate(id, req.body);
      // we cannot find any accident in database
      if (!accident) {
        return res
          .status(404)
          .json({ message: `cannot find any accident with ID ${id}` });
      }
      const updatedAccident = await Accident.findById(id);
      res.status(200).json(updatedAccident);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  
  
  router.delete("/accidents/:id", async (req, res) => {
    const user = await getLoggerUser(req.userId);

    if (!req.isAuth || !user.administrator) {
      return res.status(401).json({ message: 'Unauthenticated!' });
    }
    try {
      const { id } = req.params;
      const accident = await Accident.findByIdAndDelete(id);
      if (!accident) {
        return res
          .status(404)
          .json({ message: `cannot find any accident with ID ${id}` });
      }
      res.status(200).json(accident);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  module.exports = router;
