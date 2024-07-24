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
            <div class="containeritemrow justify-content-between align-items-center">
              <div class="spans-container">
                <span class="name editable" data-name="name">${container.name}</span>
                <span class="details editable" data-name="details">${container.details}</span>
              </div>
              <div class="dropdowns-container" style="display:none; background-color:#f0f0f0"> <!-- Flex container -->
                <div class="dropdowns" style="display:flex; flex-wrap: wrap;"> <!-- Flexbox styling -->
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
                      <select id="categorySelect-${category.id}-${container.id}" class="form-select">
                        ${Array.from({length: 10}, (_, i) => `<option value="${i+1}">${i+1}</option>`).join('')}
                      </select>
                    </div>
                  `).join('')}
                </div>
              </div>
            </div>
          </li>`;

          $containersList.append(containerItem);
        });
        $('.containers-list').on('click', '.spans-container', function() {
          $(this).closest('.containeritemrow').find('.dropdowns-container').toggle();
        });
      },
      error: function(xhr, status, error) {
        console.error("Error fetching containers: ", error);
      }
    });
  }

  populateContainers();
});