const add_stock = document.querySelector('.add_stock');

add_stock.addEventListener('click', () => {
    const name = document.querySelector('#name').value;
    const sku = document.querySelector('#sku').value;
    const description = document.querySelector('#description').value;
    const quantity = document.querySelector('#quantity').value;
    const price = document.querySelector('#price').value;

    var params = {
        headers: {
            "content-type": "application/json; charset=UTF-8"
        },
        body: JSON.stringify({
            name: name,
            sku: sku,
            description: description,
            quantity: quantity,
            price: price
        }),
        method: "POST"
    }

    fetch('/stocks', params)
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
})
