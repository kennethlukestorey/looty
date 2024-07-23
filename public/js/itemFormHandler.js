$(document).ready(function() {
  
  // Open the itemModal when the Add Item button is clicked
  $('#addNewItemButton').click(function() {
    $('#itemModal').modal('show');
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
    // console.log(formDataObject)
    
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
    $('.items-list').on('click', '.editable', function() {
      if ($(this).is('input')) {
        return;
      }

      let $this = $(this);
      let currentText = $this.text();
      let inputField = $('<input>', {
        'type': 'text',
        'value': currentText,
        'class': $this.attr('class'), // Preserve the class=
        'blur': blurSave,
        'data-name': $this.data('name'),
        'keypress': function(e) {
          if (e.which === 13) { // Enter key
            $(this).blur();
          }
        }
      });
      $this.replaceWith(inputField);
      inputField.focus();
    });
  }

  function blurSave() {

    console.log(this)
    let updatedValue = $(this).val();
    let itemId = $(this).closest('li').data('itemid');
    let fieldName = $(this).data('name');

    console.log($(this).data())

    $(this).closest('li').data(fieldName, updatedValue);

    let $span = $('<span>', {
      'text': updatedValue,
      'class': $(this).attr('class'),
      'data-name': $(this).data('name')
    });
    $(this).replaceWith($span);

    let itemData = $('li[data-itemid="'+itemId+'"]').data() || {};

    // console.log(itemData)

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

  // Function to populate items list
  function populateItems() {
    $.ajax({
      url: 'items/getItems', // Update this URL to where your items can be fetched
      type: 'GET',
      success: function(items) {
        let $itemsList = $('.items-list');
        $itemsList.empty(); // Ensure the list is empty before adding items
        
        items.forEach(function(item) {
          let $li = $('<li>', {
            'class': 'list-group-item d-flex justify-content-between align-items-center',
            'data-itemId': item.id,
            'data-name': item.name,
            'data-details': item.details
          });
          let $nameSpan = $('<span>', {
            'class': 'name editable',
            'data-name': 'name',
            'text': item.name
          });
          let $detailsSpan = $('<span>', {
            'class': 'details editable',
            'data-name': 'details',
            'text': item.details
          });
          
          // Append the name and details span, and edit/delete buttons to the list item
          $li.append($nameSpan).append($detailsSpan);
          $itemsList.append($li);
        });

        // Call makeEditable after items are populated
        makeEditable();
      },
      error: function(xhr, status, error) {
        console.error("Error fetching items: ", error);
      }
    });
  }

  populateItems();
});