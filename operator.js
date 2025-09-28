// =============================================
// FONCTIONS AMÉLIORÉES POUR L'OPÉRATEUR
// =============================================

// Raccourcis pour les variables globales - CORRIGÉ
const { orders, currentUser, ORDER_STATUS } = window;

window.calculateOrderPriority = function(order) {
    const orderDate = new Date(order.date);
    const today = new Date();
    const diffTime = Math.abs(today - orderDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (order.status === 'pending' && diffDays > 2) {
        return 'high';
    } else if (order.total > 100) {
        return 'high';
    } else if (order.status === 'pending' && diffDays > 1) {
        return 'medium';
    } else {
        return 'low';
    }
};

window.getPriorityClass = function(priority) {
    switch(priority) {
        case 'high': return 'priority-high';
        case 'medium': return 'priority-medium';
        case 'low': return 'priority-low';
        default: return 'priority-low';
    }
};

window.getPriorityText = function(priority) {
    switch(priority) {
        case 'high': return 'Haute';
        case 'medium': return 'Moyenne';
        case 'low': return 'Basse';
        default: return 'Basse';
    }
};

window.updateOperatorStats = function() {
    const totalOrdersElem = document.getElementById('operatorTotalOrders');
    const pendingOrdersElem = document.getElementById('operatorPendingOrders');
    const processingOrdersElem = document.getElementById('operatorProcessingOrders');
    const completedOrdersElem = document.getElementById('operatorCompletedOrders');
    
    if (totalOrdersElem) totalOrdersElem.textContent = orders.length;
    if (pendingOrdersElem) pendingOrdersElem.textContent = orders.filter(o => o.status === ORDER_STATUS.PENDING).length;
    if (processingOrdersElem) processingOrdersElem.textContent = orders.filter(o => o.status === ORDER_STATUS.PROCESSING).length;
    if (completedOrdersElem) completedOrdersElem.textContent = orders.filter(o => o.status === ORDER_STATUS.DELIVERED).length;
    
    const priorityOrders = orders.filter(o => window.calculateOrderPriority(o) === 'high' && o.status !== 'delivered' && o.status !== 'cancelled');
    document.getElementById('priorityOrders').textContent = priorityOrders.length;
    
    const lateOrders = orders.filter(o => {
        const orderDate = new Date(o.date);
        const today = new Date();
        const diffTime = Math.abs(today - orderDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return o.status === 'pending' && diffDays > 2;
    });
    document.getElementById('lateOrders').textContent = lateOrders.length;
};

window.displayOperatorOrders = function(statusFilter = 'all', priorityFilter = 'all', searchTerm = '') {
    const ordersList = document.getElementById('operatorOrdersList');
    if (!ordersList) {
        console.error('Element operatorOrdersList non trouvé');
        return;
    }
    
    ordersList.innerHTML = '';
    
    let filteredOrders = [...orders];
    
    if (statusFilter !== 'all') {
        filteredOrders = filteredOrders.filter(order => order.status === statusFilter);
    }
    
    if (priorityFilter !== 'all') {
        filteredOrders = filteredOrders.filter(order => window.calculateOrderPriority(order) === priorityFilter);
    }
    
    if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filteredOrders = filteredOrders.filter(order => 
            order.id.toString().includes(term) ||
            (order.customerName && order.customerName.toLowerCase().includes(term)) ||
            (order.customerEmail && order.customerEmail.toLowerCase().includes(term)) ||
            (order.items && order.items.some(item => item.name && item.name.toLowerCase().includes(term)))
        );
    }
    
    filteredOrders.sort((a, b) => {
        const priorityA = window.calculateOrderPriority(a);
        const priorityB = window.calculateOrderPriority(b);
        
        if (priorityA !== priorityB) {
            const priorityOrder = { high: 1, medium: 2, low: 3 };
            return priorityOrder[priorityA] - priorityOrder[priorityB];
        }
        
        return new Date(b.date) - new Date(a.date);
    });
    
    if (filteredOrders.length === 0) {
        ordersList.innerHTML = `
            <tr>
                <td colspan="9" style="text-align: center; padding: 20px;">
                    Aucune commande trouvée
                </td>
            </tr>
        `;
        return;
    }
    
    filteredOrders.forEach(order => {
        const statusClass = window.getStatusClass(order.status);
        const statusText = window.getStatusText(order.status);
        const priority = window.calculateOrderPriority(order);
        const priorityClass = window.getPriorityClass(priority);
        const priorityText = window.getPriorityText(priority);
        
        const row = document.createElement('tr');
        if (priority === 'high') row.classList.add('urgent-order');
        else if (priority === 'medium') row.classList.add('priority-order');
        
        row.innerHTML = `
            <td>
                <input type="checkbox" class="order-checkbox" value="${order.id}" onchange="updateBulkActions()">
            </td>
            <td><strong>#${order.id}</strong></td>
            <td>
                <div><strong>${order.customerName || 'Non spécifié'}</strong></div>
                <small>${order.customerEmail || ''}</small>
                ${order.customerPhone ? `<div><small><i class="fas fa-phone"></i> ${order.customerPhone}</small></div>` : ''}
            </td>
            <td>
                <div style="max-height: 60px; overflow-y: auto;">
                    ${order.items ? order.items.map(item => 
                        `<div>${item.quantity || 0}x ${item.name || 'Produit'}</div>`
                    ).join('') : 'Aucun produit'}
                </div>
            </td>
            <td><strong>${(order.total || 0).toFixed(2)} $</strong></td>
            <td>
                <div>${order.date || 'Date inconnue'}</div>
                <small>${window.getDaysAgo(order.date)}</small>
            </td>
            <td>
                <span class="order-priority ${priorityClass}">${priorityText}</span>
            </td>
            <td><span class="status-badge ${statusClass}">${statusText}</span></td>
            <td>
                <div class="order-actions-enhanced">
                    ${order.status === ORDER_STATUS.PENDING ? `
                        <button class="admin-btn info" onclick="changeOrderStatus(${order.id}, 'processing')" title="Commencer le traitement">
                            <i class="fas fa-play"></i> Traiter
                        </button>
                    ` : ''}
                    ${order.status === ORDER_STATUS.PROCESSING ? `
                        <button class="admin-btn success" onclick="changeOrderStatus(${order.id}, 'shipped')" title="Marquer comme expédiée">
                            <i class="fas fa-shipping-fast"></i> Expédier
                        </button>
                    ` : ''}
                    ${order.status === ORDER_STATUS.SHIPPED ? `
                        <button class="admin-btn secondary" onclick="changeOrderStatus(${order.id}, 'delivered')" title="Marquer comme livrée">
                            <i class="fas fa-check-circle"></i> Livrée
                        </button>
                    ` : ''}
                    <button class="admin-btn secondary" onclick="viewEnhancedOrderDetails(${order.id})" title="Voir les détails">
                        <i class="fas fa-eye"></i> Détails
                    </button>
                    ${order.status !== ORDER_STATUS.DELIVERED && order.status !== ORDER_STATUS.CANCELLED ? `
                        <button class="admin-btn danger" onclick="changeOrderStatus(${order.id}, 'cancelled')" title="Annuler la commande">
                            <i class="fas fa-times"></i> Annuler
                        </button>
                    ` : ''}
                </div>
            </td>
        `;
        ordersList.appendChild(row);
    });
};

window.getDaysAgo = function(dateString) {
    if (!dateString) return '';
    
    const orderDate = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(today - orderDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Aujourd'hui";
    if (diffDays === 1) return "Il y a 1 jour";
    return `Il y a ${diffDays} jours`;
};

window.filterOrdersTable = function() {
    const statusFilter = document.getElementById('statusFilter').value;
    const priorityFilter = document.getElementById('priorityFilter').value;
    const searchTerm = document.getElementById('orderSearch').value;
    
    window.displayOperatorOrders(statusFilter, priorityFilter, searchTerm);
};

window.toggleSelectAllOrders = function() {
    const selectAll = document.getElementById('selectAllOrders').checked;
    const checkboxes = document.querySelectorAll('.order-checkbox');
    
    checkboxes.forEach(checkbox => {
        checkbox.checked = selectAll;
    });
    
    window.updateBulkActions();
};

window.updateBulkActions = function() {
    const selectedOrders = document.querySelectorAll('.order-checkbox:checked');
    const bulkProcessBtn = document.getElementById('bulkProcessBtn');
    const bulkShipBtn = document.getElementById('bulkShipBtn');
    
    if (selectedOrders.length > 0) {
        bulkProcessBtn.disabled = false;
        bulkShipBtn.disabled = false;
    } else {
        bulkProcessBtn.disabled = true;
        bulkShipBtn.disabled = true;
    }
};

window.bulkUpdateStatus = function(newStatus) {
    const selectedOrders = document.querySelectorAll('.order-checkbox:checked');
    
    if (selectedOrders.length === 0) {
        window.showNotification('Aucune commande sélectionnée', 'warning');
        return;
    }
    
    if (!confirm(`Êtes-vous sûr de vouloir mettre à jour ${selectedOrders.length} commande(s) vers le statut "${window.getStatusText(newStatus)}" ?`)) {
        return;
    }
    
    selectedOrders.forEach(checkbox => {
        const orderId = parseInt(checkbox.value);
        window.changeOrderStatus(orderId, newStatus, true);
    });
    
    document.getElementById('selectAllOrders').checked = false;
    window.updateBulkActions();
    
    window.showNotification(`${selectedOrders.length} commande(s) mises à jour avec succès`, 'success');
};

window.processPendingOrders = function() {
    const pendingOrders = orders.filter(o => o.status === ORDER_STATUS.PENDING);
    
    if (pendingOrders.length === 0) {
        window.showNotification('Aucune commande en attente à traiter', 'info');
        return;
    }
    
    if (!confirm(`Êtes-vous sûr de vouloir traiter ${pendingOrders.length} commande(s) en attente ?`)) {
        return;
    }
    
    pendingOrders.forEach(order => {
        window.changeOrderStatus(order.id, ORDER_STATUS.PROCESSING, true);
    });
    
    window.showNotification(`${pendingOrders.length} commande(s) en attente traitées avec succès`, 'success');
};

window.viewEnhancedOrderDetails = function(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    
    const priority = window.calculateOrderPriority(order);
    const priorityClass = window.getPriorityClass(priority);
    const priorityText = window.getPriorityText(priority);
    
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content order-details-modal';
    modalContent.innerHTML = `
        <div class="modal-header">
            <h2><i class="fas fa-file-invoice"></i> Détails de la commande #${order.id}</h2>
            <button class="close-modal" onclick="closeCustomAlert()">&times;</button>
        </div>
        
        <div class="order-info-grid">
            <div>
                <h3>Informations client</h3>
                <div class="customer-info-card">
                    <p><strong>Nom:</strong> ${order.customerName || 'Non spécifié'}</p>
                    <p><strong>Email:</strong> ${order.customerEmail || 'Non spécifié'}</p>
                    ${order.customerPhone ? `<p><strong>Téléphone:</strong> ${order.customerPhone}</p>` : ''}
                    ${order.customerAddress ? `<p><strong>Adresse:</strong> ${order.customerAddress}</p>` : ''}
                    <div class="customer-contact">
                        ${order.customerEmail ? `<div class="contact-item"><i class="fas fa-envelope"></i> ${order.customerEmail}</div>` : ''}
                        ${order.customerPhone ? `<div class="contact-item"><i class="fas fa-phone"></i> ${order.customerPhone}</div>` : ''}
                    </div>
                </div>
            </div>
            
            <div>
                <h3>Informations commande</h3>
                <div class="customer-info-card">
                    <p><strong>Date:</strong> ${order.date || 'Date inconnue'} (${window.getDaysAgo(order.date)})</p>
                    <p><strong>Statut:</strong> <span class="status-badge ${window.getStatusClass(order.status)}">${window.getStatusText(order.status)}</span></p>
                    <p><strong>Priorité:</strong> <span class="order-priority ${priorityClass}">${priorityText}</span></p>
                    <p><strong>Total:</strong> <strong style="color: var(--primary);">${(order.total || 0).toFixed(2)} $</strong></p>
                </div>
            </div>
        </div>
        
        <div>
            <h3>Produits commandés</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                <thead>
                    <tr style="border-bottom: 2px solid var(--light-gray);">
                        <th style="padding: 12px; text-align: left;">Produit</th>
                        <th style="padding: 12px; text-align: center;">Quantité</th>
                        <th style="padding: 12px; text-align: right;">Prix unitaire</th>
                        <th style="padding: 12px; text-align: right;">Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${order.items ? order.items.map(item => `
                        <tr style="border-bottom: 1px solid var(--light-gray);">
                            <td style="padding: 12px;">${item.name || 'Produit'}</td>
                            <td style="padding: 12px; text-align: center;">${item.quantity || 0}</td>
                            <td style="padding: 12px; text-align: right;">${(item.price || 0).toFixed(2)} $</td>
                            <td style="padding: 12px; text-align: right;">${((item.price || 0) * (item.quantity || 0)).toFixed(2)} $</td>
                        </tr>
                    `).join('') : '<tr><td colspan="4" style="padding: 12px; text-align: center;">Aucun produit</td></tr>'}
                </tbody>
            </table>
            
            <div class="order-summary">
                <div class="summary-row">
                    <span>Sous-total:</span>
                    <span>${(order.total || 0).toFixed(2)} $</span>
                </div>
                <div class="summary-row">
                    <span>Livraison:</span>
                    <span>Gratuite</span>
                </div>
                <div class="summary-row">
                    <span>Total:</span>
                    <span>${(order.total || 0).toFixed(2)} $</span>
                </div>
            </div>
        </div>
        
        ${order.statusHistory ? `
        <div class="order-timeline">
            <h3>Historique des statuts</h3>
            ${order.statusHistory.map(history => `
                <div class="timeline-item">
                    <div class="timeline-icon">
                        <i class="fas fa-${window.getStatusIcon(history.status)}"></i>
                    </div>
                    <div class="timeline-content">
                        <strong>${window.getStatusText(history.status)}</strong>
                        <div class="timeline-date">
                            ${new Date(history.date).toLocaleString()} - Par: ${history.changedBy || 'Système'}
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
        ` : ''}
        
        <div class="operator-notes">
            <h4>Notes opérateur</h4>
            <textarea id="operatorNotes" placeholder="Ajouter une note pour cette commande..." style="width: 100%; padding: 10px; border: 1px solid var(--light-gray); border-radius: var(--radius-sm); margin-bottom: 10px;"></textarea>
            <button class="admin-btn primary" onclick="saveOperatorNote(${order.id})">
                <i class="fas fa-save"></i> Enregistrer la note
            </button>
        </div>
        
        <div style="display: flex; gap: 10px; margin-top: 20px; flex-wrap: wrap;">
            ${order.status !== ORDER_STATUS.DELIVERED && order.status !== ORDER_STATUS.CANCELLED ? `
                <button class="admin-btn info" onclick="changeOrderStatus(${order.id}, 'processing')">
                    <i class="fas fa-cog"></i> Marquer en traitement
                </button>
                <button class="admin-btn success" onclick="changeOrderStatus(${order.id}, 'shipped')">
                    <i class="fas fa-shipping-fast"></i> Marquer expédiée
                </button>
                <button class="admin-btn secondary" onclick="changeOrderStatus(${order.id}, 'delivered')">
                    <i class="fas fa-check-circle"></i> Marquer livrée
                </button>
                <button class="admin-btn danger" onclick="changeOrderStatus(${order.id}, 'cancelled')">
                    <i class="fas fa-times"></i> Annuler
                </button>
            ` : ''}
            <button class="admin-btn secondary" onclick="closeCustomAlert()">
                <i class="fas fa-times"></i> Fermer
            </button>
        </div>
    `;
    
    window.showCustomAlert(modalContent);
};

window.getStatusIcon = function(status) {
    switch(status) {
        case ORDER_STATUS.PENDING: return 'clock';
        case ORDER_STATUS.PROCESSING: return 'cog';
        case ORDER_STATUS.SHIPPED: return 'shipping-fast';
        case ORDER_STATUS.DELIVERED: return 'check-circle';
        case ORDER_STATUS.CANCELLED: return 'times';
        default: return 'question';
    }
};

window.saveOperatorNote = function(orderId) {
    const noteText = document.getElementById('operatorNotes').value;
    if (!noteText.trim()) {
        window.showNotification('Veuillez saisir une note', 'warning');
        return;
    }
    
    const orderIndex = orders.findIndex(o => o.id === orderId);
    if (orderIndex !== -1) {
        if (!orders[orderIndex].operatorNotes) {
            orders[orderIndex].operatorNotes = [];
        }
        
        orders[orderIndex].operatorNotes.push({
            text: noteText,
            date: new Date().toISOString(),
            operator: currentUser ? currentUser.name : 'Opérateur'
        });
        
        window.saveAllData();
        window.showNotification('Note enregistrée avec succès', 'success');
        document.getElementById('operatorNotes').value = '';
    }
};

window.exportOrdersCSV = function() {
    const headers = ['ID', 'Client', 'Email', 'Téléphone', 'Produits', 'Total', 'Date', 'Statut', 'Priorité'];
    const csvData = orders.map(order => [
        order.id,
        order.customerName || '',
        order.customerEmail || '',
        order.customerPhone || '',
        order.items ? order.items.map(item => `${item.quantity}x ${item.name}`).join('; ') : '',
        order.total || 0,
        order.date || '',
        window.getStatusText(order.status),
        window.getPriorityText(window.calculateOrderPriority(order))
    ]);
    
    const csvContent = [headers, ...csvData].map(row => 
        row.map(field => `"${field}"`).join(',')
    ).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `commandes_ldorganics_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    window.showNotification('Export CSV généré avec succès', 'success');
};

window.showOrderStatistics = function() {
    const pendingCount = orders.filter(o => o.status === ORDER_STATUS.PENDING).length;
    const processingCount = orders.filter(o => o.status === ORDER_STATUS.PROCESSING).length;
    const shippedCount = orders.filter(o => o.status === ORDER_STATUS.SHIPPED).length;
    const deliveredCount = orders.filter(o => o.status === ORDER_STATUS.DELIVERED).length;
    const cancelledCount = orders.filter(o => o.status === ORDER_STATUS.CANCELLED).length;
    
    const totalRevenue = orders.filter(o => o.status === ORDER_STATUS.DELIVERED)
                              .reduce((sum, order) => sum + (order.total || 0), 0);
    
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    modalContent.innerHTML = `
        <div class="modal-header">
            <h2><i class="fas fa-chart-bar"></i> Statistiques des Commandes</h2>
            <button class="close-modal" onclick="closeCustomAlert()">&times;</button>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
            <div class="stat-card">
                <div class="stat-value">${orders.length}</div>
                <div class="stat-label">Total Commandes</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${totalRevenue.toFixed(2)} $</div>
                <div class="stat-label">Chiffre d'Affaires</div>
            </div>
        </div>
        
        <div style="margin-bottom: 20px;">
            <h3>Répartition par statut</h3>
            <div style="background: var(--light); padding: 15px; border-radius: var(--radius);">
                <div style="margin-bottom: 10px;">
                    <span style="display: inline-block; width: 100px;">En attente:</span>
                    <span style="font-weight: bold;">${pendingCount}</span>
                </div>
                <div style="margin-bottom: 10px;">
                    <span style="display: inline-block; width: 100px;">En cours:</span>
                    <span style="font-weight: bold;">${processingCount}</span>
                </div>
                <div style="margin-bottom: 10px;">
                    <span style="display: inline-block; width: 100px;">Expédiées:</span>
                    <span style="font-weight: bold;">${shippedCount}</span>
                </div>
                <div style="margin-bottom: 10px;">
                    <span style="display: inline-block; width: 100px;">Livrées:</span>
                    <span style="font-weight: bold;">${deliveredCount}</span>
                </div>
                <div>
                    <span style="display: inline-block; width: 100px;">Annulées:</span>
                    <span style="font-weight: bold;">${cancelledCount}</span>
                </div>
            </div>
        </div>
        
        <div style="text-align: center; margin-top: 20px;">
            <button class="admin-btn secondary" onclick="closeCustomAlert()">
                <i class="fas fa-times"></i> Fermer
            </button>
        </div>
    `;
    
    window.showCustomAlert(modalContent);
};

window.changeOrderStatus = function(orderId, newStatus, isBulk = false) {
    const orderIndex = orders.findIndex(o => o.id === orderId);
    if (orderIndex !== -1) {
        const oldStatus = orders[orderIndex].status;
        orders[orderIndex].status = newStatus;
        
        if (!orders[orderIndex].statusHistory) {
            orders[orderIndex].statusHistory = [];
        }
        orders[orderIndex].statusHistory.push({
            status: newStatus,
            date: new Date().toISOString(),
            changedBy: currentUser ? currentUser.name : 'Système'
        });
        
        if (!isBulk && (newStatus === ORDER_STATUS.CANCELLED || oldStatus === ORDER_STATUS.PENDING)) {
            if (!orders[orderIndex].operatorNotes) {
                orders[orderIndex].operatorNotes = [];
            }
            
            let noteText = '';
            if (newStatus === ORDER_STATUS.CANCELLED) {
                noteText = `Commande annulée par l'opérateur`;
            } else if (newStatus === ORDER_STATUS.PROCESSING && oldStatus === ORDER_STATUS.PENDING) {
                noteText = `Commande prise en traitement`;
            }
            
            if (noteText) {
                orders[orderIndex].operatorNotes.push({
                    text: noteText,
                    date: new Date().toISOString(),
                    operator: currentUser ? currentUser.name : 'Opérateur'
                });
            }
        }
        
        window.saveAllData();
        
        if (document.getElementById('operatorPanel').style.display === 'block') {
            window.updateOperatorStats();
            window.filterOrdersTable();
        }
        
        if (!isBulk) {
            window.showNotification(`Statut de la commande #${orderId} changé de "${window.getStatusText(oldStatus)}" à "${window.getStatusText(newStatus)}"`, 'success');
        }
    }
};

window.openOperatorPanel = function() {
    if (!window.isOperator && !window.isAdmin) {
        window.showNotification('Accès réservé aux opérateurs', 'error');
        return;
    }
    
    document.getElementById('operatorPanel').style.display = 'block';
    window.updateOperatorStats();
    window.displayOperatorOrders('all', 'all', '');
    
    document.getElementById('orderSearch').value = '';
    document.getElementById('statusFilter').value = 'all';
    document.getElementById('priorityFilter').value = 'all';
    document.getElementById('selectAllOrders').checked = false;
    window.updateBulkActions();
};

window.closeOperatorPanel = function() {
    document.getElementById('operatorPanel').style.display = 'none';
};