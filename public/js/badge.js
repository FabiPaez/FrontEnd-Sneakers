const badgeHTML = document.getElementById('badge');
let cartId = null;

// Para obtener el ID del carrito, podría ser de un usuario logueado o de un carrito anónimo
async function getCartId() {
    if (!cartId) {
        try {
            const response = await axios.get('https://backend-sneakers-5feb28529d4a.herokuapp.com/api/cart'); // Ajusta la ruta según tu backend
            cartId = response.data.id;
        } catch (error) {
            console.error('Error fetching cart ID:', error);
        }
    }
    return cartId;
}

// Para mostrar la cantidad total de productos en el carrito
async function printBadge() {
    try {
        const cartId = await getCartId();
        const response = await axios.get(`https://backend-sneakers-5feb28529d4a.herokuapp.com/api/cart/${cartId}/items`);
        const totalQuantity = response.data.reduce((prev, current) => {
            prev += current.quantity;
            return prev;
        }, 0);
        badgeHTML.innerHTML = totalQuantity;
    } catch (error) {
        console.error('Error fetching cart items:', error);
    }
}

printBadge();
