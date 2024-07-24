$(document).ready(function() {
  function populateContainers() {
    $.ajax({
      url: 'items/getContainers',
      type: 'GET',
      success: function(data) {
        const containers = data.containers;
        const itemCategories = data.itemCategories;

        let $containersList = $('.containers-list');
        $containersList.empty();
        
        containers.forEach(function(container) {
          let containerItem = `
          <li class="list-group-item d-flex align-items-center container-item" 
              data-containerId="${container.id}" 
              data-name="${container.name}"
              data-details="${container.details}">
            <span class="arrow">&#9654;</span>
            <div class="containeritemrow justify-content-between align-items-center" style="flex-grow: 1;">
              <div class="spans-container">
                <span class="name editable" data-name="name">${container.name}</span>
                <span class="details editable" data-name="details">${container.details}</span>
              </div>
              <div class="dropdowns-container" style="display:none;">
                <div class="dropdowns" style="display:flex; flex-wrap: wrap;">
                  <div class="category-dropdown">
                    <select id="containerSelect-${container.id}" class="form-select" aria-label="Default select example">
                      <option selected>Default</option>
                      <option>Custom</option>
                      <option>Boss</option>
                      <option>Random Environment</option>                  
                    </select>
                  </div>
                  ${itemCategories.map(category => `
                    <div class="category-dropdown">
                      <label for="categorySelect-${category.id}-${container.id}">${category.name}</label>
                      <select class="form-select category-count" data-category="${category.id}">
                        ${Array.from({length: 10}, (_, i) => `<option value="${i}">${i}</option>`).join('')}
                      </select>
                    </div>
                  `).join('')}
                  <!-- Save Button -->
                  <button class="btn btn-primary save-container saveContainerDetailsButton" data-containerId="${container.id}">Save</button>
                </div>
              </div>
            </div>
          </li>`;

          $containersList.append(containerItem);
        });

        // Arrow click event handler
        $('.containers-list').on('click', '.arrow', function() {
          $(this).toggleClass('expanded');
          $(this).closest('.container-item').find('.dropdowns-container').toggle();
        });

        $('.containers-list').on('click', '.saveContainerDetailsButton', function() {
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

          let $categoryCountElements = $parentListItem.find('.category-count');
          let categoryCounts= {};
          $categoryCountElements.each(function() {
            let categoryId = $(this).data('category');
            let count = $(this).val();
            categoryCounts[categoryId] = count;
          })
          formData['categoryCounts'] = categoryCounts;
      
          // Optionally, add the item's ID to formData if needed
          formData['containerId'] = $parentListItem.data('containerid');

          console.log(formData)
      
          // Send the data to the server
          // $.ajax({
          //   url: 'items/saveItem', // Your endpoint here
          //   type: 'POST',
          //   contentType: 'application/json',
          //   data: JSON.stringify(formData),
          //   success: function(response) {
          //     console.log('Item details saved successfully:', response);
          //     // Update UI or notify user as needed
          //   },
          //   error: function(xhr, status, error) {
          //     console.error('Error saving item details:', error);
          //     // Handle error
          //   }
          // });
        });
      
      },
      error: function(xhr, status, error) {
        console.error("Error fetching containers: ", error);
      }
    });
  }

  populateContainers();
});