let adminUser = null;

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    const userStr = localStorage.getItem('hw_user');
    if (!userStr) return window.location.href = '/';
    
    const user = JSON.parse(userStr);
    if (user.role !== 'admin') {
        alert("Access Denied. Admins only.");
        window.location.href = '/';
        return;
    }
    
    adminUser = user;
    document.getElementById('appLayout').style.display = 'flex';
    loadDashboard();
});

function getHeaders() {
    return {
        'Content-Type': 'application/json',
        'x-user-id': adminUser._id
    };
}

// Navigation
function switchTab(tabId) {
    document.querySelectorAll('.section').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    
    document.getElementById(tabId).classList.add('active');
    event.currentTarget.classList.add('active');

    if(tabId === 'dashboard') loadDashboard();
    if(tabId === 'products') loadProducts();
    if(tabId === 'orders') loadOrders();
    if(tabId === 'customers') loadCustomers();
}

function logoutAdmin() {
    localStorage.removeItem('hw_user');
    localStorage.removeItem('hw_cart');
    window.location.href = '/';
}

function closeModal(id) {
    document.getElementById(id).classList.remove('active');
}

// Data Loaders
async function loadDashboard() {
    const res = await fetch('/api/admin/stats', { headers: getHeaders() });
    const data = await res.json();
    if (data.success) {
        document.getElementById('statTotalProducts').textContent = data.stats.totalProducts;
        document.getElementById('statTotalOrders').textContent = data.stats.totalOrders;
        
        const tbody = document.getElementById('recentOrdersBody');
        tbody.innerHTML = '';
        data.recentOrders.forEach(o => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${o.user ? o.user.firstName + ' ' + o.user.lastName : 'Guest'}</td>
                <td>₹${o.totalAmount}</td>
                <td><span class="badge ${o.status === 'Done' ? 'badge-done' : 'badge-pending'}">${o.status}</span></td>
            `;
            tbody.appendChild(tr);
        });
    }
}

async function loadProducts() {
    const res = await fetch('/api/products');
    const products = await res.json();
    
    const tbody = document.getElementById('productsBody');
    tbody.innerHTML = '';
    products.forEach(p => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><img src="${p.image}" alt="${p.name}" style="width:50px; height:50px; object-fit:cover; border-radius:4px;"></td>
            <td>${p.name}</td>
            <td>${p.category}</td>
            <td>₹${p.price}</td>
            <td>
                <button class="btn-sm btn-edit" onclick="editProduct('${p.id}', '${p.name.replace(/'/g, "\\'")}', '${p.category}', ${p.price}, '${p.image}')">✏️ Edit</button>
                <button class="btn-sm btn-danger" onclick="deleteProduct('${p.id}')">❌ Delete</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

async function loadOrders() {
    const res = await fetch('/api/admin/orders', { headers: getHeaders() });
    const data = await res.json();
    if (data.success) {
        const tbody = document.getElementById('ordersBody');
        tbody.innerHTML = '';
        data.orders.forEach(o => {
            const date = new Date(o.createdAt).toLocaleDateString();
            const customerName = o.user ? `${o.user.firstName} ${o.user.lastName}` : 'Guest';
            const phone = o.user ? o.user.phone : 'N/A';
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${date}</td>
                <td>${customerName}</td>
                <td>${phone}</td>
                <td>₹${o.totalAmount}</td>
                <td><span class="badge ${o.status === 'Done' ? 'badge-done' : 'badge-pending'}">${o.status}</span></td>
                <td>
                    <select onchange="updateOrderStatus('${o._id}', this.value)" style="padding:0.3rem; background:rgba(0,0,0,0.5); color:#fff; border:1px solid #c99f69;">
                        <option value="Pending" ${o.status === 'Pending' || o.status === 'Pending Validation' ? 'selected' : ''}>Pending</option>
                        <option value="Contacted" ${o.status === 'Contacted' ? 'selected' : ''}>Contacted</option>
                        <option value="Done" ${o.status === 'Done' ? 'selected' : ''}>Done</option>
                    </select>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }
}

async function loadCustomers() {
    const res = await fetch('/api/admin/customers', { headers: getHeaders() });
    const data = await res.json();
    if (data.success) {
        const tbody = document.getElementById('customersBody');
        tbody.innerHTML = '';
        data.customers.forEach(c => {
            const date = new Date(c.createdAt).toLocaleDateString();
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${c.firstName} ${c.lastName}</td>
                <td>${c.email}</td>
                <td>${c.phone}</td>
                <td>${date}</td>
                <td>
                    <button class="btn-sm btn-danger" onclick="deleteCustomer('${c._id}')">❌ Delete</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }
}

async function deleteCustomer(id) {
    if (!confirm("Are you sure you want to delete this user account?")) return;
    try {
        const res = await fetch(`/api/admin/customers/${id}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        const data = await res.json();
        if (data.success) {
            loadCustomers();
        }
    } catch(err) {
        alert("Error deleting customer.");
    }
}

// Product Actions
function openProductModal() {
    document.getElementById('modalTitle').textContent = 'Add Product';
    document.getElementById('productForm').reset();
    document.getElementById('prodId').value = '';
    document.getElementById('productModal').classList.add('active');
}

function editProduct(id, name, category, price, image) {
    document.getElementById('modalTitle').textContent = 'Edit Product';
    document.getElementById('prodId').value = id;
    document.getElementById('prodName').value = name;
    document.getElementById('prodCategory').value = category;
    document.getElementById('prodPrice').value = price;
    document.getElementById('prodImage').value = image;
    document.getElementById('productModal').classList.add('active');
}

document.getElementById('productForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('prodId').value;
    const body = {
        name: document.getElementById('prodName').value,
        category: document.getElementById('prodCategory').value,
        price: Number(document.getElementById('prodPrice').value),
        image: document.getElementById('prodImage').value
    };

    const url = id ? `/api/admin/products/${id}` : '/api/admin/products';
    const method = id ? 'PUT' : 'POST';

    try {
        const res = await fetch(url, {
            method,
            headers: getHeaders(),
            body: JSON.stringify(body)
        });
        const data = await res.json();
        if (data.success) {
            closeModal('productModal');
            loadProducts();
        } else {
            alert(data.message);
        }
    } catch (err) {
        alert("Error saving product.");
    }
});

async function deleteProduct(id) {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
        const res = await fetch(`/api/admin/products/${id}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        const data = await res.json();
        if (data.success) {
            loadProducts();
        }
    } catch(err) {
        alert("Error deleting product.");
    }
}

// Order Actions
async function updateOrderStatus(orderId, status) {
    try {
        await fetch(`/api/admin/orders/${orderId}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify({ status })
        });
        loadOrders(); // refresh
    } catch(err) {
        alert("Failed to update status");
    }
}
