$(document).ready(function() {
  
  // Open the itemModal when the Add Item button is clicked
  $('#addNewItemButton').click(function() {
    $('#itemModal').modal('show');
  });
  $('#saveItemButton').click(function() {
    $('#itemForm').submit(); // This triggers the form submission
  });

  

  $('#itemForm').submit(function(event) {
    // Prevent the default form submission
    event.preventDefault();
  
    // Collect form data
    let formData = $(this).serializeArray();
    let formDataObject = {};
    formData.forEach(function(item) {
      formDataObject[item.name] = item.value;
    });
    // formDataObject['category_id'] = $('#newItemCategoryDropdown').val();
    console.log(formDataObject)
    
    saveItem(0, formDataObject);
  });

  $('#itemSearch').on('keyup', function(e) {
    const searchTerm = e.target.value.toLowerCase();
  
    $('.list-group-item').each(function(index, item) {
      const itemHTML = $(item).html().toLowerCase();
      if (itemHTML.includes(searchTerm)) {
        $(this).removeClass('hide-item');
      } else {
        $(this).addClass('hide-item');
      }
    });
  });
  
  // Function to make items editable
  function makeEditable() {
    // Delegating from a static parent to .editable elements
    $(document).on('click', '.editable', function() {
      console.log('Editable clicked');
      if (!$(this).is('input')) {
        let currentText = $(this).text();
        let inputField = $('<input>', {
          type: 'text',
          value: currentText,
          class: $(this).attr('class'), // Preserve classes
          blur: blurSave,
          data: { name: $(this).data('name') },
          keypress: function(e) {
            if (e.which === 13) { // Enter key pressed
              $(this).blur();
            }
          }
        });
        $(this).replaceWith(inputField);
        inputField.focus();
      }
    });
  }

  function blurSave() {

    let updatedValue = $(this).val();
    let itemId = $(this).closest('li').data('itemid');
    let fieldName = $(this).data('name');


    $(this).closest('li').data(fieldName, updatedValue);

    let $span = $('<span>', {
      'text': updatedValue,
      'class': $(this).attr('class'),
      'data-name': $(this).data('name')
    });
    $(this).replaceWith($span);

    let itemData = $('li[data-itemid="'+itemId+'"]').data() || {};

    saveItem(itemId, itemData);
  }

  function saveItem(itemId, itemData){


    if (itemData.hasOwnProperty('itemid')) {
      delete itemData.itemid;
    }

    $.ajax({
      url: 'items/saveItem',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({
        id: itemId,
        ...itemData
      }),
      success: function(response) {
        console.log('Item updated successfully:', response);
        // Optionally, you can add code here to update the UI based on the response
        $('#itemModal').modal('hide');
        populateItems();
      },
      error: function(xhr, status, error) {
        console.error('Error updating item:', error);
        $('#itemModal').modal('hide');
        populateItems();
        // Optionally, handle errors, such as reverting the change in the UI or displaying an error message
      }
    });
  }

  // Function to populate items list with a click event for the arrow
  function populateItems() {
    $.ajax({
      url: 'items/getItems', // Update this URL to where your items can be fetched
      type: 'GET',
      success: function(data) {
        let itemsHtml = '';
        const items = data.items;
        const categories = data.categories;

        // console.log(categories)
        items.forEach(item => {
          let itemcategory = categories.find(category => category.id === item.category_id);

          // console.log(itemcategory)
          let detailsArray = itemcategory.details ? itemcategory.details.split(',') : [];
          // console.log(detailsArray)
          let detailInputs = `
                    <div class="form-group">
                      <label>Rarity</label>
                      <input type="text" class="form-control saveableItem" value="${item.rarity}" data-name="rarity">
                    </div>
                    <div class="form-group">
                      <label>Value</label>
                      <input type="text" class="form-control saveableItem" value="${item.value}" data-name="value">
                    </div>
                    <div class="form-group">
                      <label>Weight</label>
                      <input type="text" class="form-control saveableItem" value="${item.weight}" data-name="weight">
                    </div>`;
          detailsArray.forEach(detail => {
            detailInputs += `
              <div class="form-group">
                <label>${detail}</label>
                <input type="text" class="form-control saveableItem" value="${item[detail]}" data-name="${detail}">
              </div>
            `;
          });
          // $detailsContainer.html(detailInputs);
          itemsHtml += `
            <li class="list-group-item d-flex align-items-start item" 
              data-itemId="${item.id}"
              data-name="${item.name}"
              data-details="${item.details}"
              data-category_id="${item.category_id}">
              <div class="spans-container">
                <span class="name editable" data-name="name">${item.name}</span>
                <span class="details editable" data-name="details">${item.details}</span>
              </div>
              <span class="arrow">&#9654;</span>
              <i class="${itemcategory.icon} item-icon" aria-hidden="true"></i>
              <div class="containeritemrow justify-content-between align-items-center" style="flex-grow: 1;">
                <div class="details-container" style="display:none;">
                  <div class="detailInputs rightInputs" style="">
                    ` + detailInputs + `
                  </div>
                  <div class="detailInputs leftInputs" style="">
                    <button class="button topright saveItem saveItemDetailsButton">Save</button>
                  </div>
                </div>
              </div>
            </li>`;
        });
        $('.items-list').html(itemsHtml);

        // Call makeEditable after items are populated
        makeEditable();

                
        $('.items-list').on('click', '.saveItemDetailsButton', function() {
          // Find the closest parent list item (<li>)
          let $parentListItem = $(this).closest('li');
      
          // Find all elements with class 'saveableItem' within this list item
          let $saveableItems = $parentListItem.find('.saveableItem');
          // Collect all form data within this item
          let formData = {};
          $saveableItems.each(function() {
            
            let name = $(this).data('name');
            let value = $(this).val();
            formData[name] = value;
          });
      
          // Optionally, add the item's ID to formData if needed
          formData['itemId'] = $parentListItem.data('itemid');

          console.log(formData)
      
          // Send the data to the server
          $.ajax({
            url: 'items/saveItem', // Your endpoint here
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(formData),
            success: function(response) {
              console.log('Item details saved successfully:', response);
              // Update UI or notify user as needed
            },
            error: function(xhr, status, error) {
              console.error('Error saving item details:', error);
              // Handle error
            }
          });
        });

      },
      error: function(xhr, status, error) {
        console.error("Error fetching items: ", error);
      }
    });
  }

  // Toggle details container visibility and fetch category-specific attributes
  $('.items-list').on('click', '.arrow', function() {
    let $detailsContainer = $(this).siblings('.containeritemrow').find('.details-container');
    let $item = $(this).closest('.item');
    let itemId = $item.data('itemid');

    $(this).toggleClass('rotate'); // Add this line to toggle the rotate class

    $detailsContainer.toggle();
  });

  populateItems();
});


function filterItems(selectedCategory) {
  const items = document.querySelectorAll('.items-list .list-group-item');
  items.forEach(item => {
    // Assuming each item has a data-category attribute
    const category_id = item.getAttribute('data-category');
    // console.log(item.getAttributeNames, item.getAttribute('data-category'))
    if (selectedCategory === 'All' || category_id === selectedCategory) {
      $(item).removeClass('hide-item');
    } else {
      $(item).addClass('hide-item');
    }
  });
}
