// controllers/example.controller.js
const pantryService = require('../service/Service');

// Controller actions
exports.getPantryList = async (req, res) => {
  try {
    console.log("hett")
    const examples = await pantryService.getPantryList();
    console.log(examples)
    res.status(200).json(examples);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createPantryItems = async (req, res) => {
    try {
        console.log("req"  ,req)
        console.log("getPantryList controller started");
      const newExample = await pantryService.createPantryItems(req.body);
      res.status(201).json(newExample);
      console.log("getPantryList controller finished");

    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };