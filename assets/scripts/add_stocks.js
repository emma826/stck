const add_stock = document.querySelector('.add_stock');
const error = document.querySelector(".error");
const success = document.querySelector(".success");
const stockholder = document.getElementById("stockholder");

add_stock.addEventListener('click', () => {
    const name = document.getElementById("product_name").value;
    const sku = document.getElementById("sku_barcode").value;
    const quantity = document.getElementById("stock_quantity").value;
    const price = document.getElementById("price").value;
    const threshold = document.getElementById("stock_threshold").value;
    const category = document.getElementById("category").value;

    var params = {
        headers: {
            "content-type": "application/json; charset=UTF-8"
        },
        body: JSON.stringify({
            name,
            sku,
            quantity: quantity,
            price: price,
            threshold,
            category
        }),
        method: "POST"
    };

    fetch('/stock_management/add_stock', params)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                error.style.display = "none";
                success.style.display = "block";

                success.innerHTML = "Stock added successfully";

                const newStock = document.createElement('tr');
                newStock.className = data.newStock.stockQuantity === 0 ? 'table-danger' : data.newStock.stockQuantity <= data.newStock.stockThreshold ? 'table-warning' : '';
                newStock.innerHTML = `
                    <td><a href="/stock_management/product/${data.newStock._id}">${data.newStock.productName}</a></td>
                    <td>${data.newStock.skuBarcode}</td>
                    <td>${data.newStock.stockQuantity}</td>
                    <td>${data.newStock.price}</td>
                    <td>${data.newStock.stockThreshold}</td>
                    <td>${data.newStock.category}</td>
                `;
                stockholder.insertBefore(newStock, stockholder.firstChild);

                setTimeout(() => {
                    success.style.display = "none";
                }, 3000);
            } else {
                success.style.display = "none";
                error.style.display = "block";

                error.innerHTML = data.message;

                setTimeout(() => {
                    error.style.display = "none";
                }, 3000);
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
});

window.addEventListener("load", async () => {
    try {
        const response = await fetch('/stock_management/load_stocks');
        const data = await response.json();
        if (data.success) {
            stockholder.innerHTML = "";
            stocks = data.stocks.reverse();
            stocks.forEach(stock => {
                const stockRow = document.createElement('tr');
                stockRow.className = stock.stockQuantity === 0 ? 'table-danger' : stock.stockQuantity <= stock.stockThreshold ? 'table-warning' : '';
                stockRow.innerHTML = `
                    <td><a href="/stock_management/product/${stock._id}">${stock.productName}</a></td>
                    <td>${stock.skuBarcode}</td>
                    <td>${stock.stockQuantity}</td>
                    <td>${stock.price}</td>
                    <td>${stock.stockThreshold}</td>
                    <td>${stock.category}</td>
                `;
                stockholder.appendChild(stockRow);
            });

            stockholder.innerHTML += `<tr></tr>`;
        } else {
            console.error('Failed to load stocks:', data.message);
        }
    } catch (error) {
        console.error('Error:', error);
    }
});

