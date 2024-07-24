// controllers/itemController.js
const Item = require('../models/Item');
const Container = require('../models/Container');


exports.itemsPage = async (req, res) => {
  // Fetch categories from the database
  const categories = await Item.getItemCategories();
  
  // Render the containers.pug view, passing in the categories
  const data= {};
  data.categories = categories;
  res.render('items/home', { data });
};

exports.getItems = async (req, res) => {
  try {
    const items = await Item.findAll();
    const categories = await Item.getItemCategories();
    const data = {};
    data.items = items;
    data.categories = categories;
    res.json(data);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).send('Error fetching items');
  }
};


exports.getItemDetails = async (req, res) => {
  const { itemId } = req.params;
  try {
    const item = await Item.getItemDetails(itemId);
    const data = {};
    data.item = item;
    res.json(data);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).send('Error fetching item details');
  }
};

exports.getItemCategories = async (req, res) => {
  try {
    const items = await Item.getItemCategories();
    res.json(items);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).send('Error fetching items');
  }
};

exports.getContainers = async (req, res) => {
  try {
    const containers = await Container.findAll();
    const itemCategories = await Item.getItemCategories();
    const data = {};
    data.containers = containers;
    data.itemCategories = itemCategories;
    res.json(data);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).send('Error fetching items');
  }
}

exports.displayAddItemForm = (req, res) => {
    res.render('addItem'); // Assuming you have a Pug template named addItem.pug
};
  
exports.addItem = async (req, res) => {
  const { name, details, category_id } = req.body; // Extracting item details from the request body

  try {
      // Using the Item model to create a new item in the database
      await Item.create({
          name,
          details,
          category_id
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

  const { itemId, ...updateData } = req.body; // Extract the item ID from the request body and remove it from updateData=

  console.log(itemId, updateData)
  try {
      // Check if id is 0, indicating a request to create a new item
      if (itemId == '0') {
          // Use the Item model to create a new item
          let name=updateData.name;
          let details=updateData.details;
          let category_id=updateData.category_id;
          await Item.create({
              name,
              details,
              category_id
          });
      } else {
          // Use the Item model to find and update the item by its ID
          await Item.findByIdAndUpdate(itemId, updateData);
      }

      // If the operation is successful, redirect to the items list or send a success message
      // res.redirect('/items'); // Assuming '/items' is the route to display the items list
      // Alternatively, you can send a success message
      res.send(itemId === '0' ? 'Item added successfully' : 'Item updated successfully');
  } catch (error) {
      // Log the error and send an error response
      console.error('Error processing item:', error);
      res.status(500).send('Error processing item');
  }



};


exports.addContainer = async (req, res) => {
  const { name, details } = req.body; // Extracting container details from the request body

  try {
      // Using the Container model to create a new container in the database
      await Container.create({
          name,
          details
      });

      // If the operation is successful, redirect to the containers list or send a success message
      res.redirect('/containers'); // Assuming '/containers' is the route to display the containers list
      // Alternatively, you can send a success message
      // res.send('Container added successfully');
  } catch (error) {
      // Log the error and send an error response
      console.error('Error adding container:', error);
      res.status(500).send('Error adding container');
  }
}

exports.saveContainer = async (req, res) => {
  
    const { containerId, ...updateData } = req.body; // Extract the container ID from the request body and remove it from updateData
  
    try {
        // Check if id is 0, indicating a request to create a new container
        if (containerId == '0') {
            // Use the Container model to create a new container
            let name=updateData.name;
            let details=updateData.details;
            await Container.create({
                name,
                details
            });
        } else {
            // Use the Container model to find and update the container by its ID
            await Container.findByIdAndUpdate(containerId, updateData);
        }
  
        // If the operation is successful, redirect to the containers list or send a success message
        // res.redirect('/containers'); // Assuming '/containers' is the route to display the containers list
        // Alternatively, you can send a success message
        res.send(containerId === '0' ? 'Container added successfully' : 'Container updated successfully');
    } catch (error) {
        // Log the error and send an error response
        console.error('Error processing container:', error);
        res.status(500).send('Error processing container');
    }
  }