const express = require('express');
const bcrypt = require('bcrypt');

const Model = require('../models/user');

const router = express.Router();

const endpoint = 'user';
const {getLoggerUser,

} = require('../helper/user_permission');
//  Post  new User .
router.post(`/${endpoint}`, async (req, res) => {
  const user = await getLoggerUser(req.userId);

  if (!req.isAuth || !user.administrator) {
    return res.status(401).json({ message: 'Unauthenticated!' });
  }
  try {
    const checkUser = await Model.findOne({ email: req.body.email });
    if (!checkUser) {
      const hashedPassword = await bcrypt.hash(req.body.password, 12);
      const data = new Model({
        username:req.body.username,
        email: req.body.email,
        administrator:req.body.administrator,
        password: hashedPassword,
      });

      const dataToSave = await data.save();
      return res.status(200).json({ ...dataToSave._doc, password: null });
    } else {
      return res.status(400).json({ message: 'email is already existe' });
    }
  } catch (error) {
    console.log(req.body)
    return res.status(404).json({ message: error.message });
  }
});

//  Get all available user.
router.get(`/${endpoint}`, async (req, res) => {
  try {
    const user = await getLoggerUser(req.userId);

   if (!req.isAuth || !user.administrator) {
      return res.status(401).json({ message: 'Unauthenticated!' });
    }
    const data = await Model.find();
    let response = [];
    data.forEach((elem) => {
      response.push({ ...elem._doc, password: null });
    });
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ message: error.message });
    return;
  }
});

//  Get user by ID or or NAME
router.get(`/${endpoint}/:id`, async (req, res) => {
  const user = await getLoggerUser(req.userId);
  try {
    if (!req.isAuth) {
      return res.status(401).json({ message: 'Unauthenticated!' });
    } else {
      if (user.id != req.params.id && !user.administrator) {
        return res.status(401).json({ message: 'Unauthenticated!' });
      }
    }
    const name = req.query.name;
    if (name) {
      const data = await Model.findOne({ agency_name: req.params.id });
      return res.status(200).json({ ...data._doc, password: null });
    } else {
      const data = await Model.findById(req.params.id);
      return res.json(data);
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

//  Update by ID Method
router.put(`/${endpoint}/:id`, async (req, res) => {
  try {
    const id = req.params.id;
    const updatedData = req.body;
    const options = { new: true };
    const user = await getLoggerUser(req.userId);

    if (!req.isAuth) {
      return res.status(401).json({ message: 'Unauthenticated!' });
    } else {
      if (user.id != id && !user.administrator) {
        return res.status(401).json({ message: 'Unauthenticated!' });
      }
    }

    if (!user.administrator) {
      delete updatedData['administrator'];
    }
    if (updatedData['password']) {
      const hashedPassword = await bcrypt.hash(updatedData['password'], 12);
      updatedData['password'] = hashedPassword;
    }
    //// disable updating the relationshipp between the table ////
   
    const result = await Model.findByIdAndUpdate(id, updatedData, options);
    return res.status(200).json({ ...result._doc, password: null });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.delete(`/${endpoint}/:id`, async (req, res) => {
    try {
      const user = await getLoggerUser(req.userId);
  
      if (!req.isAuth || !user.administrator) {
        return res.status(401).json({ message: 'Unauthenticated!' });
      }
      const id = req.params.id;
      const data = await Model.findByIdAndDelete(id);
      res.send(` ${data.email} has been deleted..`);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  });
  
  module.exports = router;
  