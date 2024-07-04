// Obtener o crear un carrito
async function getOrCreateCart() {
    try {
        const userId = null; // obtener el userId del usuario si está logueado
        const response = await axios.get(`http://localhost:3000/api/cart?userId=${userId}`);
        const cartId = response.data.id;
        console.log(response);
        localStorage.setItem('cartId', cartId); // Guardar cartId en localStorage
        return cartId;
    } catch (error) {
        console.error('Error creating or fetching cart:', error);
    }
}

// Para incrementar la cantidad de un producto
async function increment(id) {
    try {
        const cartId = await getOrCreateCart();
        await axios.put(`http://localhost:3000/api/cart/items/${id}/increment`);
        await fetchCartItems();
    } catch (error) {
        console.error('Error incrementing product quantity:', error);
    }
}

// Para disminuir la cantidad de un producto
async function decrease(id) {
    try {
        const cartId = await getOrCreateCart();
        await axios.put(`http://localhost:3000/api/cart/items/${id}/decrease`);
        await fetchCartItems();
    } catch (error) {
        console.error('Error decreasing product quantity:', error);
    }
}

// Para eliminar un producto del carrito
async function deleteProduct(id) {
    try {
        const cartId = await getOrCreateCart();
        await axios.delete(`http://localhost:3000/api/cart/${cartId}/items/${id}`);
        await fetchCartItems();
    } catch (error) {
        console.error('Error deleting product:', error);
    }
}

// Para mostrar los productos del carrito
async function fetchCartItems() {
    try {
        const cartId = await getOrCreateCart();
        const response = await axios.get(`http://localhost:3000/api/cart/${cartId}/items`);
        print(response.data);
    } catch (error) {
        console.error('Error fetching cart items:', error);
    }
}

const print = (productCart) => {
    if (productCart == null || productCart.length == 0) {
        const container = document.getElementById('main-cart');
        container.innerHTML = `<h1 class="text-info">TU CARRITO ESTÁ VACIO</h1>`;
    } else {
        const tbody = document.getElementById('tbody');
        tbody.innerHTML = '';
        let total = 0;
        productCart.forEach(({ id, product, quantity, subTotal }) => {
            tbody.innerHTML += `
                <tr>
                    <td><img src=${product.image} alt="Zapatilla mujer" height="200" width="200"></td>
                    <td><p>$${product.price}</p></td>
                    <td>
                        <button class="btn" onclick="decrease(${id})"> - </button>
                        ${quantity}
                        <button class="btn" onclick="increment(${id})"> + </button>
                    </td>
                    <td><p>$${subTotal}</p></td>
                    <td><button onclick="deleteProduct(${id})" class="btn-delete"><i class="bi bi-trash"></i></button></td>
                </tr>
            `;
            total = +(total + subTotal).toFixed(2);
        });
        tbody.innerHTML += `<tr>
            <td colspan="3">Total</td>
            <td>${total}</td>
        </tr>`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (typeof cartId === 'undefined') {
        var cartId = null; // Usar 'var' para definirla globalmente si no está definida
    }

    const tableHTML = document.getElementById('table');

    tableHTML.innerHTML += `
        <thead>
            <tr>
                <th>Producto</th>
                <th>Precio</th>
                <th>Cantidad</th>
                <th>Subtotal</th>
                <th></th>
            </tr>
        </thead>
    `;

    // Para vaciar el carrito
    const vaciarCart = document.getElementById('cleanCart');
    vaciarCart.addEventListener('click', async () => {
        try {
            const cartId = await getOrCreateCart();
            await axios.delete(`http://localhost:3000/api/cart/${cartId}/items`);
            print([]);
        } catch (error) {
            console.error('Error emptying cart:', error);
        }
    });

    tableHTML.innerHTML += `<tbody id="tbody"></tbody>`;
    fetchCartItems();
});
