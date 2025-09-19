// Restaurant Management Dashboard JavaScript
class RestaurantDashboard {
    constructor() {
        this.restaurants = [];
        this.currentSection = 'restaurants';
        
        this.init();
    }

    async init() {
        this.setupEventListeners();
        this.loadSettings();
        this.loadRestaurantsFromStorage();
    }

    setupEventListeners() {

        // Refresh button
        document.getElementById('refreshBtn').addEventListener('click', () => {
            this.loadRestaurantsFromStorage();
            this.showToast('تم تحديث البيانات', 'success');
        });

        // Add restaurant button
        document.getElementById('addRestaurantBtn').addEventListener('click', () => {
            this.openRestaurantModal();
        });

        // Modal close button
        document.getElementById('closeModal').addEventListener('click', () => {
            this.closeModal();
        });

        // Search input
        document.getElementById('zoneSearchInput').addEventListener('input', (e) => {
            this.searchDeliveryZones(e.target.value);
        });

        // Settings checkboxes
        document.getElementById('compactView').addEventListener('change', (e) => {
            this.toggleCompactView(e.target.checked);
        });

        document.getElementById('showDeliveryPrices').addEventListener('change', (e) => {
            this.toggleDeliveryPrices(e.target.checked);
        });

        // Close modal on outside click
        document.getElementById('restaurantModal').addEventListener('click', (e) => {
            if (e.target.id === 'restaurantModal') {
                this.closeModal();
            }
        });

        // Modal buttons (these will be added dynamically)
        this.setupModalEventListeners();
    }

    switchSection(section) {
        // Update navigation buttons
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-section="${section}"]`).classList.add('active');

        // Update content sections
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(`${section}-section`).classList.add('active');

        this.currentSection = section;

        // Load section-specific data
        if (section === 'restaurants') {
            this.renderRestaurants();
        } else if (section === 'search') {
            this.clearSearchResults();
        }
    }

    loadRestaurantsFromStorage() {
        const savedRestaurants = localStorage.getItem(CONFIG.STORAGE.RESTAURANTS_KEY);
        if (savedRestaurants) {
            this.restaurants = JSON.parse(savedRestaurants);
        } else {
            // Load default sample data if no saved data exists
            this.restaurants = [
                {
                    id: 1,
                    name: "UN PIZZA",
                    phone: "Soon",
                    hours: "السبت - الخميس: 9:00 ص - 12:30 م",
                    hours: "الجمعة : 1:00 ص - 2:00 م",
                    deliveryZones: [
                        { zone: "جبل الحسين", price: "1 دينار", deliveryTime: "25-35 دقيقة" },
                        { zone: "العبدلي", price: "2 دينار", deliveryTime: "30-40 دقيقة" },
                        { zone: "خلدا", price: "3 دينار", deliveryTime: "35-45 دقيقة" }
                    ],
                    address: "خلدا، عمان",
                    cuisine: "بيتزا"
                },
                {
                    id: 2,
                    name:  "جوسي وكرنشي - أبو نصير",
                    phone: "+962 79 811 2919",
                    hours: "السبت - الخميس: 9:00 ص - 12:30 م",
                    hours: "الجمعة : 1:00 ص - 2:00 م",
                    deliveryZones: [
                        { zone: "جبل الحسين", price: "1 دينار", deliveryTime: "25-35 دقيقة" },
                        { zone: "العبدلي", price: "2 دينار", deliveryTime: "30-40 دقيقة" },
                        { zone: "خلدا", price: "3 دينار", deliveryTime: "35-45 دقيقة" },
                        { zone: "الوحدات", price: "4 دينار", deliveryTime: "45-50 دقيقة" }
                    ],
                    address: "أبو نصير، عمان",
                    cuisine: "سناكات ايطالية"
                },
                {
                    id: 3,
                    name:    "جوسي وكرنشي - خلدا",
                    phone: "+962 79 202 2031",
                    hours: "السبت - الخميس: 9:00 ص - 12:30 م",
                    hours: "الجمعة : 1:00 ص - 2:00 م",
                    deliveryZones: [
                        { zone: "جبل الحسين", price: "1 دينار", deliveryTime: "25-35 دقيقة" },
                        { zone: "العبدلي", price: "2 دينار", deliveryTime: "30-40 دقيقة" },
                        { zone: "خلدا", price: "3 دينار", deliveryTime: "35-45 دقيقة" }
                    ],
                    address: "شارع العليا، عمان",
                    cuisine: "سناكات ايطالية"
                }                
            ];
            this.saveRestaurantsToStorage();
        }
        this.renderRestaurants();
    }

    saveRestaurantsToStorage() {
        localStorage.setItem(CONFIG.STORAGE.RESTAURANTS_KEY, JSON.stringify(this.restaurants));
        this.updateSystemInfo();
    }

    updateSystemInfo() {
        const restaurantCount = document.getElementById('restaurantCount');
        const lastUpdate = document.getElementById('lastUpdate');
        
        if (restaurantCount) {
            restaurantCount.textContent = this.restaurants.length;
        }
        
        if (lastUpdate) {
            const now = new Date();
            const timeString = now.toLocaleString('ar-SA', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
            lastUpdate.textContent = timeString;
        }
    }

    renderRestaurants() {
        const grid = document.getElementById('restaurantsGrid');
        if (!grid) return;

        grid.innerHTML = '';

        this.restaurants.forEach(restaurant => {
            const card = this.createRestaurantCard(restaurant);
            grid.appendChild(card);
        });
    }

    createRestaurantCard(restaurant) {
        const card = document.createElement('div');
        card.className = 'restaurant-card fade-in';
        card.addEventListener('click', () => this.openRestaurantDetails(restaurant));


        card.innerHTML = `
            <div class="restaurant-card-header">
                <div class="restaurant-title-section">
                    <h3 class="restaurant-name">${restaurant.name}</h3>
                </div>
                <div class="cuisine-badge">
                    <i class="fas fa-utensils"></i>
                    <span>${restaurant.cuisine}</span>
                </div>
            </div>
            
            <div class="restaurant-info-enhanced">
                <div class="info-item-enhanced">
                    <div class="info-icon">
                        <i class="fas fa-phone"></i>
                    </div>
                    <div class="info-content">
                        <span class="info-label">الهاتف</span>
                        <span class="info-value">${restaurant.phone}</span>
                    </div>
                </div>
                <div class="info-item-enhanced">
                    <div class="info-icon">
                        <i class="fas fa-clock"></i>
                    </div>
                    <div class="info-content">
                        <span class="info-label">ساعات العمل</span>
                        <span class="info-value">${restaurant.hours}</span>
                    </div>
                </div>
                <div class="info-item-enhanced">
                    <div class="info-icon">
                        <i class="fas fa-map-marker-alt"></i>
                    </div>
                    <div class="info-content">
                        <span class="info-label">العنوان</span>
                        <span class="info-value">${restaurant.address}</span>
                    </div>
                </div>
            </div>
            
            <div class="delivery-zones-enhanced">
                <div class="zones-header">
                    <i class="fas fa-truck"></i>
                    <h4>مناطق التوصيل</h4>
                </div>
                <div class="zones-preview">
                    ${restaurant.deliveryZones.slice(0, 2).map(zone => 
                        `<div class="zone-preview-card">
                            <span class="zone-name">${zone.zone}</span>
                            <span class="zone-price">${zone.price}</span>
                        </div>`
                    ).join('')}
                    ${restaurant.deliveryZones.length > 2 ? 
                        `<div class="more-zones">+${restaurant.deliveryZones.length - 2} مناطق أخرى</div>` : ''
                    }
                </div>
            </div>
            
            <div class="card-footer">
                <button class="view-details-btn">
                    <i class="fas fa-eye"></i>
                    <span>عرض التفاصيل</span>
                </button>
            </div>
        `;

        return card;
    }

    openRestaurantDetails(restaurant) {
        const modal = document.getElementById('restaurantModal');
        const modalTitle = document.getElementById('modalTitle');
        const modalBody = document.getElementById('modalBody');

        modalTitle.textContent = restaurant.name;
        
        
        modalBody.innerHTML = `
            <div class="restaurant-details-enhanced">
                <!-- Restaurant Header -->
                <div class="restaurant-header-modal">
                    <div class="restaurant-title-section">
                        <h2 class="restaurant-name-modal">${restaurant.name}</h2>
                    </div>
                    <div class="restaurant-cuisine-badge">
                        <i class="fas fa-utensils"></i>
                        <span>${restaurant.cuisine}</span>
                    </div>
                </div>

                <!-- Contact Information Card -->
                <div class="info-card">
                    <div class="card-header">
                        <i class="fas fa-phone-alt"></i>
                        <h3>معلومات الاتصال</h3>
                    </div>
                    <div class="card-content">
                        <div class="contact-item">
                            <div class="contact-icon">
                                <i class="fas fa-phone"></i>
                            </div>
                            <div class="contact-details">
                                <span class="contact-label">رقم الهاتف</span>
                                <span class="contact-value">${restaurant.phone}</span>
                            </div>
                        </div>
                        <div class="contact-item">
                            <div class="contact-icon">
                                <i class="fas fa-map-marker-alt"></i>
                            </div>
                            <div class="contact-details">
                                <span class="contact-label">العنوان</span>
                                <span class="contact-value">${restaurant.address}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Operating Hours Card -->
                <div class="info-card">
                    <div class="card-header">
                        <i class="fas fa-clock"></i>
                        <h3>ساعات العمل</h3>
                    </div>
                    <div class="card-content">
                        <div class="hours-display">
                            <i class="fas fa-calendar-alt"></i>
                            <span>${restaurant.hours}</span>
                        </div>
                    </div>
                </div>

                <!-- Delivery Zones Card -->
                <div class="info-card delivery-zones-card">
                    <div class="card-header">
                        <i class="fas fa-truck"></i>
                        <h3>مناطق التوصيل والأسعار</h3>
                    </div>
                    <div class="card-content">
                        <div class="delivery-zones-grid">
                            ${restaurant.deliveryZones.map((zone, index) => `
                                <div class="delivery-zone-card">
                                    <div class="zone-header">
                                        <div class="zone-number">${index + 1}</div>
                                        <h4 class="zone-name">${zone.zone}</h4>
                                    </div>
                                    <div class="zone-details">
                                        <div class="zone-price-section">
                                            <i class="fas fa-dollar-sign"></i>
                                            <span class="price-label">السعر:</span>
                                            <span class="price-value">${zone.price}</span>
                                        </div>
                                        <div class="zone-time-section">
                                            <i class="fas fa-stopwatch"></i>
                                            <span class="time-label">وقت التوصيل:</span>
                                            <span class="time-value">${zone.deliveryTime}</span>
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>

                <!-- Quick Actions -->
                <div class="quick-actions">
                    <button class="action-btn call-btn" onclick="window.open('tel:${restaurant.phone}')">
                        <i class="fas fa-phone"></i>
                        <span>اتصال</span>
                    </button>
                    <button class="action-btn copy-btn" onclick="navigator.clipboard.writeText('${restaurant.name}\\n${restaurant.phone}\\n${restaurant.address}\\n${restaurant.hours}')">
                        <i class="fas fa-copy"></i>
                        <span>نسخ المعلومات</span>
                    </button>
                </div>
            </div>
        `;

        modal.classList.add('active');
    }

    openRestaurantModal() {
        const modal = document.getElementById('restaurantModal');
        const modalTitle = document.getElementById('modalTitle');
        const modalBody = document.getElementById('modalBody');

        modalTitle.textContent = 'إضافة مطعم جديد';
        modalBody.innerHTML = `
            <form id="restaurantForm">
                <div class="form-group">
                    <label for="restaurantName">اسم المطعم *</label>
                    <input type="text" id="restaurantName" required>
                </div>
                
                <div class="form-group">
                    <label for="restaurantPhone">رقم الهاتف *</label>
                    <input type="tel" id="restaurantPhone" required>
                </div>
                
                <div class="form-group">
                    <label for="restaurantAddress">العنوان *</label>
                    <input type="text" id="restaurantAddress" required>
                </div>
                
                <div class="form-group">
                    <label for="restaurantHours">ساعات العمل *</label>
                    <input type="text" id="restaurantHours" placeholder="مثال: السبت - الخميس: 11:00 ص - 10:00 م" required>
                </div>
                
                <div class="form-group">
                    <label for="restaurantCuisine">نوع المطبخ *</label>
                    <input type="text" id="restaurantCuisine" required>
                </div>
                
                <div class="form-group">
                    <label for="restaurantStatus">الحالة *</label>
                    <select id="restaurantStatus" required>
                        <option value="open">مفتوح</option>
                        <option value="closed">مغلق</option>
                    </select>
                </div>

                <div class="form-group">
                    <label>مناطق التوصيل</label>
                    <div id="deliveryZonesContainer">
                        <div class="zone-input-group">
                            <input type="text" placeholder="اسم المنطقة" class="zone-name-input">
                            <input type="text" placeholder="السعر (مثال: 15 ريال)" class="zone-price-input">
                            <input type="text" placeholder="وقت التوصيل (مثال: 25-35 دقيقة)" class="zone-time-input">
                        </div>
                    </div>
                    <button type="button" id="addZoneBtn" class="btn btn-secondary" style="margin-top: 0.5rem;">
                        <i class="fas fa-plus"></i> إضافة منطقة أخرى
                    </button>
                </div>
            </form>
        `;

        // Add event listener for adding zones
        setTimeout(() => {
            document.getElementById('addZoneBtn').addEventListener('click', () => {
                this.addDeliveryZoneInput();
            });
        }, 100);

        modal.classList.add('active');
    }

    closeModal() {
        const modal = document.getElementById('restaurantModal');
        modal.classList.remove('active');
    }

    setupModalEventListeners() {
        // Use event delegation for dynamically created buttons
        document.addEventListener('click', (e) => {
            if (e.target.id === 'saveRestaurantBtn') {
                this.saveRestaurant();
            } else if (e.target.id === 'editRestaurantBtn') {
                this.editRestaurant();
            }
        });
    }

    saveRestaurant() {
        const form = document.getElementById('restaurantForm');
        if (!form) {
            this.showToast('النموذج غير موجود', 'error');
            return;
        }

        // Get form data
        const formData = {
            name: document.getElementById('restaurantName').value.trim(),
            phone: document.getElementById('restaurantPhone').value.trim(),
            address: document.getElementById('restaurantAddress').value.trim(),
            hours: document.getElementById('restaurantHours').value.trim(),
            cuisine: document.getElementById('restaurantCuisine').value.trim(),
            status: document.getElementById('restaurantStatus').value
        };

        // Validate required fields
        if (!formData.name || !formData.phone || !formData.address || !formData.hours || !formData.cuisine) {
            this.showToast('يرجى ملء جميع الحقول المطلوبة', 'error');
            return;
        }

        // Collect delivery zones data
        const deliveryZones = [];
        const zoneGroups = document.querySelectorAll('.zone-input-group');
        
        zoneGroups.forEach(group => {
            const zoneName = group.querySelector('.zone-name-input').value.trim();
            const zonePrice = group.querySelector('.zone-price-input').value.trim();
            const zoneTime = group.querySelector('.zone-time-input').value.trim();
            
            if (zoneName && zonePrice && zoneTime) {
                deliveryZones.push({
                    zone: zoneName,
                    price: zonePrice,
                    deliveryTime: zoneTime
                });
            }
        });

        // If no zones provided, add a default one
        if (deliveryZones.length === 0) {
            deliveryZones.push({
                zone: "منطقة افتراضية",
                price: "15 ريال",
                deliveryTime: "25-35 دقيقة"
            });
        }

        // Create new restaurant object
        const newRestaurant = {
            id: this.restaurants.length + 1,
            name: formData.name,
            status: formData.status,
            phone: formData.phone,
            hours: formData.hours,
            address: formData.address,
            cuisine: formData.cuisine,
            deliveryZones: deliveryZones
        };

        // Add to restaurants array
        this.restaurants.push(newRestaurant);

        // Save to local storage
        this.saveRestaurantsToStorage();

        // Refresh the display
        this.renderRestaurants();

        // Close modal
        this.closeModal();

        // Show success message
        this.showToast(`تم إضافة مطعم "${newRestaurant.name}" بنجاح!`, 'success');
    }


    addDeliveryZoneInput() {
        const container = document.getElementById('deliveryZonesContainer');
        const newZoneGroup = document.createElement('div');
        newZoneGroup.className = 'zone-input-group';
        newZoneGroup.innerHTML = `
            <input type="text" placeholder="Zone Name" class="zone-name-input">
            <input type="text" placeholder="Price (e.g., $3.99)" class="zone-price-input">
            <input type="text" placeholder="Delivery Time (e.g., 25-35 min)" class="zone-time-input">
            <button type="button" class="remove-zone-btn" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        container.appendChild(newZoneGroup);
    }

    editRestaurant() {
        // This would open the modal in edit mode
        // For now, just show a message
        this.showToast('ميزة التعديل قادمة قريباً!', 'info');
    }

    searchDeliveryZones(query) {
        const resultsContainer = document.getElementById('searchResults');
        if (!query.trim()) {
            this.clearSearchResults();
            return;
        }

        const results = [];
        this.restaurants.forEach(restaurant => {
            restaurant.deliveryZones.forEach(zone => {
                if (zone.zone.toLowerCase().includes(query.toLowerCase())) {
                    results.push({
                        restaurant: restaurant.name,
                        zone: zone.zone,
                        price: zone.price,
                        deliveryTime: zone.deliveryTime,
                        phone: restaurant.phone,
                        status: restaurant.status
                    });
                }
            });
        });

        this.displaySearchResults(results);
    }

    displaySearchResults(results) {
        const resultsContainer = document.getElementById('searchResults');
        
        if (results.length === 0) {
            resultsContainer.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search"></i>
                    <p>لم يتم العثور على مناطق توصيل لـ "${document.getElementById('zoneSearchInput').value}"</p>
                </div>
            `;
            return;
        }

        resultsContainer.innerHTML = results.map(result => `
            <div class="search-result-item slide-up">
                <div class="result-header">
                    <h4>${result.restaurant}</h4>
                    <span class="restaurant-status ${result.status === 'open' ? 'status-open' : 'status-closed'}">
                        ${result.status === 'open' ? 'مفتوح' : 'مغلق'}
                    </span>
                </div>
                <div class="result-details">
                    <div class="zone-info">
                        <strong>${result.zone}</strong> - ${result.price}
                    </div>
                    <div class="delivery-time">
                        <i class="fas fa-clock"></i>
                        ${result.deliveryTime}
                    </div>
                    <div class="contact-info">
                        <i class="fas fa-phone"></i>
                        ${result.phone}
                    </div>
                </div>
            </div>
        `).join('');
    }

    clearSearchResults() {
        const resultsContainer = document.getElementById('searchResults');
        resultsContainer.innerHTML = `
            <div class="search-placeholder">
                <i class="fas fa-search"></i>
                <p>أدخل اسم المنطقة أو الرمز البريدي للبحث عن مناطق التوصيل</p>
            </div>
        `;
    }


    showLoading(show) {
        const overlay = document.getElementById('loadingOverlay');
        if (show) {
            overlay.classList.add('active');
        } else {
            overlay.classList.remove('active');
        }
    }

    showToast(message, type = 'info') {
        const container = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;

        container.appendChild(toast);

        // Auto remove after 3 seconds
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }
}

// Initialize the dashboard when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new RestaurantDashboard();
});

// Add some additional CSS for the detailed modal view
const additionalStyles = `
<style>
.restaurant-details {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.detail-section h4 {
    font-size: 1rem;
    font-weight: 600;
    color: #2d3748;
    margin-bottom: 0.75rem;
    border-bottom: 2px solid #e2e8f0;
    padding-bottom: 0.5rem;
}

.delivery-zones-detailed {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.zone-detail {
    background: #f7fafc;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 0.75rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.zone-name {
    font-weight: 600;
    color: #2d3748;
}

.zone-info {
    display: flex;
    gap: 1rem;
    font-size: 0.875rem;
}

.zone-price {
    color: #667eea;
    font-weight: 500;
}

.zone-time {
    color: #4a5568;
}

.form-group {
    margin-bottom: 1rem;
}

.form-group label {
    display: block;
    font-size: 0.875rem;
    font-weight: 500;
    color: #4a5568;
    margin-bottom: 0.5rem;
}

.form-group input,
.form-group select {
    width: 100%;
    padding: 0.75rem;
    border: 2px solid #e2e8f0;
    border-radius: 8px;
    font-size: 0.875rem;
    transition: all 0.2s ease;
}

.form-group input:focus,
.form-group select:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.search-placeholder,
.no-results {
    text-align: center;
    padding: 2rem;
    color: #a0aec0;
}

.search-placeholder i,
.no-results i {
    font-size: 2rem;
    margin-bottom: 1rem;
}

.result-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.75rem;
}

.result-header h4 {
    font-size: 1rem;
    font-weight: 600;
    color: #2d3748;
    margin: 0;
}

.result-details {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.zone-info {
    font-size: 0.875rem;
    color: #4a5568;
}

.delivery-time,
.contact-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.8rem;
    color: #718096;
}

.toast-content {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.toast-content i {
    font-size: 1.125rem;
}

.toast.success .toast-content i {
    color: #48bb78;
}

.toast.error .toast-content i {
    color: #f56565;
}

.toast.info .toast-content i {
    color: #667eea;
}
</style>
`;

// Add the additional styles to the document
document.head.insertAdjacentHTML('beforeend', additionalStyles);
