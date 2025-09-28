// =============================================
// CORRECTIONS IMMÉDIATES - FONCTIONS UTILISATEUR
// =============================================

// CORRECTION : Simplifier et corriger la fonction deleteUser
window.deleteUser = function(userId) {
    console.log('Tentative de suppression user:', userId); // Debug
    
    const user = users.find(u => u.id === userId);
    if (!user) {
        console.error('Utilisateur non trouvé');
        return;
    }
    
    // Vérification simplifiée des comptes système
    if (user.isAdmin || user.isOperator) {
        window.showNotification('Impossible de supprimer les comptes administrateur/opérateur', 'error');
        return;
    }
    
    // Vérifier les emails système (avec valeurs par défaut)
    const adminEmail = ADMIN_CREDENTIALS?.email || 'admin@example.com';
    const operatorEmail = OPERATOR_CREDENTIALS?.email || 'operator@example.com';
    
    if (user.email === adminEmail || user.email === operatorEmail) {
        window.showNotification('Impossible de supprimer les comptes système', 'error');
        return;
    }
    
    // Vérifier si l'utilisateur a des commandes (méthode plus simple)
    const hasOrders = orders.some(order => order.customerEmail === user.email);
    if (hasOrders) {
        window.showNotification('Cet utilisateur a des commandes et ne peut pas être supprimé', 'error');
        return;
    }
    
    if (confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur "${user.name}" ?`)) {
        const userIndex = users.findIndex(u => u.id === userId);
        if (userIndex !== -1) {
            users.splice(userIndex, 1);
            window.saveAllData();
            window.showNotification('Utilisateur supprimé avec succès', 'success');
            window.displayAdminUsers(); // Rafraîchir l'affichage
        }
    }
};

// CORRECTION : Fonction editUserPermissions simplifiée et fonctionnelle
window.editUserPermissions = function(userId) {
    console.log('Édition permissions user:', userId); // Debug
    
    const user = users.find(u => u.id === userId);
    if (!user) {
        window.showNotification('Utilisateur non trouvé', 'error');
        return;
    }
    
    // Vérification basique des comptes système
    if (user.isAdmin || user.isOperator) {
        window.showNotification('Les permissions des comptes admin/opérateur sont fixes', 'info');
        return;
    }

    // Créer le modal simplifié
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    modalContent.innerHTML = `
        <div class="modal-header">
            <h2>📋 Gérer les permissions - ${user.name}</h2>
            <button class="close-modal" onclick="closeCustomAlert()">×</button>
        </div>
        
        <div style="padding: 20px;">
            <div class="form-group">
                <label><strong>Statut de l'utilisateur :</strong></label>
                <select id="userStatusSelect" class="form-select">
                    <option value="pending" ${user.status === 'pending' ? 'selected' : ''}>⏳ En attente</option>
                    <option value="approved" ${user.status === 'approved' ? 'selected' : ''}>✅ Approuvé</option>
                    <option value="rejected" ${user.status === 'rejected' ? 'selected' : ''}>❌ Rejeté</option>
                </select>
            </div>
            
            <div class="form-group">
                <label><strong>Permissions disponibles :</strong></label>
                <div style="border: 1px solid #ddd; padding: 15px; border-radius: 5px; max-height: 300px; overflow-y: auto;">
                    ${window.availablePermissions.map(perm => `
                        <label style="display: block; margin: 10px 0; cursor: pointer;">
                            <input type="checkbox" 
                                   value="${perm.id}" 
                                   ${user.permissions && user.permissions.includes(perm.id) ? 'checked' : ''}
                                   style="margin-right: 10px;">
                            ${perm.name} 
                            <small style="color: #666;">(${perm.id})</small>
                        </label>
                    `).join('')}
                </div>
            </div>
            
            <div style="display: flex; gap: 10px; margin-top: 20px;">
                <button class="admin-btn primary" onclick="saveUserPermissions(${userId})">
                    💾 Sauvegarder
                </button>
                <button class="admin-btn secondary" onclick="closeCustomAlert()">
                    ❌ Annuler
                </button>
            </div>
        </div>
    `;
    
    window.showCustomAlert(modalContent);
};

// CORRECTION : Fonction saveUserPermissions corrigée
window.saveUserPermissions = function(userId) {
    console.log('Sauvegarde permissions user:', userId);
    
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
        window.showNotification('Utilisateur non trouvé', 'error');
        return;
    }
    
    try {
        // Récupérer le nouveau statut
        const statusSelect = document.getElementById('userStatusSelect');
        const newStatus = statusSelect ? statusSelect.value : users[userIndex].status;
        
        // Récupérer toutes les checkboxes
        const checkboxes = document.querySelectorAll('#customAlert input[type="checkbox"]');
        const selectedPermissions = [];
        
        checkboxes.forEach(checkbox => {
            if (checkbox.checked) {
                selectedPermissions.push(checkbox.value);
            }
        });
        
        // Mettre à jour l'utilisateur
        users[userIndex].status = newStatus;
        users[userIndex].permissions = selectedPermissions;
        
        // Si l'utilisateur est approuvé mais n'a pas de permissions, lui donner les bases
        if (newStatus === 'approved' && selectedPermissions.length === 0) {
            users[userIndex].permissions = ['view_products', 'purchase'];
        }
        
        // Sauvegarder
        window.saveAllData();
        
        // Mettre à jour l'interface si c'est l'utilisateur courant
        if (window.currentUser && window.currentUser.id === userId) {
            window.currentUser.permissions = selectedPermissions;
            window.currentUser.status = newStatus;
        }
        
        window.showNotification('✅ Permissions mises à jour avec succès', 'success');
        window.closeCustomAlert();
        window.displayAdminUsers();
        
    } catch (error) {
        console.error('Erreur sauvegarde permissions:', error);
        window.showNotification('Erreur lors de la sauvegarde', 'error');
    }
};

// CORRECTION : Fonctions approve/reject simplifiées
window.approveUser = function(userId) {
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
        users[userIndex].status = 'approved';
        // Donner des permissions basiques si aucune
        if (!users[userIndex].permissions || users[userIndex].permissions.length === 0) {
            users[userIndex].permissions = ['view_products', 'purchase'];
        }
        window.saveAllData();
        window.displayAdminUsers();
        window.showNotification('✅ Utilisateur approuvé', 'success');
    }
};

window.rejectUser = function(userId) {
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
        users[userIndex].status = 'rejected';
        users[userIndex].permissions = []; // Retirer toutes les permissions
        window.saveAllData();
        window.displayAdminUsers();
        window.showNotification('❌ Utilisateur rejeté', 'info');
    }
};

// CORRECTION : Vérification que availablePermissions existe
if (!window.availablePermissions) {
    window.availablePermissions = [
        { id: 'view_products', name: '👀 Voir les produits' },
        { id: 'purchase', name: '🛒 Effectuer des achats' },
        { id: 'manage_own_orders', name: '📦 Gérer ses commandes' },
        { id: 'operator_orders', name: '🚚 Gérer toutes les commandes (Opérateur)' },
        { id: 'manage_users', name: '👥 Gérer les utilisateurs (Admin)' },
        { id: 'manage_products', name: '📋 Gérer les produits (Admin)' }
    ];
}

// CORRECTION : Fonction pour vérifier les erreurs dans la console
window.checkPermissionsErrors = function() {
    console.log('=== DEBUG PERMISSIONS ===');
    console.log('Users:', users);
    console.log('AvailablePermissions:', window.availablePermissions);
    console.log('CurrentUser:', window.currentUser);
    console.log('======================');
};

// Ajouter un bouton de debug dans le panel admin (optionnel)
window.addDebugButton = function() {
    const adminHeader = document.querySelector('#adminPanel h2');
    if (adminHeader) {
        const debugBtn = document.createElement('button');
        debugBtn.textContent = '🐛 Debug';
        debugBtn.className = 'admin-btn secondary';
        debugBtn.style.marginLeft = '10px';
        debugBtn.onclick = window.checkPermissionsErrors;
        adminHeader.appendChild(debugBtn);
    }
};

// Initialisation au chargement
document.addEventListener('DOMContentLoaded', function() {
    // S'assurer que availablePermissions est défini
    if (!window.availablePermissions) {
        window.availablePermissions = [
            { id: 'view_products', name: 'Voir les produits' },
            { id: 'purchase', name: 'Effectuer des achats' },
            { id: 'manage_own_orders', name: 'Gérer ses commandes' },
            { id: 'operator_orders', name: 'Gérer les commandes' },
            { id: 'manage_users', name: 'Gérer les utilisateurs' },
            { id: 'manage_products', name: 'Gérer les produits' }
        ];
    }
    
    // Ajouter le bouton debug
    setTimeout(window.addDebugButton, 1000);
});