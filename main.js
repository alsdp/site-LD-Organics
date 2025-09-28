// =============================================
// FICHIER PRINCIPAL - INITIALISATION
// =============================================

// Raccourcis pour les variables globales
const { products, cart, currentUser, isAdmin, isOperator, orders, users } = window;

document.addEventListener('DOMContentLoaded', function() {
    // Initialiser les variables globales
    window.initializeGlobalVariables();
    
    // Charger les données
    window.loadAllData();
    
    // Initialiser les comptes système
    setTimeout(() => {
        window.initializeAdminAccount();
        window.initializeOperatorAccount();
        window.displayProducts();
        window.updateCartCount();
        window.setupEventListeners();
        window.updateUserInterface();
        
        console.log('✅ Application initialisée avec succès');
        console.log(`📊 Données chargées: ${products.length} produits, ${users.length} utilisateurs, ${orders.length} commandes`);
    }, 100);
    
    // Sauvegarde automatique
    window.addEventListener('beforeunload', window.saveAllData);
    
    setInterval(function() {
        if (products.length > 0 || users.length > 0 || orders.length > 0) {
            window.saveAllData();
        }
    }, 30000);
});

// Fermer les modales en cliquant à l'extérieur
window.addEventListener('click', function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    const customAlert = document.getElementById('customAlert');
    if (customAlert && event.target === customAlert) {
        window.closeCustomAlert();
    }
});

// Fermer les modales avec ESC
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        window.closeAllModals();
    }
});

// AJOUTER ce bouton de debug dans le panel admin (optionnel)
window.addDebugButton = function() {
    const debugHTML = `
        <div style="position: fixed; bottom: 20px; right: 20px; z-index: 10000;">
            <button onclick="resetApplicationData()" 
                    style="background: #ff4444; color: white; border: none; padding: 10px; border-radius: 5px; cursor: pointer;">
                🔄 Reset Données
            </button>
            <button onclick="console.log({products, users, orders, cart, currentUser})" 
                    style="background: #2196F3; color: white; border: none; padding: 10px; border-radius: 5px; cursor: pointer; margin-left: 10px;">
                📊 Debug Console
            </button>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', debugHTML);
};

// Fonction pour ajouter le bouton debug (optionnel - à appeler si besoin)
// window.addDebugButton();