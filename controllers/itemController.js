// controllers/itemController.js
const Item = require('../models/Item');


exports.itemsPage = async (req, res) => {
  res.render('items');
};

exports.getItems = async (req, res) => {
  try {
    const items = await Item.findAll();
    res.json(items);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).send('Error fetching items');
  }
};

exports.displayAddItemForm = (req, res) => {
    res.render('addItem'); // Assuming you have a Pug template named addItem.pug
};
  
exports.addItem = async (req, res) => {
  const { name, details } = req.body; // Extracting item details from the request body

  try {
      // Using the Item model to create a new item in the database
      await Item.create({
          name,
          details
      });

      // If the operation is successful, redirect to the items list or send a success message
      res.redirect('/items'); // Assuming '/items' is the route to display the items list
      // Alternatively, you can send a success message
      // res.send('Item added successfully');
  } catch (error) {
      // Log the error and send an error response
      console.error('Error adding item:', error);
      res.status(500).send('Error adding item');
  }
};
  
exports.displayEditItemForm = async (req, res) => {
  const { itemId } = req.params;
  try {
    // Fetch item details from database using itemId
    const itemDetails = await Item.findById(itemId);
    res.render('editItem', { itemDetails }); // Pass item details to Pug template
  } catch (error) {
    console.error('Error fetching item details:', error);
    res.status(500).send('Error fetching item details');
  }
};

exports.saveItem = async (req, res) => {
  const { id, name, details } = req.body; // Extract updated details from request body

  try {
      // Check if id is 0, indicating a request to create a new item
      if (id == '0') {
          // Use the Item model to create a new item
          await Item.create({
              name,
              details
          });
      } else {
          // Use the Item model to find and update the item by its ID
          await Item.findByIdAndUpdate(id, {
              name,
              details
          });
      }

      // If the operation is successful, redirect to the items list or send a success message
      // res.redirect('/items'); // Assuming '/items' is the route to display the items list
      // Alternatively, you can send a success message
      res.send(id === '0' ? 'Item added successfully' : 'Item updated successfully');
  } catch (error) {
      // Log the error and send an error response
      console.error('Error processing item:', error);
      res.status(500).send('Error processing item');
  }
};