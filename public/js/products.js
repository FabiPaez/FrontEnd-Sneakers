document.addEventListener('DOMContentLoaded', async () => {
    const productContainer = document.getElementById('products');

    // Obtener o crear un carrito
    async function getOrCreateCart() {
        try {
            const userId = null; // Aquí deberías obtener el userId del usuario si está logueado
            const response = await axios.get(`https://backend-sneakers-5feb28529d4a.herokuapp.com/api/cart?userId=${userId}`);
            const cartId = response.data.id;
            console.log(response);
            localStorage.setItem('cartId', cartId); // Guardar cartId en localStorage
            return cartId;
        } catch (error) {
            console.error('Error creating or fetching cart:', error);
        }
    }

    const cartId = await getOrCreateCart();

    // Función para obtener productos desde la base de datos
    async function getProducts() {
        try {
            const response = await axios.get('https://backend-sneakers-5feb28529d4a.herokuapp.com/api/products');
            return response.data;
        } catch (error) {
            console.error('Error fetching products:', error);
            return [];
        }
    }

    // Función para mostrar productos en la página
    function displayProducts(products) {
        productContainer.innerHTML = '';
        products.forEach(({ id, image, name, description, price }) => {
            const productElement = document.createElement('article');
            productElement.classList.add('producto');

            productElement.innerHTML = `
            <img src="${image}" alt="${name}">
            <h2>${name}</h2>
            <p>${description}</p>
            <p>$${price.toFixed(2)}</p>
            <a href="#">Ver más</a>
            <button onclick="agregarCarrito(${id})" class="btn">Agregar</button>
        `;

            productContainer.appendChild(productElement);
        });
    }    

    // Función para agregar producto al carrito
    async function agregarCarrito(productId) {
        try {
            if (!cartId) {
                await getOrCreateCart();
            }
            const response = await axios.post(`https://backend-sneakers-5feb28529d4a.herokuapp.com/api/cart/${cartId}/items`, {
                productId: productId,
                quantity: 1
            });
            console.log('Product added to cart:', response.data);
        } catch (error) {
            console.error('Error adding product to cart:', error);
        }
    }

    // Llamar a getOrCreateCart() al cargar la página o al iniciar sesión
    getOrCreateCart();
    window.agregarCarrito = agregarCarrito;

    // Obtener y mostrar los productos cuando se carga la página
    getProducts().then(displayProducts);
});
