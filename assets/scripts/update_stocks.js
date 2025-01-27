const update_stocks = document.getElementById('update_stocks');
const error = document.querySelector('.error');
const success = document.querySelector('.success');
const stockHistoryTable = document.querySelector('#stockHistoryTable');
const orderHistoryTable = document.querySelector('#orderHistoryTable');

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
            updateHistory();
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

async function updateHistory() {
    try {
        const response = await fetch(`/stock_management/product/${product_id}/history`);
        const data = await response.json();
        if (data.success) {
            stockHistoryTable.innerHTML = data.stockHistory.map(history => `
                <tr>
                    <td>${new Date(history.date).toLocaleString()}</td>
                    <td>${history.action}</td>
                    <td>${history.quantity}</td>
                    <td>${history.previousQuantity}</td>
                    <td>${history.price}</td>
                </tr>
            `).join('');
            orderHistoryTable.innerHTML = data.orderHistory.map(order => `
                <tr>
                    <td>${new Date(order.date).toLocaleString()}</td>
                    <td>${order.productName}</td>
                    <td>${order.quantity}</td>
                    <td>${order.price}</td>
                    <td>${order.totalAmount}</td>
                </tr>
            `).join('');
        } else {
            console.error('Failed to load history:', data.message);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}