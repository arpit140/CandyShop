document.addEventListener('DOMContentLoaded', () => {
    
    displayItemsFromStorage();
});


let items = getStoredItems(); 

function getStoredItems() {
    
    const storedItems = localStorage.getItem('items');
    return storedItems ? JSON.parse(storedItems) : [];
}

function saveItemsToStorage() {
  
    localStorage.setItem('items', JSON.stringify(items));
}

function addItem() {
   
    const candyName = document.getElementById('candyName').value;
    const description = document.getElementById('description').value;
    const price = parseFloat(document.getElementById('price').value);
    const quantity = parseInt(document.getElementById('quantity').value);

    
    if (!candyName || !description || isNaN(price) || isNaN(quantity)) {
        alert('Please fill in all fields with valid values.');
        return;
    }


    const newItem = {
        candyName,
        description,
        price,
        quantity
    };

    
    items.push(newItem);
    displayItem(newItem);

    
    saveItemsToStorage();

    
    saveItemToCrudCrud(newItem);

    clearForm();
}

function saveItemToCrudCrud(item) {

    axios.post('https://crudcrud.com/api/a9247ab04d70436c8c9a867be142d620/items', item)
        .then(response => {
            console.log('Item data saved successfully to crudcrud.com:', response.data);
        })
        .catch(error => {
            console.error('Error saving item data to crudcrud.com:', error);
        });
}

function displayItemsFromStorage() {
    
    items.forEach(displayItem);
}

function displayItem(item) {
    const itemList = document.getElementById('itemList');
    const listItem = document.createElement('li');
    listItem.innerHTML = `
        <strong>${item.candyName}</strong><br>
        Description: ${item.description}<br>
        Price: $${item.price.toFixed(2)}<br>
        Quantity: <span id="${item.candyName}_quantity">${item.quantity}</span><br>
        <button onclick="buyItem('${item.candyName}', 1)">Buy1</button>
        <button onclick="buyItem('${item.candyName}', 2)">Buy2</button>
        <button onclick="buyItem('${item.candyName}', 3)">Buy3</button>
    `;
    itemList.appendChild(listItem);
}

function buyItem(candyName, quantityToBuy) {
    const selectedItem = items.find(item => item.candyName === candyName);

    if (selectedItem) {
        if (selectedItem.quantity > 0 && selectedItem.quantity >= quantityToBuy) {
            selectedItem.quantity -= quantityToBuy;

            
            const quantityElement = document.getElementById(`${candyName}_quantity`);
            if (quantityElement) {
                quantityElement.textContent = selectedItem.quantity;
            }

   
            

            alert(`You bought ${quantityToBuy} of ${candyName}!`);
        } else {
            alert(`Not enough quantity available for ${candyName}.`);
        }

        saveItemsToStorage();
    }
}

function updateQuantityOnCrudCrud(item) {

    axios.put(`https://crudcrud.com/api/YOUR_CRUDCRUD_API_KEY/items/${item._id}`, item)
        .then(response => {
            console.log('Item data updated successfully on crudcrud.com:', response.data);
        })
        .catch(error => {
            console.error('Error updating item data on crudcrud.com:', error);
        });
}


function clearForm() {
    document.getElementById('candyName').value = '';
    document.getElementById('description').value = '';
    document.getElementById('price').value = '';
    document.getElementById('quantity').value = '';

    saveItemsToStorage();
}
