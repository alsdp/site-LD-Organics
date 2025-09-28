// =============================================
// GESTION DES PRODUITS
// =============================================

// Raccourcis pour les variables globales - CORRIGÉ
const { products, defaultProducts } = window;

window.displayProducts = function() {
    const productsGrid = document.getElementById('featuredProductsGrid');
    if (!productsGrid) {
        console.error('Element featuredProductsGrid non trouvé');
        return;
    }
    
    productsGrid.innerHTML = '';

    if (!products || !Array.isArray(products) || products.length === 0) {
        productsGrid.innerHTML = '<p style="text-align: center; padding: 40px; grid-column: 1 / -1; color: var(--dark-gray);">Aucun produit disponible pour le moment</p>';
        return;
    }

    products.forEach(product => {
        if (!product || !product.id || !product.name) {
            console.warn('Produit invalide ignoré:', product);
            return;
        }
        
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image || 'https://via.placeholder.com/300x200?text=Image+Manquante'}" 
                     alt="${product.name}" 
                     loading="lazy"
                     onerror="this.src='https://via.placeholder.com/300x200?text=Image+Erreur'">
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <div class="product-price">${(product.price || 0).toFixed(2)} $</div>
                <button class="featured-btn" onclick="addToCart(${product.id})">
                    <i class="fas fa-cart-plus"></i> Ajouter au panier
                </button>
                <button class="featured-btn primary" onclick="showProductDetails(${product.id})">
                    <i class="fas fa-info-circle"></i> Détails
                </button>
            </div>
        `;
        productsGrid.appendChild(productCard);
    });
};

window.showProductDetails = function(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const alertContent = document.createElement('div');
    alertContent.className = 'custom-alert-content';
    alertContent.innerHTML = `
        <div class="product-details">
            <img src="${product.image || 'https://via.placeholder.com/300x300?text=Image+Manquante'}" alt="${product.name}" class="product-details-image" loading="lazy">
            <h3>${product.name}</h3>
            <div class="product-details-price">${(product.price || 0).toFixed(2)} $</div>
            <div class="product-description">
                <p>${product.description || 'Aucune description disponible.'}</p>
            </div>
            <div class="product-features">
                <h4>Caractéristiques :</h4>
                <ul>
                    ${(product.features || ['Aucune caractéristique disponible']).map(feature => `<li>${feature}</li>`).join('')}
                </ul>
            </div>
            <div class="usage-tips">
                <h4>Mode d'utilisation :</h4>
                <p>${product.usage || 'Aucune information d\'utilisation disponible.'}</p>
            </div>
            <button class="featured-btn primary" onclick="addToCart(${product.id}); closeCustomAlert();" style="margin-top: 20px;">
                <i class="fas fa-cart-plus"></i> Ajouter au panier
            </button>
            <button class="featured-btn" onclick="closeCustomAlert()" style="margin-top: 10px;">
                <i class="fas fa-times"></i> Fermer
            </button>
        </div>
    `;
    
    window.showCustomAlert(alertContent);
};