const productName = document.getElementById("productName");
const related_query = document.getElementById("related_query");
const add_product = document.getElementById("add_product");
const error = document.querySelector(".error");
const success = document.querySelector(".success");
const order_display = document.querySelector("#product_list");
let stockList = [];
let orderList = [];
const submit_stock = document.getElementById("submit_stock");

const get_stocks = async () => {
    try {
        const response = await fetch('/get_stocks');
        const data = await response.json();
        if (data.stockList) {
            stockList = data.stockList;
        }
    } catch (error) {
        console.error('Error fetching stock data:', error);
    }
};

productName.addEventListener('input', function () {
    const query = productName.value.toLowerCase();
    if (query === "") {
        related_query.style.display = "none";
    } else {
        if (Array.isArray(stockList)) {
            const filteredStocks = stockList.filter(stock =>
                (stock.productName.toLowerCase().includes(query) ||
                stock.skuBarcode.toLowerCase().includes(query) ||
                stock.category.toLowerCase().includes(query)) &&
                stock.stockQuantity > 0
            );
            related_query.innerHTML = filteredStocks.map(stock => `<li style="cursor: pointer;">${stock.productName} - ${stock.skuBarcode}</li>`).join('');
            related_query.style.display = "block";
        }
    }
});

document.addEventListener('click', function (event) {
    if (!productName.contains(event.target) && !related_query.contains(event.target)) {
        related_query.style.display = "none";
    }
});

related_query.addEventListener('click', function (event) {
    if (event.target.tagName === 'LI') {
        productName.value = event.target.textContent.split(' - ')[0];
        related_query.style.display = "none";
    }
});

const updateOrderDisplay = () => {
    order_display.innerHTML = orderList.map(order => `
        <tr>
            <td>${order.productName}</td>
            <td>${order.price}</td>
            <td>${order.quantity}</td>
            <td>${order.totalAmount}</td>
            <td><button class="btn btn-danger btn-sm remove-order" data-product-id="${order.productId}">x</button></td>
        </tr>
    `).join('');

    const totalAmount = orderList.reduce((sum, order) => sum + order.totalAmount, 0);
    order_display.innerHTML += `
        <tr>
            <td><strong>Total Amount:</strong></td>
            <td></td>
            <td></td>
            <td>${totalAmount}</td>
            <td></td>
        </tr>
    `;

    document.querySelectorAll('.remove-order').forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-product-id');
            orderList = orderList.filter(order => order.productId !== productId);
            updateOrderDisplay();
        });
    });
};

add_product.addEventListener("click", () => {
    const product = productName.value.trim();
    const quantity = document.getElementById("productQuantity").value.trim();

    if (!product || !quantity) {
        show_message("Empty fields, please input the necessary fields", "error");
    } else {
        const stockItem = stockList.find(stock => stock.productName.toLowerCase() === product.toLowerCase());
        if (stockItem) {
            const price = stockItem.price;
            const totalAmount = price * quantity;
            orderList.push({
                productId: stockItem._id,
                productName: stockItem.productName,
                quantity: quantity,
                price: price,
                totalAmount: totalAmount
            });
            show_message("Product added successfully", "success");
            updateOrderDisplay();
        } else {
            show_message("Product not found in stock list", "error");
        }
    }
});

submit_stock.addEventListener("click", async () => {
    if (orderList.length === 0) {
        show_message("No product added to the order list", "error");
    } else {
        try {
            const response = await fetch('/stock_management/add_order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ orderList })
            });
            const data = await response.json();
            
            if (data.success) {
                show_message("Order added successfully", "success");
                orderList = [];
                updateOrderDisplay();
            } else {
                show_message(data.message, "error");
            }
        } catch (error) {
            console.error('Error adding order:', error);
        }
    }
});

window.addEventListener("load", get_stocks);

const show_message = (message, error_type) => {
    let right_div_element;
    let wrong_div_element;

    if (error_type == "success") {
        right_div_element = success;
        wrong_div_element = error;
    } else {
        right_div_element = error;
        wrong_div_element = success;
    }

    right_div_element.style.display = "block";
    wrong_div_element.style.display = "none";

    right_div_element.innerHTML = message;

    setTimeout(() => {
        right_div_element.style.display = "none";
    }, 3000);
};
