const update_stocks = document.getElementById('update_stocks');
const error = document.querySelector('.error');
const success = document.querySelector('.success');

update_stocks.addEventListener('click', async (event) => {
    event.preventDefault();

    const addQuantity = parseFloat(document.getElementById('addQuantity').value);
    const productPrice = parseFloat(document.getElementById('productPrice').value);

    try {
        const response = await fetch('/stock_management/update_stocks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({productId: product_id, quantity: addQuantity, price: productPrice})
        });
        const responseData = await response.json();
        if (responseData.success) {
            success.style.display = "block";
            success.innerHTML = "Stock updated successfully";
            document.getElementById('previousQuantity').value = responseData.stock.stockQuantity;
            document.getElementById("productPrice").value = responseData.stock.price;
            setTimeout(() => {
                success.style.display = "none";
            }, 3000);
        } else {
            error.style.display = "block";
            error.innerHTML = responseData.message;
            setTimeout(() => {
                error.style.display = "none";
            }, 3000);
        }
    } catch (error) {
        console.error('Error:', error);
    }
});

function calculateTotal() {
    const previousQuantity = parseFloat(document.getElementById('previousQuantity').value) || 0;
    const addQuantity = parseFloat(document.getElementById('addQuantity').value) || 0;
    const totalQuantity = previousQuantity + addQuantity;
    document.getElementById('totalQuantity').value = totalQuantity;
}