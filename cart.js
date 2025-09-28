// =============================================
// GESTION DU PANIER
// =============================================

// Raccourcis pour les variables globales - CORRIGÉ
const { products, cart, currentUser, orders, ORDER_STATUS } = window;

window.addToCart = function(productId) {
    if (!products || !Array.isArray(products)) {
        window.showNotification('Erreur: produits non chargés', 'error');
        return;
    }
    
    const product = products.find(p => p && p.id === productId);
    if (!product) {
        window.showNotification('Produit non trouvé', 'error');
        return;
    }

    // Initialiser le panier si nécessaire
    if (!cart || !Array.isArray(cart)) {
        window.cart = [];
    }

    const existingItem = cart.find(item => item && item.id === productId);

    if (existingItem) {
        existingItem.quantity = (existingItem.quantity || 0) + 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name || 'Produit sans nom',
            price: product.price || 0,
            image: product.image || '',
            quantity: 1
        });
    }

    window.updateCartCount();
    window.saveAllData();
    window.showNotification('Produit ajouté au panier !', 'success');
};

window.removeFromCart = function(productId) {
    window.cart = cart.filter(item => item.id !== productId);
    window.updateCartCount();
    window.updateCartModal();
    window.saveAllData();
};

window.updateQuantity = function(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            window.removeFromCart(productId);
        } else {
            window.updateCartCount();
            window.updateCartModal();
            window.saveAllData();
        }
    }
};

window.updateCartCount = function() {
    const count = cart.reduce((total, item) => total + (item.quantity || 0), 0);
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = count;
    }
};

window.updateCartModal = function() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (!cartItems || !cartTotal) return;
    
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; padding: 40px;">Votre panier est vide</p>';
        cartTotal.textContent = 'Total: 0,00 $';
        return;
    }

    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = (item.price || 0) * (item.quantity || 0);
        total += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-image">
                <img src="${item.image || 'https://via.placeholder.com/80x80?text=Image'}" alt="${item.name || 'Produit'}" loading="lazy">
            </div>
            <div class="cart-item-info">
                <h4>${item.name || 'Produit'}</h4>
                <div class="cart-item-price">${(item.price || 0).toFixed(2)} $</div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span>${item.quantity || 0}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                    <button class="featured-btn" onclick="removeFromCart(${item.id})" style="margin-left: auto;">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
        cartItems.appendChild(cartItem);
    });
    
    cartTotal.textContent = `Total: ${total.toFixed(2)} $`;
};

window.openCartModal = function() {
    window.updateCartModal();
    const cartModal = document.getElementById('cartModal');
    if (cartModal) {
        cartModal.style.display = 'flex';
    }
};

window.checkout = function() {
    if (!cart || cart.length === 0) {
        window.showNotification('Votre panier est vide', 'error');
        return;
    }
    
    if (!currentUser) {
        window.showNotification('Veuillez vous connecter pour passer commande', 'error');
        const loginModal = document.getElementById('loginModal');
        if (loginModal) loginModal.style.display = 'flex';
        window.closeModal('cartModal');
        return;
    }
    
    if (!currentUser.permissions || !currentUser.permissions.includes('purchase')) {
        window.showNotification('Vous n\'avez pas la permission d\'effectuer des achats', 'error');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 0)), 0);
    
    const newOrder = {
        id: orders.length > 0 ? Math.max(...orders.map(o => o.id || 0)) + 1 : 1,
        customerName: currentUser.name,
        customerEmail: currentUser.email,
        customerPhone: currentUser.phone,
        customerAddress: currentUser.address,
        items: cart.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity
        })),
        total: total,
        date: new Date().toISOString().split('T')[0],
        status: ORDER_STATUS.PENDING,
        statusHistory: [{
            status: ORDER_STATUS.PENDING,
            date: new Date().toISOString(),
            changedBy: 'Système'
        }]
    };
    
    orders.push(newOrder);
    window.saveAllData();
    
    window.showNotification(`Commande passée avec succès ! Total: ${total.toFixed(2)} $`, 'success');
    
    window.cart = [];
    window.updateCartCount();
    window.updateCartModal();
    window.saveAllData();
    window.closeModal('cartModal');
};