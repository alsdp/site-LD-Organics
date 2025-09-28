// =============================================
// GESTION DE L'AUTHENTIFICATION
// =============================================

// Raccourcis pour les variables globales - CORRIGÉ
const { products, cart, currentUser, isAdmin, isOperator, orders, users, ORDER_STATUS, ADMIN_CREDENTIALS, OPERATOR_CREDENTIALS, defaultProducts } = window;

window.setupEventListeners = function() {
    const clientSpaceLink = document.getElementById('clientSpaceLink');
    if (clientSpaceLink) {
        clientSpaceLink.addEventListener('click', function() {
            const dropdownMenu = document.getElementById('dropdownMenu');
            if (dropdownMenu) {
                dropdownMenu.classList.toggle('show');
            }
        });
    }

    document.addEventListener('click', function(event) {
        const dropdownMenu = document.getElementById('dropdownMenu');
        const clientSpace = document.querySelector('.client-space');
        
        if (dropdownMenu && clientSpace && !event.target.closest('.client-space')) {
            dropdownMenu.classList.remove('show');
        }
    });

    const createAccountOption = document.getElementById('createAccountOption');
    if (createAccountOption) {
        createAccountOption.addEventListener('click', function(e) {
            e.preventDefault();
            const dropdownMenu = document.getElementById('dropdownMenu');
            if (dropdownMenu) dropdownMenu.classList.remove('show');
            const registerModal = document.getElementById('registerModal');
            if (registerModal) registerModal.style.display = 'flex';
        });
    }

    const loginOption = document.getElementById('loginOption');
    if (loginOption) {
        loginOption.addEventListener('click', function(e) {
            e.preventDefault();
            const dropdownMenu = document.getElementById('dropdownMenu');
            if (dropdownMenu) dropdownMenu.classList.remove('show');
            const loginModal = document.getElementById('loginModal');
            if (loginModal) loginModal.style.display = 'flex';
        });
    }

    const myAccountOption = document.getElementById('myAccountOption');
    if (myAccountOption) {
        myAccountOption.addEventListener('click', function(e) {
            e.preventDefault();
            const dropdownMenu = document.getElementById('dropdownMenu');
            if (dropdownMenu) dropdownMenu.classList.remove('show');
            window.openAccountPanel();
        });
    }

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            window.handleLogin();
        });
    }

    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            window.handleRegister();
        });
    }

    const adminLink = document.getElementById('adminLink');
    if (adminLink) {
        adminLink.addEventListener('click', function(e) {
            e.preventDefault();
            const dropdownMenu = document.getElementById('dropdownMenu');
            if (dropdownMenu) dropdownMenu.classList.remove('show');
            window.openAdminPanel();
        });
    }

    const operatorLink = document.getElementById('operatorLink');
    if (operatorLink) {
        operatorLink.addEventListener('click', function(e) {
            e.preventDefault();
            const dropdownMenu = document.getElementById('dropdownMenu');
            if (dropdownMenu) dropdownMenu.classList.remove('show');
            window.openOperatorPanel();
        });
    }

    const logoutOption = document.getElementById('logoutOption');
    if (logoutOption) {
        logoutOption.addEventListener('click', function(e) {
            e.preventDefault();
            const dropdownMenu = document.getElementById('dropdownMenu');
            if (dropdownMenu) dropdownMenu.classList.remove('show');
            window.logout();
        });
    }
};

window.handleLogin = function() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    if (!email || !password) {
        window.showNotification('Veuillez remplir tous les champs', 'error');
        return;
    }
    
    // Vérification spéciale pour l'admin
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
        let adminUser = users.find(u => u.email === ADMIN_CREDENTIALS.email);
        
        if (!adminUser) {
            window.initializeAdminAccount();
            adminUser = users.find(u => u.email === ADMIN_CREDENTIALS.email);
        }
        
        if (adminUser) {
            window.currentUser = {
                id: adminUser.id,
                name: adminUser.name,
                email: adminUser.email,
                phone: adminUser.phone || '',
                address: adminUser.address || '',
                permissions: adminUser.permissions || []
            };
            
            window.isAdmin = true;
            window.isOperator = false;
            window.updateUserInterface();
            window.closeModal('loginModal');
            window.showNotification('Connexion administrateur réussie !', 'success');
            document.getElementById('loginForm').reset();
            return;
        }
    }
    
    // Vérification spéciale pour l'opérateur
    if (email === OPERATOR_CREDENTIALS.email && password === OPERATOR_CREDENTIALS.password) {
        let operatorUser = users.find(u => u.email === OPERATOR_CREDENTIALS.email);
        
        if (!operatorUser) {
            window.initializeOperatorAccount();
            operatorUser = users.find(u => u.email === OPERATOR_CREDENTIALS.email);
        }
        
        if (operatorUser) {
            window.currentUser = {
                id: operatorUser.id,
                name: operatorUser.name,
                email: operatorUser.email,
                phone: operatorUser.phone || '',
                address: operatorUser.address || '',
                permissions: operatorUser.permissions || []
            };
            
            window.isAdmin = false;
            window.isOperator = true;
            window.updateUserInterface();
            window.closeModal('loginModal');
            window.showNotification('Connexion opérateur réussie !', 'success');
            document.getElementById('loginForm').reset();
            return;
        }
    }
    
    // Rechercher l'utilisateur normal
    const user = users.find(u => u.email === email);
    
    if (!user) {
        window.showNotification('Aucun compte trouvé avec cet email', 'error');
        return;
    }
    
    if (user.password !== password) {
        window.showNotification('Mot de passe incorrect', 'error');
        return;
    }
    
    if (user.status === 'pending') {
        window.showNotification('Votre compte est en attente d\'approbation par l\'administrateur', 'warning');
        return;
    }
    
    if (user.status === 'rejected') {
        window.showNotification('Votre compte a été rejeté par l\'administrateur', 'error');
        return;
    }
    
    window.currentUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        address: user.address || '',
        permissions: user.permissions || []
    };
    
    window.isAdmin = user.isAdmin || (user.permissions && user.permissions.includes('manage_users'));
    window.isOperator = user.isOperator || (user.permissions && user.permissions.includes('operator_orders'));
    
    window.updateUserInterface();
    window.closeModal('loginModal');
    window.showNotification('Connexion réussie !', 'success');
    document.getElementById('loginForm').reset();
};

window.handleRegister = function() {
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const phone = document.getElementById('registerPhone').value;
    const address = document.getElementById('registerAddress').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;
    
    if (password !== confirmPassword) {
        window.showNotification('Les mots de passe ne correspondent pas', 'error');
        return;
    }
    
    if (name && email && password) {
        if (users.find(u => u.email === email)) {
            window.showNotification('Un compte avec cet email existe déjà', 'error');
            return;
        }
        
        const newUser = {
            id: users.length > 0 ? Math.max(...users.map(u => u.id || 0)) + 1 : 3,
            name: name,
            email: email,
            phone: phone || '',
            address: address || '',
            password: password,
            status: 'pending',
            permissions: ['view_products'],
            registrationDate: new Date().toISOString().split('T')[0],
            isAdmin: false,
            isOperator: false
        };
        
        users.push(newUser);
        window.saveAllData();
        
        window.showNotification('Compte créé avec succès ! En attente d\'approbation par l\'administrateur.', 'success');
        window.closeModal('registerModal');
        
        document.getElementById('registerForm').reset();
    } else {
        window.showNotification('Veuillez remplir tous les champs obligatoires', 'error');
    }
};

window.logout = function() {
    window.currentUser = null;
    window.isAdmin = false;
    window.isOperator = false;
    window.updateUserInterface();
    window.showNotification('Déconnexion réussie', 'info');
};

window.updateUserInterface = function() {
    const createAccountOption = document.getElementById('createAccountOption');
    const loginOption = document.getElementById('loginOption');
    const myAccountOption = document.getElementById('myAccountOption');
    const adminLink = document.getElementById('adminLink');
    const operatorLink = document.getElementById('operatorLink');
    const logoutOption = document.getElementById('logoutOption');
    
    if (currentUser) {
        if (createAccountOption) createAccountOption.style.display = 'none';
        if (loginOption) loginOption.style.display = 'none';
        if (myAccountOption) myAccountOption.style.display = 'flex';
        if (logoutOption) logoutOption.style.display = 'flex';
        
        if (isAdmin) {
            if (adminLink) adminLink.style.display = 'flex';
            if (operatorLink) operatorLink.style.display = 'none';
        } else if (isOperator) {
            if (adminLink) adminLink.style.display = 'none';
            if (operatorLink) operatorLink.style.display = 'flex';
        } else {
            if (adminLink) adminLink.style.display = 'none';
            if (operatorLink) operatorLink.style.display = 'none';
        }
    } else {
        if (createAccountOption) createAccountOption.style.display = 'flex';
        if (loginOption) loginOption.style.display = 'flex';
        if (myAccountOption) myAccountOption.style.display = 'none';
        if (adminLink) adminLink.style.display = 'none';
        if (operatorLink) operatorLink.style.display = 'none';
        if (logoutOption) logoutOption.style.display = 'none';
    }
};

// Gestion du compte utilisateur AVEC SAUVEGARDE AUTOMATIQUE
window.openAccountPanel = function() {
    if (!currentUser) {
        window.showNotification('Veuillez vous connecter pour accéder à votre compte', 'error');
        return;
    }
    
    const user = users.find(u => u.id === currentUser.id);
    if (user) {
        document.getElementById('accountName').value = user.name;
        document.getElementById('accountEmail').value = user.email;
        document.getElementById('accountPhone').value = user.phone || '';
        document.getElementById('accountAddress').value = user.address || '';
        
        document.getElementById('accountName').disabled = true;
        document.getElementById('accountEmail').disabled = true;
        document.getElementById('accountPhone').disabled = true;
        document.getElementById('accountAddress').disabled = true;
        
        document.getElementById('editAccountBtn').style.display = 'inline-flex';
        document.getElementById('saveAccountBtn').style.display = 'none';
        document.getElementById('cancelAccountBtn').style.display = 'none';
        
        window.displayUserOrders();
    }
    
    document.getElementById('accountPanel').style.display = 'block';
};

window.closeAccountPanel = function() {
    document.getElementById('accountPanel').style.display = 'none';
};

window.toggleEditAccount = function() {
    document.getElementById('accountPhone').disabled = false;
    document.getElementById('accountAddress').disabled = false;
    
    document.getElementById('editAccountBtn').style.display = 'none';
    document.getElementById('saveAccountBtn').style.display = 'inline-flex';
    document.getElementById('cancelAccountBtn').style.display = 'inline-flex';
};

window.cancelEditAccount = function() {
    const user = users.find(u => u.id === currentUser.id);
    if (user) {
        document.getElementById('accountPhone').value = user.phone || '';
        document.getElementById('accountAddress').value = user.address || '';
    }
    
    document.getElementById('accountPhone').disabled = true;
    document.getElementById('accountAddress').disabled = true;
    
    document.getElementById('editAccountBtn').style.display = 'inline-flex';
    document.getElementById('saveAccountBtn').style.display = 'none';
    document.getElementById('cancelAccountBtn').style.display = 'none';
};

window.saveAccountInfo = function() {
    const phone = document.getElementById('accountPhone').value;
    const address = document.getElementById('accountAddress').value;
    
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
        users[userIndex].phone = phone;
        users[userIndex].address = address;
        
        currentUser.phone = phone;
        currentUser.address = address;
        
        window.saveAllData();
        
        window.showNotification('Informations mises à jour avec succès !', 'success');
        
        document.getElementById('accountPhone').disabled = true;
        document.getElementById('accountAddress').disabled = true;
        
        document.getElementById('editAccountBtn').style.display = 'inline-flex';
        document.getElementById('saveAccountBtn').style.display = 'none';
        document.getElementById('cancelAccountBtn').style.display = 'none';
    }
};

window.displayUserOrders = function() {
    const ordersList = document.getElementById('accountOrdersList');
    if (!ordersList) return;
    
    const userOrders = orders.filter(order => order.customerEmail === currentUser.email);
    
    if (userOrders.length === 0) {
        ordersList.innerHTML = '<p style="text-align: center; padding: 20px;">Aucune commande pour le moment</p>';
        return;
    }
    
    ordersList.innerHTML = '';
    
    userOrders.forEach(order => {
        const statusClass = window.getStatusClass(order.status);
        const statusText = window.getStatusText(order.status);
        
        const orderElement = document.createElement('div');
        orderElement.className = 'account-order';
        orderElement.style.cssText = `
            border: 1px solid var(--light-gray);
            border-radius: var(--radius-sm);
            padding: 15px;
            margin-bottom: 15px;
            background: var(--light);
        `;
        
        orderElement.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <h4 style="margin: 0; color: var(--primary);">Commande #${order.id}</h4>
                <span style="font-weight: 600; color: var(--secondary);">${(order.total || 0).toFixed(2)} $</span>
            </div>
            <div style="margin-bottom: 10px;">
                <strong>Date:</strong> ${order.date || 'Date inconnue'}
            </div>
            <div style="margin-bottom: 10px;">
                <strong>Statut:</strong> <span class="status-badge ${statusClass}">${statusText}</span>
            </div>
            <div>
                <strong>Produits:</strong> ${order.items ? order.items.map(item => `${item.quantity || 0}x ${item.name || 'Produit'}`).join(', ') : 'Aucun produit'}
            </div>
        `;
        
        ordersList.appendChild(orderElement);
    });
};