// =============================================
// VARIABLES GLOBALES - DÉCLARATION SUR WINDOW
// =============================================

// S'assurer que l'objet global existe
if (!window.ldOrganics) {
    window.ldOrganics = {};
}

// Variables globales principales
window.ldOrganics.products = [];
window.ldOrganics.cart = [];
window.ldOrganics.currentUser = null;
window.ldOrganics.isAdmin = false;
window.ldOrganics.isOperator = false;
window.ldOrganics.orders = [];
window.ldOrganics.users = [];

// Raccourcis pour faciliter l'écriture dans tous les fichiers
window.products = window.ldOrganics.products;
window.cart = window.ldOrganics.cart;
window.currentUser = window.ldOrganics.currentUser;
window.isAdmin = window.ldOrganics.isAdmin;
window.isOperator = window.ldOrganics.isOperator;
window.orders = window.ldOrganics.orders;
window.users = window.ldOrganics.users;

// Constantes globales
window.ADMIN_CREDENTIALS = {
    email: "admin@ldorganics.com",
    password: "admin123"
};

window.OPERATOR_CREDENTIALS = {
    email: "operator@ldorganics.com",
    password: "operator123"
};

// Permissions disponibles (UNE SEULE DÉCLARATION)
window.availablePermissions = [
    { id: 'view_products', name: 'Voir les produits' },
    { id: 'purchase', name: 'Effectuer des achats' },
    { id: 'manage_own_orders', name: 'Gérer ses propres commandes' },
    { id: 'manage_all_orders', name: 'Gérer toutes les commandes' },
    { id: 'manage_users', name: 'Gérer les utilisateurs' },
    { id: 'manage_products', name: 'Gérer les produits' },
    { id: 'operator_orders', name: 'Opérateur de commandes' }
];

// Statuts de commande
window.ORDER_STATUS = {
    PENDING: 'pending',
    PROCESSING: 'processing',
    SHIPPED: 'shipped',
    DELIVERED: 'delivered',
    CANCELLED: 'cancelled'
};

// Données des produits avec vos images et prix
window.defaultProducts = [
    {
        id: 1,
        name: "Huile de CBD Premium",
        price: 10.00,
        image: "https://i.goopics.net/4ngzd9.png",
        description: "Notre huile de CBD premium est extraite de plants de chanvre biologiques cultivés en Suisse. Elle offre une concentration parfaite pour un usage quotidien et un bien-être optimal.",
        features: ["100% Naturelle", "Sans THC", "Fabriquée en Suisse", "Testée en laboratoire", "10ml par flacon"],
        usage: "Agiter avant utilisation. Prendre 2-3 gouttes sous la langue, maintenir 60 secondes avant d'avaler."
    },
    {
        id: 2,
        name: "Lotion CBD Hydratante",
        price: 10.00,
        image: "https://i.goopics.net/ken4t2.png",
        description: "Lotion corporelle enrichie au CBD pour une hydratation profonde et apaisante. Formulée avec des ingrédients naturels comme l'aloe vera et la vitamine E.",
        features: ["Hydratation intense", "Aloe Vera", "Vitamine E", "Convient peaux sensibles", "Parfum naturel"],
        usage: "Appliquer sur peau propre et sèche. Masser doucement jusqu'à absorption complète."
    },
    {
        id: 3,
        name: "Sachets Vides Réutilisables",
        price: 3.00,
        image: "https://i.goopics.net/6cq26n.png",
        description: "Sachets en coton organique réutilisables, parfaits pour conserver vos herbes et plantes médicinales. Respirants et écologiques.",
        features: ["Coton biologique", "Réutilisable", "Écologique", "Taille standard", "Fermeture sécurisée"],
        usage: "Remplir avec vos herbes préférées, fermer soigneusement. Conserver à l'abri de l'humidité."
    },
    {
        id: 4,
        name: "Joint Pré-roulé CBD",
        price: 10.00,
        image: "https://i.goopics.net/7u44os.png",
        description: "Joint pré-roulé artisanal contenant des fleurs de CBD de haute qualité. Chaque joint est soigneusement confectionné.",
        features: ["Fleurs premium", "Roulage artisanal", "Papier naturel", "Dosage contrôlé", "Sans additifs"],
        usage: "Allumer délicatement et inhaler lentement. Consommer avec modération dans un environnement calme."
    },
    {
        id: 5,
        name: "Feuilles de Thé Infusées CBD",
        price: 24.00,
        image: "https://i.goopics.net/vkblb7.png",
        description: "Mélange exclusif de thé vert premium infusé au CBD. Une façon délicieuse et relaxante de profiter des bienfaits du CBD.",
        features: ["Thé vert premium", "Infusion naturelle", "Arôme délicat", "20 sachets", "Antioxydants naturels"],
        usage: "Infuser 1 sachet dans 250ml d'eau chaude (80°C) pendant 3-5 minutes. Boire 1 à 2 fois par jour."
    },
    {
        id: 6,
        name: "Sacs en Papier Kraft Écologiques",
        price: 2.00,
        image: "https://i.goopics.net/phhwrh.png",
        description: "Sacs en papier kraft 100% biodégradables, idéaux pour l'emballage de vos produits. Respectueux de l'environnement.",
        features: ["100% Biodégradable", "Résistant", "Taille polyvalente", "Écologique", "Fabriqué en France"],
        usage: "Utiliser pour emballer vos produits secs. Conserver dans un endroit sec à l'abri de l'humidité."
    },
    {
        id: 7,
        name: "Sucettes au CBD Gourmandes",
        price: 8.00,
        image: "https://i.goopics.net/twp1aj.png",
        description: "Délicieuses sucettes au CBD avec différents parfums fruités. Chaque sucette contient une dose précise de CBD.",
        features: ["5 parfums disponibles", "Sans sucre raffiné", "10mg CBD par sucette", "Végétaliennes", "Fabriqué artisanalement"],
        usage: "Sucer lentement la sucette jusqu'à dissolution complète. Maximum 2 sucettes par jour."
    },
    {
        id: 8,
        name: "Chillma - Mélange Relaxant",
        price: 10.00,
        image: "https://i.goopics.net/bij1lq.png",
        description: "Mélange exclusif de plantes et de CBD spécialement formulé pour la détente et la relaxation.",
        features: ["Mélange de plantes", "Propriétés relaxantes", "Arôme naturel", "Sans conservateurs", "20g par sachet"],
        usage: "Utiliser selon vos préférences. Peut être infusé en thé ou utilisé dans un vaporisateur."
    },
    {
        id: 9,
        name: "Cookies au CBD Chocolat-Noisette",
        price: 10.00,
        image: "https://i.goopics.net/t1gbd9.png",
        description: "Cookies artisanaux au chocolat et noisette infusés au CBD. Une gourmandise saine qui allie plaisir gustatif et bien-être.",
        features: ["Artisanal", "Chocolat noir", "Noisettes torréfiées", "15mg CBD per cookie", "Sans gluten"],
        usage: "Déguster 1 cookie par jour de préférence en après-midi. Conserver au frais et au sec."
    }
];

// =============================================
// FONCTIONS UTILITAIRES
// =============================================

// FONCTION D'INITIALISATION DES VARIABLES GLOBALES
window.initializeGlobalVariables = function() {
    if (!window.products) window.products = [];
    if (!window.cart) window.cart = [];
    if (!window.currentUser) window.currentUser = null;
    if (!window.isAdmin) window.isAdmin = false;
    if (!window.isOperator) window.isOperator = false;
    if (!window.orders) window.orders = [];
    if (!window.users) window.users = [];
};

// FONCTION DE SAUVEGARDE AUTOMATIQUE AMÉLIORÉE
window.saveAllData = function() {
    try {
        // Vérifier que les données sont valides avant sauvegarde
        const dataToSave = {
            products: Array.isArray(products) ? products.filter(p => p && p.id) : [],
            users: Array.isArray(users) ? users.filter(u => u && u.id) : [],
            orders: Array.isArray(orders) ? orders.filter(o => o && o.id) : [],
            cart: Array.isArray(cart) ? cart.filter(item => item && item.id) : []
        };
        
        localStorage.setItem('ldOrganicsProducts', JSON.stringify(dataToSave.products));
        localStorage.setItem('ldOrganicsUsers', JSON.stringify(dataToSave.users));
        localStorage.setItem('ldOrganicsOrders', JSON.stringify(dataToSave.orders));
        localStorage.setItem('ldOrganicsCart', JSON.stringify(dataToSave.cart));
        
        console.log('💾 Données sauvegardées avec succès');
    } catch (e) {
        console.error('❌ Erreur lors de la sauvegarde:', e);
        window.showNotification('Erreur lors de la sauvegarde des données', 'error');
    }
};

// FONCTIONS DE BASE AVEC SAUVEGARDE AUTOMATIQUE
window.loadAllData = function() {
    try {
        // Produits
        const savedProducts = localStorage.getItem('ldOrganicsProducts');
        if (savedProducts) {
            const parsed = JSON.parse(savedProducts);
            if (Array.isArray(parsed) && parsed.length > 0) {
                products.length = 0;
                products.push(...parsed.filter(p => p && p.id && p.name));
            } else {
                // Charger les produits par défaut si aucun produit sauvegardé
                products.length = 0;
                products.push(...defaultProducts);
            }
        } else {
            // Première utilisation : charger les produits par défaut
            products.length = 0;
            products.push(...defaultProducts);
        }
        
        // Utilisateurs
        const savedUsers = localStorage.getItem('ldOrganicsUsers');
        if (savedUsers) {
            const parsed = JSON.parse(savedUsers);
            if (Array.isArray(parsed)) {
                users.length = 0;
                users.push(...parsed.filter(u => u && u.id));
            }
        }
        
        // Commandes
        const savedOrders = localStorage.getItem('ldOrganicsOrders');
        if (savedOrders) {
            const parsed = JSON.parse(savedOrders);
            if (Array.isArray(parsed)) {
                orders.length = 0;
                orders.push(...parsed.filter(o => o && o.id));
            }
        }
        
        // Panier
        const savedCart = localStorage.getItem('ldOrganicsCart');
        if (savedCart) {
            const parsed = JSON.parse(savedCart);
            if (Array.isArray(parsed)) {
                cart.length = 0;
                cart.push(...parsed.filter(item => item && item.id));
            }
        }
    } catch (e) {
        console.error('Erreur lors du chargement des données:', e);
        // Réinitialiser avec des tableaux vides en cas d'erreur
        products = [...defaultProducts];
        users = [];
        orders = [];
        cart = [];
    }
};

window.initializeAdminAccount = function() {
    const adminExists = users.find(u => u.email === ADMIN_CREDENTIALS.email);
    
    if (!adminExists) {
        const adminUser = {
            id: users.length > 0 ? Math.max(...users.map(u => u.id || 0)) + 1 : 1,
            name: 'Administrateur',
            email: ADMIN_CREDENTIALS.email,
            phone: '',
            address: '',
            password: ADMIN_CREDENTIALS.password,
            status: 'approved',
            permissions: ['view_products', 'purchase', 'manage_own_orders', 'manage_all_orders', 'manage_users', 'manage_products'],
            registrationDate: new Date().toISOString().split('T')[0],
            isAdmin: true
        };
        
        users.push(adminUser);
        saveAllData();
    }
};

window.initializeOperatorAccount = function() {
    const operatorExists = users.find(u => u.email === OPERATOR_CREDENTIALS.email);
    
    if (!operatorExists) {
        const operatorUser = {
            id: users.length > 0 ? Math.max(...users.map(u => u.id || 0)) + 1 : 2,
            name: 'Opérateur Commandes',
            email: OPERATOR_CREDENTIALS.email,
            phone: '',
            address: '',
            password: OPERATOR_CREDENTIALS.password,
            status: 'approved',
            permissions: ['view_products', 'operator_orders'],
            registrationDate: new Date().toISOString().split('T')[0],
            isOperator: true
        };
        
        if (!users.find(u => u.id === operatorUser.id)) {
            users.push(operatorUser);
            saveAllData();
        }
    }
};

// FONCTIONS UTILITAIRES
window.showNotification = function(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : '#2196f3'};
        color: white;
        border-radius: 8px;
        z-index: 10000;
        box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        animation: slideInRight 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 3000);
};

window.closeModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
};

window.showCustomAlert = function(content) {
    const alert = document.createElement('div');
    alert.className = 'custom-alert';
    alert.id = 'customAlert';
    alert.appendChild(content);
    document.body.appendChild(alert);
};

window.closeCustomAlert = function() {
    const alert = document.getElementById('customAlert');
    if (alert) {
        alert.remove();
    }
};

window.closeAllModals = function() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.style.display = 'none';
    });
    
    const panels = document.querySelectorAll('.admin-panel, .account-panel');
    panels.forEach(panel => {
        panel.style.display = 'none';
    });
    
    closeCustomAlert();
    
    // Fermer aussi le dropdown menu
    const dropdownMenu = document.getElementById('dropdownMenu');
    if (dropdownMenu) {
        dropdownMenu.classList.remove('show');
    }
};

// FONCTIONS UTILITAIRES AJOUTÉES
window.isValidProduct = function(product) {
    return product && typeof product === 'object' && product.id && product.name;
};

window.isValidUser = function(user) {
    return user && typeof user === 'object' && user.id && user.email;
};

window.isValidOrder = function(order) {
    return order && typeof order === 'object' && order.id;
};

window.getStatusClass = function(status) {
    switch(status) {
        case ORDER_STATUS.PENDING: return 'status-pending';
        case ORDER_STATUS.PROCESSING: return 'status-processing';
        case ORDER_STATUS.SHIPPED: return 'status-shipped';
        case ORDER_STATUS.DELIVERED: return 'status-delivered';
        case ORDER_STATUS.CANCELLED: return 'status-cancelled';
        default: return 'status-pending';
    }
};

window.getStatusText = function(status) {
    switch(status) {
        case ORDER_STATUS.PENDING: return 'En attente';
        case ORDER_STATUS.PROCESSING: return 'En cours';
        case ORDER_STATUS.SHIPPED: return 'Expédiée';
        case ORDER_STATUS.DELIVERED: return 'Livrée';
        case ORDER_STATUS.CANCELLED: return 'Annulée';
        default: return 'Inconnu';
    }
};

// Fonction de réinitialisation d'urgence
window.resetApplicationData = function() {
    if (confirm('Êtes-vous sûr de vouloir réinitialiser toutes les données ? Cette action est irréversible.')) {
        localStorage.removeItem('ldOrganicsProducts');
        localStorage.removeItem('ldOrganicsUsers');
        localStorage.removeItem('ldOrganicsOrders');
        localStorage.removeItem('ldOrganicsCart');
        
        products = [...defaultProducts];
        users = [];
        orders = [];
        cart = [];
        currentUser = null;
        isAdmin = false;
        isOperator = false;
        
        location.reload();
    }
};