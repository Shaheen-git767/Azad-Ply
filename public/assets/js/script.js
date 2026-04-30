let cart = JSON.parse(localStorage.getItem('hw_cart')) || [];
let currentUser = JSON.parse(localStorage.getItem('hw_user')) || null;

document.addEventListener('DOMContentLoaded', () => {
    const currentPath = window.location.pathname;

    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath || (currentPath === '/' && link.getAttribute('href') === '/index.html')) {
            link.classList.add('active');
        }
    });

    injectModals();
    updateCartCount();
    updateLoginState();

    if (currentPath === '/products' || currentPath.includes('products.html')) {
        fetchProducts();
    }
});

function injectModals() {
    const modalHTML = `
        <!-- Authentication Modal -->
        <div class="modal-overlay" id="authModal">
            <div class="modal-content large">
                <span class="modal-close" onclick="closeModal('authModal')">&times;</span>
                
                <!-- SIGN IN FORM -->
                <div id="signInContainer">
                    <div class="auth-header">
                        <h2>Login</h2>
                        <p>New customer? <a href="#" class="highlight-link" onclick="toggleAuthMode(event, 'signup')">Create Account &rarr;</a></p>
                    </div>
                    
                    <div class="auth-divider">or login with email</div>
                    
                    <form id="loginForm" onsubmit="handleLogin(event)" autocomplete="off">
                        <div class="form-group">
                            <label>Email Address *</label>
                            <div class="input-icon-wrapper">
                                <span>✉️</span>
                                <input type="email" id="loginEmail" placeholder="your@email.com" required>
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Password *</label>
                            <div class="input-icon-wrapper">
                                <span>🔒</span>
                                <input type="password" id="loginPassword" placeholder="•••••••••" required>
                            </div>
                        </div>
                        
                        <div class="auth-footer">
                            <label><input type="checkbox" id="loginRemember"> Remember me</label>
                            <a href="#" class="gold-text" onclick="handleForgotPassword(event)">Forgot password?</a>
                        </div>
                        
                        <button type="submit" class="btn" style="width: 100%; padding: 1rem;">Login &rarr;</button>
                        <div style="text-align: center; margin-top: 1rem;"><a href="#" class="gold-text" onclick="closeModal('authModal')">&larr; Back to Home</a></div>
                    </form>
                </div>

                <!-- SIGN UP FORM -->
                <div id="signUpContainer" style="display: none;">
                    <div class="auth-header">
                        <h2>Create Account</h2>
                        <p>Already have an account? <a href="#" onclick="toggleAuthMode(event, 'signin')">Login &rarr;</a></p>
                    </div>
                    
                    <div class="auth-divider">or register with email</div>
                    
                    <form id="registerForm" onsubmit="handleRegister(event)" autocomplete="off">
                        <div class="auth-row border-bottom">
                            <div class="form-group">
                                <label>First Name *</label>
                                <input type="text" id="regFirst" placeholder="First name" required style="width:100%; padding:0.75rem; background:#1a1a1a; color:white; border:1px solid #333; border-radius:4px;">
                            </div>
                            <div class="form-group">
                                <label>Last Name *</label>
                                <input type="text" id="regLast" placeholder="Last name" required style="width:100%; padding:0.75rem; background:#1a1a1a; color:white; border:1px solid #333; border-radius:4px;">
                            </div>
                        </div>

                        <div class="form-group">
                            <label>Mobile Number *</label>
                            <div class="input-icon-wrapper">
                                <span>📞</span>
                                <input type="text" id="regPhone" placeholder="10-digit mobile" required>
                            </div>
                        </div>

                        <div class="form-group">
                            <label>Email Address *</label>
                            <div class="input-icon-wrapper">
                                <span>✉️</span>
                                <input type="email" id="regEmail" placeholder="your@email.com" required>
                            </div>
                        </div>

                        <div class="form-group">
                            <label>Account Type</label>
                            <select id="regType" style="width:100%; padding:0.75rem; background:#1a1a1a; color:white; border:1px solid #333; border-radius:4px; outline:none;">
                                <option>Individual / Homeowner</option>
                                <option>Contractor / Business</option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label>Password *</label>
                            <div class="input-icon-wrapper">
                                <span>🔒</span>
                                <input type="password" id="regPassword" placeholder="Minimum 6 characters" required>
                            </div>
                        </div>

                        <div class="form-group">
                            <label>Confirm Password *</label>
                            <div class="input-icon-wrapper">
                                <span>🔒</span>
                                <input type="password" id="regConfirm" placeholder="Re-enter password" required>
                            </div>
                        </div>

                        <div class="terms">
                            <input type="checkbox" required id="regTerms">
                            <label for="regTerms">I agree to the <a href="#" class="gold-text" onclick="event.preventDefault(); openModal('termsModal')">Terms & Conditions</a> of Azad Ply.</label>
                        </div>

                        <button type="submit" class="btn" style="width: 100%; padding: 1rem;">Create My Account &rarr;</button>
                    </form>
                </div>

            </div>
        </div>

        <!-- Cart Modal -->
        <div class="modal-overlay" id="cartModal">
            <div class="modal-content">
                <span class="modal-close" onclick="closeModal('cartModal')">&times;</span>
                <h2 class="section-title">Your Cart</h2>
                <div class="cart-items" id="cartItemsContainer"></div>
                <div class="cart-total" id="cartTotalDisplay">Total: ₹0</div>
                <div style="display:flex; gap:1rem;">
                    <button class="btn" style="flex:1;" onclick="checkoutSystem()">Checkout</button>
                </div>
            </div>
        </div>

        <!-- Terms Modal -->
        <div class="modal-overlay" id="termsModal" style="z-index: 2000;">
            <div class="modal-content">
                <span class="modal-close" onclick="closeModal('termsModal')">&times;</span>
                <h2 class="section-title">Terms & <span>Conditions</span></h2>
                <div style="max-height: 50vh; overflow-y: auto; color: var(--text-muted); line-height: 1.6; padding-right: 10px; margin-bottom: 1.5rem; text-align: left;">
                    <h3 style="color: #fff; margin-bottom: 0.5rem; margin-top: 1rem;">1. Acceptance of Terms</h3>
                    <p>By creating an account, you agree to our standard terms of service for purchasing hardware and plywood materials.</p>
                    <h3 style="color: #fff; margin-bottom: 0.5rem; margin-top: 1rem;">2. Pricing & Availability</h3>
                    <p>All prices are subject to change. Inventory is continuously updated, but discrepancies may occur. Final quotes will be provided upon order confirmation.</p>
                    <h3 style="color: #fff; margin-bottom: 0.5rem; margin-top: 1rem;">3. Privacy Policy</h3>
                    <p>Your personal information (email, phone) is used strictly for order processing and account management. We do not sell your data to third parties.</p>
                    <h3 style="color: #fff; margin-bottom: 0.5rem; margin-top: 1rem;">4. Return Policy</h3>
                    <p>Returns on custom-cut plywood or glass are not accepted. Standard hardware can be returned within 7 days with the original receipt and packaging.</p>
                </div>
                <button class="btn" style="width: 100%;" onclick="closeModal('termsModal')">I Understand</button>
            </div>
        </div>

        <!-- Custom Dialog Modal -->
        <div class="modal-overlay" id="customDialogModal" style="z-index: 3000;">
            <div class="modal-content" style="max-width: 400px; text-align: center;">
                <h2 class="section-title" id="customDialogTitle" style="font-size: 1.5rem; margin-bottom: 1rem;">Title</h2>
                <p id="customDialogMessage" style="color: var(--text-muted); margin-bottom: 1.5rem; line-height: 1.6;">Message goes here</p>
                <div id="customDialogInputContainer" style="display: none; margin-bottom: 1.5rem;">
                    <input type="text" id="customDialogInput" placeholder="Enter here" style="width: 100%; padding: 0.75rem; background: rgba(255,255,255,0.05); color: #fff; border: 1px solid var(--glass-border); border-radius: var(--radius-sm); outline: none;">
                </div>
                <div style="display: flex; gap: 1rem; justify-content: center;">
                    <button class="btn btn-outline" id="customDialogCancel" style="display: none; flex: 1;">Cancel</button>
                    <button class="btn" id="customDialogOk" style="flex: 1;">OK</button>
                </div>
            </div>
        </div>

        <!-- Chatbot Widget -->
        <div class="chat-widget">
            <div class="chat-window" id="chatWindow">
                <div class="chat-header">
                    <h3>💬 Azad Support</h3>
                    <span style="cursor:pointer;" onclick="toggleChat()">&times;</span>
                </div>
                <div class="chat-messages" id="chatMessages">
                    <!-- Dynamic messages -->
                </div>
                <div class="chat-input-area">
                    <input type="text" id="chatInput" placeholder="Type a message..." onkeypress="if(event.key === 'Enter') handleChatMessage()">
                    <button onclick="handleChatMessage()">Send</button>
                </div>
            </div>
            <div class="chat-toggle" onclick="toggleChat()">
                💬
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function updateLoginState() {
    const authContainers = document.querySelectorAll('.navbar div:last-child');

    authContainers.forEach(container => {
        if (currentUser) {
            container.innerHTML = `
                <button class="btn btn-outline" style="cursor: default;">👤 ${currentUser.firstName}</button>
                <button class="btn" onclick="handleLogout()">Logout</button>
                <button class="btn" onclick="openModal('cartModal')">Cart (<span class="cart-count">${cart.reduce((sum, item) => sum + (item.qty || 1), 0)}</span>)</button>
            `;
        } else {
            container.innerHTML = `
                <button class="btn btn-outline" onclick="openModal('authModal')">Login</button>
                <button class="btn" onclick="openModal('cartModal')">Cart (<span class="cart-count">${cart.reduce((sum, item) => sum + (item.qty || 1), 0)}</span>)</button>
            `;
        }
    });
}

function handleLogout() {
    showCustomConfirm("Logout", "Are you sure you want to log out?").then(confirmed => {
        if (confirmed) {
            currentUser = null;
            localStorage.removeItem('hw_user');
            updateLoginState();
            window.location.href = '/';
        }
    });
}

function toggleAuthMode(e, mode) {
    e.preventDefault();
    document.getElementById('signInContainer').style.display = mode === 'signin' ? 'block' : 'none';
    document.getElementById('signUpContainer').style.display = mode === 'signup' ? 'block' : 'none';
}

function openModal(id) {
    document.getElementById(id).classList.add('active');
    if (id === 'cartModal') renderCart();
    if (id === 'authModal') {
        toggleAuthMode({ preventDefault: () => { } }, 'signin');
        
        document.getElementById('loginEmail').value = '';
        document.getElementById('loginPassword').value = '';
        document.getElementById('loginRemember').checked = false;
        
        // Force clear after rendering to defeat aggressive browser autocomplete
        setTimeout(() => {
            document.getElementById('loginEmail').value = '';
            document.getElementById('loginPassword').value = '';
            document.getElementById('regEmail').value = '';
            document.getElementById('regPassword').value = '';
            document.getElementById('regConfirm').value = '';
            document.getElementById('regFirst').value = '';
            document.getElementById('regLast').value = '';
            document.getElementById('regPhone').value = '';
        }, 50);
    }
}


function closeModal(id) {
    document.getElementById(id).classList.remove('active');
}

async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const pwd = document.getElementById('loginPassword').value;
    const remember = document.getElementById('loginRemember').checked;

    const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pwd })
    });
    const data = await res.json();

    if (data.success) {
        if (remember) {
            localStorage.setItem('hw_saved_email', email);
            localStorage.setItem('hw_saved_password', pwd);
        } else {
            localStorage.removeItem('hw_saved_email');
            localStorage.removeItem('hw_saved_password');
        }

        currentUser = data.user;
        localStorage.setItem('hw_user', JSON.stringify(currentUser));
        
        if (currentUser.role === 'admin') {
            window.location.href = '/admin.html';
            return;
        }

        if (data.cartItems && data.cartItems.length > 0) {
            cart = data.cartItems;
            localStorage.setItem('hw_cart', JSON.stringify(cart));
            updateCartCount();
        } else if (cart.length > 0) {
            syncCart();
        }
        updateLoginState();
        closeModal('authModal');
    } else {
        showCustomAlert("Login Failed", data.message);
    }
}

async function handleForgotPassword(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    if (!email) {
        return showCustomAlert("Email Required", "Please enter your email address in the Email field first, then click 'Forgot password?'.");
    }
    
    const btn = e.target;
    const originalText = btn.textContent;
    btn.textContent = 'Sending...';
    btn.style.pointerEvents = 'none';
    
    try {
        const res = await fetch('/api/forgot-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });
        const data = await res.json();
        showCustomAlert("Password Reset", data.message);
    } catch (err) {
        showCustomAlert("Error", "Server error. Could not send password reset email.");
    } finally {
        btn.textContent = originalText;
        btn.style.pointerEvents = 'auto';
    }
}

async function handleRegister(e) {
    e.preventDefault();
    const first = document.getElementById('regFirst').value;
    const last = document.getElementById('regLast').value;
    const phone = document.getElementById('regPhone').value;
    const email = document.getElementById('regEmail').value;
    const accountType = document.getElementById('regType').value;
    const pwd = document.getElementById('regPassword').value;
    const confirm = document.getElementById('regConfirm').value;

    if (pwd !== confirm) return alert("Passwords do not match!");

    const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            firstName: first,
            lastName: last,
            phone: phone,
            email: email,
            accountType: accountType,
            password: pwd
        })
    });

    let data;
    try {
        data = await res.json();
    } catch (err) {
        return alert("Server error. Check terminal or database connection.");
    }

    if (data.success) {
        if (data.user) {
            currentUser = data.user;
            localStorage.setItem('hw_user', JSON.stringify(currentUser));
            if (data.cartItems && data.cartItems.length > 0) {
                cart = data.cartItems;
                localStorage.setItem('hw_cart', JSON.stringify(cart));
                updateCartCount();
            } else if (cart.length > 0) {
                syncCart();
            }
            updateLoginState();
        }
        closeModal('authModal');
        showCustomAlert("Verify Your Email", `<b>Welcome to Azad Ply!</b><br><br>${data.message || 'Account successfully created! Please check your email to verify your account.'}`);
    } else {
        showCustomAlert("Registration Failed", data.message || 'Failed to create account');
    }
}

let globalProducts = [];

async function fetchProducts() {
    const productGrid = document.getElementById('api-products');
    if (!productGrid) return;
    try {
        const response = await fetch('/api/products');
        globalProducts = await response.json();
        renderProductsGrid(globalProducts);
    } catch (error) {
        productGrid.innerHTML = '<p class="gold-text">Failed to load products...</p>';
    }
}

function renderProductsGrid(productsToRender) {
    const productGrid = document.getElementById('api-products');
    if (!productGrid) return;
    productGrid.innerHTML = '';
    productsToRender.forEach(product => {
        const temp = JSON.stringify(product).replace(/"/g, '&quot;');
        const card = document.createElement('div');
        card.className = 'card';

        let unitText = '/unit';
        const cat = (product.category || '').toLowerCase();
        const desc = (product.sizeDescription || '').toLowerCase();
        if (cat.includes('ply') || cat.includes('mica') || cat.includes('board') || cat.includes('laminate')) {
            unitText = '/sheet';
        } else if (desc.includes('sqft') && cat.includes('glass')) {
            unitText = '/sqft';
        } else if (desc.includes('running ft')) {
            unitText = '/ft';
        } else if (desc.includes('set')) {
            unitText = '/set';
        } else if (desc.includes('pair')) {
            unitText = '/pair';
        }

        card.innerHTML = `
            <div class="card-img-container">
              <img src="${product.image}" loading="lazy" alt="${product.name}">
            </div>
            <div class="card-body">
                <p class="card-category">${product.category.toUpperCase()}</p>
                <h3 class="card-title">${product.name}</h3>
                ${product.sizeDescription ? `<p style="font-size:0.85rem; color:#aaa; margin-bottom:0.5rem;">Dimensions: ${product.sizeDescription}</p>` : ''}
                <div class="card-footer">
                    <span class="card-price">₹${product.price.toLocaleString('en-IN')}<span style="font-size: 0.8rem; color: #888; font-weight: normal;"> ${unitText}</span></span>
                    <button class="btn card-btn" onclick="addToCart(${temp})">Add to Cart</button>
                </div>
            </div>
        `;
        productGrid.appendChild(card);
    });
}

function filterProducts(category) {
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => {
        if(btn.textContent.includes(category) || (category === 'All' && btn.textContent === 'All')) {
            btn.style.background = 'var(--primary)';
            btn.style.color = '#000';
        } else {
            btn.style.background = 'var(--glass-bg)';
            btn.style.color = 'var(--text-main)';
        }
    });

    if (category === 'All') {
        renderProductsGrid(globalProducts);
    } else {
        const filtered = globalProducts.filter(p => p.category.includes(category) || p.name.includes(category));
        renderProductsGrid(filtered);
    }
}

function sortProducts() {
    const val = document.getElementById('sortSelect').value;
    let sorted = [...globalProducts];
    
    if (val === 'low') {
        sorted.sort((a, b) => a.price - b.price);
    } else if (val === 'high') {
        sorted.sort((a, b) => b.price - a.price);
    }
    
    renderProductsGrid(sorted);
}

function addToCart(product) {
    const existingItem = cart.find(item => item.name === product.name && item.sizeDescription === product.sizeDescription);
    if (existingItem) {
        existingItem.qty = (existingItem.qty || 1) + 1;
    } else {
        product.qty = 1;
        cart.push(product);
    }
    localStorage.setItem('hw_cart', JSON.stringify(cart));
    updateCartCount();
    syncCart();
    showCustomAlert("Added to Cart", `<b>${product.name}</b> has been added to your cart.`);
}

function updateCartCount() {
    const counts = document.querySelectorAll('.cart-count');
    const totalQty = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
    counts.forEach(c => c.textContent = totalQty);
}

function renderCart() {
    const container = document.getElementById('cartItemsContainer');
    const totalDisplay = document.getElementById('cartTotalDisplay');
    container.innerHTML = '';

    if (cart.length === 0) {
        container.innerHTML = '<p style="text-align:center; color:var(--text-muted);">Your cart is empty.</p>';
        totalDisplay.textContent = 'Total: ₹0';
        return;
    }

    let total = 0;
    cart.forEach((item, index) => {
        const qty = item.qty || 1;
        const itemTotal = item.price * qty;
        total += itemTotal;

        let unitText = '/unit';
        const cat = (item.category || '').toLowerCase();
        const desc = (item.sizeDescription || '').toLowerCase();
        if (cat.includes('ply') || cat.includes('mica') || cat.includes('board') || cat.includes('laminate')) {
            unitText = '/sheet';
        } else if (desc.includes('sqft') && cat.includes('glass')) {
            unitText = '/sqft';
        } else if (desc.includes('running ft')) {
            unitText = '/ft';
        } else if (desc.includes('set')) {
            unitText = '/set';
        } else if (desc.includes('pair')) {
            unitText = '/pair';
        }

        container.innerHTML += `
            <div class="cart-item" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px; padding-bottom:15px; border-bottom:1px solid var(--glass-border);">
                <div style="flex:1; text-align:left;">
                    <div style="font-weight:600; color:var(--primary);">${item.name}</div>
                    ${item.sizeDescription ? `<div style="font-size:0.8rem; color:#aaa;">Dimensions: ${item.sizeDescription}</div>` : ''}
                    <div style="font-size:0.85rem; color:var(--text-muted); margin-top:4px;">₹${item.price} <span style="font-size:0.8rem;">${unitText}</span></div>
                </div>
                <div style="display:flex; align-items:center; gap:10px; background:rgba(255,255,255,0.05); padding:5px 10px; border-radius:20px;">
                    <button onclick="updateQty(${index}, -1)" style="background:none; border:none; color:#fff; cursor:pointer; font-size:1.2rem;">-</button>
                    <span style="min-width:20px; text-align:center; font-weight:bold;">${qty}</span>
                    <button onclick="updateQty(${index}, 1)" style="background:none; border:none; color:#fff; cursor:pointer; font-size:1.2rem;">+</button>
                </div>
                <div style="min-width:70px; text-align:right; font-weight:bold; margin-left:15px;">₹${itemTotal}</div>
            </div>
        `;
    });
    totalDisplay.textContent = `Total: ₹${total}`;
}

function updateQty(index, delta) {
    const item = cart[index];
    item.qty = (item.qty || 1) + delta;
    if (item.qty <= 0) {
        cart.splice(index, 1);
    }
    localStorage.setItem('hw_cart', JSON.stringify(cart));
    updateCartCount();
    renderCart();
    syncCart();
}

function showCustomAlert(title, message) {
    return new Promise((resolve) => {
        document.getElementById('customDialogTitle').innerHTML = title;
        document.getElementById('customDialogMessage').innerHTML = message;
        document.getElementById('customDialogInputContainer').style.display = 'none';
        document.getElementById('customDialogCancel').style.display = 'none';
        
        const modal = document.getElementById('customDialogModal');
        modal.classList.add('active');
        
        const okBtn = document.getElementById('customDialogOk');
        okBtn.onclick = () => {
            modal.classList.remove('active');
            resolve();
        };
    });
}

function showCustomPrompt(title, message, placeholder) {
    return new Promise((resolve) => {
        document.getElementById('customDialogTitle').innerHTML = title;
        document.getElementById('customDialogMessage').innerHTML = message;
        
        const inputContainer = document.getElementById('customDialogInputContainer');
        const input = document.getElementById('customDialogInput');
        inputContainer.style.display = 'block';
        input.placeholder = placeholder || '';
        input.value = '';
        
        const cancelBtn = document.getElementById('customDialogCancel');
        cancelBtn.style.display = 'inline-block';
        
        const modal = document.getElementById('customDialogModal');
        modal.classList.add('active');
        input.focus();
        
        const okBtn = document.getElementById('customDialogOk');
        
        okBtn.onclick = () => {
            modal.classList.remove('active');
            resolve(input.value);
        };
        
        cancelBtn.onclick = () => {
            modal.classList.remove('active');
            resolve(null);
        };
    });
}

function showCustomConfirm(title, message) {
    return new Promise((resolve) => {
        document.getElementById('customDialogTitle').innerHTML = title;
        document.getElementById('customDialogMessage').innerHTML = message;
        document.getElementById('customDialogInputContainer').style.display = 'none';
        
        const cancelBtn = document.getElementById('customDialogCancel');
        cancelBtn.style.display = 'inline-block';
        cancelBtn.textContent = 'No';
        
        const okBtn = document.getElementById('customDialogOk');
        okBtn.textContent = 'Yes';
        
        const modal = document.getElementById('customDialogModal');
        modal.classList.add('active');
        
        okBtn.onclick = () => {
            modal.classList.remove('active');
            okBtn.textContent = 'OK';
            cancelBtn.textContent = 'Cancel';
            resolve(true);
        };
        
        cancelBtn.onclick = () => {
            modal.classList.remove('active');
            okBtn.textContent = 'OK';
            cancelBtn.textContent = 'Cancel';
            resolve(false);
        };
    });
}

async function syncCart() {
    if (!currentUser) return;
    await fetch('/api/cart/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser._id, cart: cart })
    });
}

// Azad Ply Location (Approximate for Chandauli, UP)
const SHOP_LAT = 25.2677;
const SHOP_LON = 83.2667;

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

async function promptForDeliveryInfo() {
    return new Promise(async (resolve) => {
        const address = await showCustomPrompt(
            "Delivery Address",
            "We deliver locally around Nagepur Sakaldiha, Chandauli.<br><br>Please enter your full delivery address:",
            "E.g., 123 Main St, Varanasi"
        );
        if (!address) return resolve({ address: null });
        
        try {
            // Show a temporary loading state or just fetch immediately
            const geocodeUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;
            const response = await fetch(geocodeUrl);
            const data = await response.json();

            if (data && data.length > 0) {
                const lat = parseFloat(data[0].lat);
                const lon = parseFloat(data[0].lon);
                const dist = calculateDistance(SHOP_LAT, SHOP_LON, lat, lon);
                
                if (dist > 50) {
                    const ans = await showCustomConfirm("Distance Warning", `Your typed address is approx ${Math.round(dist)}km away.<br>We prefer local delivery (<50km) for immediate WhatsApp checkout.<br><br>Do you want to submit your order to the system anyway?`);
                    resolve({ address, isLocal: false, proceed: ans });
                } else {
                    resolve({ address, isLocal: true, proceed: true }); // Address is within 50km! Force WhatsApp!
                }
            } else {
                // Geocoding failed to find the exact text
                const ans = await showCustomConfirm("Location Unverified", `We couldn't precisely map "${address}".<br>Are you physically located within 50km of Chandauli?`);
                resolve({ address, isLocal: ans, proceed: true });
            }
        } catch (err) {
            resolve({ address, isLocal: false, proceed: true });
        }
    });
}

async function checkoutSystem() {
    if (!currentUser) {
        showCustomAlert("Login Required", "You must create an account or sign in to complete your order.");
        openModal('authModal');
        return;
    }
    if (cart.length === 0) return showCustomAlert("Empty Cart", "Your cart is empty!");
    
    const info = await promptForDeliveryInfo();
    if (!info.address || !info.proceed) return;

    if (info.isLocal) {
        executeWhatsappFlow(info.address);
    } else {
        executeSystemFlow(info.address);
    }
}

async function checkoutWhatsapp() {
    if (!currentUser) {
        showCustomAlert("Login Required", "You must create an account or sign in to complete your order.");
        openModal('authModal');
        return;
    }
    if (cart.length === 0) return showCustomAlert("Empty Cart", "Your cart is empty!");
    
    const info = await promptForDeliveryInfo();
    if (!info.address || !info.proceed) return;

    if (info.isLocal) {
        executeWhatsappFlow(info.address);
    } else {
        executeSystemFlow(info.address);
    }
}

function executeWhatsappFlow(address) {
    const customerName = currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : "Guest Customer";
    let total = 0; 
    let text = `Hello Azad Ply! I want to place an order.%0A%0A*Payment Mode:* Cash on Delivery%0A*Customer:* ${customerName}%0A*Delivery Address:* ${address}%0A%0A*Items:*%0A`;
    cart.forEach(item => { 
        const qty = item.qty || 1;
        text += `- ${item.name} ${item.sizeDescription ? '('+item.sizeDescription+')' : ''} x${qty} - ₹${item.price * qty}%0A`; 
        total += item.price * qty; 
    });
    text += `%0A*Total Amount: ₹${total}*`;

    let url = `https://wa.me/919555431600?text=${text}`;
    window.location.href = url;

    fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser ? currentUser._id : null, cart: cart, orderMethod: 'WhatsApp' })
    }).then(() => {
        cart = [];
        localStorage.removeItem('hw_cart');
        updateCartCount();
        closeModal('cartModal');
    });
}

function executeSystemFlow(address) {
    fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser ? currentUser._id : null, cart: cart, orderMethod: 'System', address: address })
    }).then(res => res.json()).then(data => {
        if(data.success) {
            cart = [];
            localStorage.removeItem('hw_cart');
            updateCartCount();
            closeModal('cartModal');
            showCustomAlert("Order Submitted", "Since your location is outside the 50km local zone, your order was submitted for manual review. We will contact you shortly!");
        } else {
            showCustomAlert("Order Failed", data.message);
        }
    });
}

// Handle Contact Form Submission
async function handleContactSubmit(event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;

    const btn = event.target.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.textContent = 'Sending...';
    btn.disabled = true;

    try {
        const res = await fetch('/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, subject, message })
        });
        const data = await res.json();
        showCustomAlert("Message Sent", data.message);
        if (data.success) {
            event.target.reset();
        }
    } catch (err) {
        showCustomAlert("Error", 'Server error. Could not send message.');
    } finally {
        btn.textContent = originalText;
        btn.disabled = false;
    }
}

// Chatbot Logic
let chatInitialized = false;

function toggleChat() {
    const chatWindow = document.getElementById('chatWindow');
    chatWindow.classList.toggle('active');
    
    if (!chatInitialized) {
        chatInitialized = true;
        sendBotMenu();
    }
}

function sendBotMenu() {
    appendMessage("Hello! I am the Azad Ply virtual assistant. How can I help you today?", 'bot-msg', [
        "Price of Plywood",
        "Glass Door Types",
        "Custom Furniture",
        "Contact Info"
    ]);
}

function handleChatMessage() {
    const input = document.getElementById('chatInput');
    const msg = input.value.trim();
    if (!msg) return;

    appendMessage(msg, 'user-msg');
    input.value = '';

    setTimeout(() => {
        generateBotResponse(msg);
    }, 500);
}

function handleOptionClick(optionText) {
    appendMessage(optionText, 'user-msg');
    setTimeout(() => {
        generateBotResponse(optionText);
    }, 500);
}

function appendMessage(text, className, options = null) {
    const container = document.getElementById('chatMessages');
    
    const wrapper = document.createElement('div');
    wrapper.style.display = 'flex';
    wrapper.style.flexDirection = 'column';
    if (className === 'user-msg') wrapper.style.alignItems = 'flex-end';

    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-msg ${className}`;
    msgDiv.textContent = text;
    wrapper.appendChild(msgDiv);

    if (options && options.length > 0) {
        const optionsDiv = document.createElement('div');
        optionsDiv.className = 'chat-options';
        options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'chat-option-btn';
            btn.textContent = opt;
            btn.onclick = () => handleOptionClick(opt);
            optionsDiv.appendChild(btn);
        });
        wrapper.appendChild(optionsDiv);
    }

    container.appendChild(wrapper);
    container.scrollTop = container.scrollHeight;
}

function generateBotResponse(msg) {
    const lower = msg.toLowerCase();
    
    if (lower.includes('price of plywood') || (lower.includes('price') && lower.includes('plywood'))) {
        appendMessage("We offer premium Plywood starting at ₹2,450/sheet. We have BWR Grade, Marine Grade, and more. What would you like to do next?", 'bot-msg', ["See Brands", "How to Order", "Main Menu"]);
        return;
    }
    
    if (lower.includes('glass door types') || (lower.includes('glass') && lower.includes('door'))) {
        appendMessage("Yes 👍 We offer aluminium sliding doors, glass partitions, and custom sizes. Want to see designs or get price?", 'bot-msg', ["See Designs", "Get Price", "Main Menu"]);
        return;
    }
    
    if (lower.includes('see designs')) {
        appendMessage("You can view our premium designs on our Products page! We customize them to fit your exact measurements.", 'bot-msg', ["Go to Products", "Main Menu"]);
        return;
    }
    
    if (lower.includes('go to products')) {
        window.location.href = '/products';
        return;
    }
    
    if (lower.includes('get price') || lower.includes('quote')) {
        appendMessage("Custom glass doors typically start at ₹450/sqft depending on the glass thickness and aluminium framing. Would you like a custom quote?", 'bot-msg', ["Request Quote via WhatsApp", "Main Menu"]);
        return;
    }
    
    if (lower.includes('request quote') || lower.includes('whatsapp') || lower.includes('how to order') || lower.includes('request carpenter')) {
        appendMessage("Opening WhatsApp to connect you directly with our team! One moment...", 'bot-msg');
        setTimeout(() => {
            window.open('https://wa.me/919555431600?text=Hello!%20I%20am%20interested%20in%20your%20products/services.', '_blank');
        }, 1000);
        return;
    }
    
    if (lower.includes('see brands')) {
        appendMessage("We carry top brands like Green Ply, Century Ply, Merino, Tesa, and Niva. Check out our Brands section on the homepage!", 'bot-msg', ["Main Menu"]);
        return;
    }
    
    if (lower.includes('custom furniture') || lower.includes('furniture') || lower.includes('carpenter')) {
        appendMessage("We don't sell ready-made furniture, but we provide all premium materials and can send our expert carpenters directly to your location to custom-build whatever you need!", 'bot-msg', ["Request Carpenter", "Main Menu"]);
        return;
    }

    if (lower.includes('contact') || lower.includes('phone') || lower.includes('address')) {
        appendMessage("You can reach us directly at 9555431600 or visit our Contact Us page. We are open Monday to Saturday.", 'bot-msg', ["Main Menu"]);
        return;
    }
    
    if (lower.includes('main menu')) {
        sendBotMenu();
        return;
    }
    
    // Default fallback
    appendMessage("I'm not quite sure about that. Please select one of the following options, or chat with us directly on WhatsApp for specific questions!", 'bot-msg', [
        "Price of Plywood",
        "Glass Door Types",
        "Custom Furniture",
        "Contact Info"
    ]);
}
