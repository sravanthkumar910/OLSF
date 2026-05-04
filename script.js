// Enhanced Service Data with more details and categories
const services = [
  { 
    id: 1, 
    name: "Ravi Kumar", 
    type: "Electrician",
    category: "Electrical",
    emoji: "⚡",
    lat: 17.385044, 
    lng: 78.486671,
    rating: 4.8,
    reviews: 128,
    phone: "+91 98765 43210",
    email: "ravi.electric@servicefinder.com",
    experience: "8+ Years",
    price: "₹299/hr",
    desc: "Certified electrician with 8+ years experience. Specializes in wiring, repairs, lighting installations and maintenance. Available 24/7 for emergencies.",
    distance: "2.1 km",
    availability: true
  },
  { 
    id: 2, 
    name: "Suresh Plumbing Solutions", 
    type: "Plumber",
    category: "Plumbing",
    emoji: "🔧",
    lat: 17.400596, 
    lng: 78.489594,
    rating: 4.7,
    reviews: 95,
    phone: "+91 99876 54321",
    email: "suresh.plumb@servicefinder.com",
    experience: "6+ Years",
    price: "₹249/hr",
    desc: "Expert plumber offering leak repairs, pipe fitting, bathroom installations and water heater services. Same day service guarantee.",
    distance: "3.8 km",
    availability: true
  },
  { 
    id: 3, 
    name: "Amit Woodworks", 
    type: "Carpenter",
    category: "Carpentry",
    emoji: "🪵",
    lat: 17.420413, 
    lng: 78.499697,
    rating: 4.9,
    reviews: 156,
    phone: "+91 78945 67890",
    email: "amit.carpenter@servicefinder.com",
    experience: "10+ Years",
    price: "₹399/hr",
    desc: "Master carpenter specializing in furniture making, repairs, wardrobes and custom woodwork. 100% satisfaction guarantee.",
    distance: "5.2 km",
    availability: false
  },
  { 
    id: 4, 
    name: "Priya Painting Services", 
    type: "Painter",
    category: "Painting",
    emoji: "🎨",
    lat: 17.380317, 
    lng: 78.480513,
    rating: 4.6,
    reviews: 87,
    phone: "+91 87654 32109",
    email: "priya.paint@servicefinder.com",
    experience: "5+ Years",
    price: "₹199/sqft",
    desc: "Professional painting services for interiors, exteriors and waterproofing with premium quality paints. Free consultation.",
    distance: "1.8 km",
    availability: true
  },
  { 
    id: 5, 
    name: "CleanHome Professional Cleaning", 
    type: "Cleaning Service",
    category: "Cleaning",
    emoji: "🧹",
    lat: 17.395427, 
    lng: 78.494962,
    rating: 4.9,
    reviews: 203,
    phone: "+91 96543 21098",
    email: "cleanhome@servicefinder.com",
    experience: "3+ Years",
    price: "₹499/hour",
    desc: "Professional deep cleaning for homes, offices and commercial spaces. Eco-friendly products used.",
    distance: "2.9 km",
    availability: true
  },
  { 
    id: 6, 
    name: "AC Repair Experts", 
    type: "AC Technician",
    category: "Appliance Repair",
    emoji: "❄️",
    lat: 17.388729, 
    lng: 78.482341,
    rating: 4.7,
    reviews: 67,
    phone: "+91 93456 78901",
    email: "ac.repair@servicefinder.com",
    experience: "7+ Years",
    price: "₹350/visit",
    desc: "Specialized AC repair and maintenance services. All brands supported.",
    distance: "1.5 km",
    availability: true
  }
];

// Categories for filtering
const categories = ["All", "Electrical", "Plumbing", "Carpentry", "Painting", "Cleaning", "Appliance Repair"];

// Home Page - Search functionality
function goToServices() {
  const query = document.getElementById("search")?.value || "";
  localStorage.setItem("searchQuery", query);
  window.location.href = "services.html";
}

// Services Page - Enhanced with categories and better map
function initServicesPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const category = urlParams.get('category') || '';
  const query = localStorage.getItem("searchQuery") || urlParams.get('q') || '';
  
  // Add category filter dropdown
  addCategoryFilter();
  
  // Ensure map container exists
  const mapElement = document.getElementById("map");
  if (mapElement) {
    // Set explicit height
    mapElement.style.height = "500px";
    // Initialize map after small delay to ensure Leaflet is loaded
    setTimeout(() => initMap(query, category), 100);
  }
  
  // Live search
  const searchInput = document.getElementById("search");
  if (searchInput) {
    searchInput.addEventListener("input", function() {
      initMap(this.value, category);
    });
  }
}

// Add category filter dropdown
function addCategoryFilter() {
  const listHeader = document.querySelector('.list-header');
  if (listHeader && !document.getElementById('categoryFilter')) {
    const filterDiv = document.createElement('div');
    filterDiv.style.marginBottom = '1rem';
    filterDiv.innerHTML = `
      <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: #2c3e50;">Filter by Category:</label>
      <select id="categoryFilter" style="width: 100%; padding: 0.8rem; border: 2px solid #e9ecef; border-radius: 12px; font-size: 1rem;">
        ${categories.map(cat => `<option value="${cat}">${cat}</option>`).join('')}
      </select>
    `;
    listHeader.appendChild(filterDiv);
    
    document.getElementById('categoryFilter').addEventListener('change', function() {
      const query = document.getElementById('search')?.value || '';
      initMap(query, this.value);
    });
  }
}

// Fixed Map Initialization with proper error handling
function initMap(query = "", category = "All") {
  try {
    // Remove existing map if any
    if (window.serviceMap) {
      window.serviceMap.remove();
    }
    
    const mapElement = document.getElementById("map");
    if (!mapElement) return;
    
    window.serviceMap = L.map('map').setView([17.385044, 78.486671], 12);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 18
    }).addTo(window.serviceMap);

    const listContainer = document.getElementById("list");
    if (!listContainer) return;
    
    listContainer.innerHTML = "";

    const filteredServices = services.filter(service => {
      const matchesQuery = query === "" || 
        service.type.toLowerCase().includes(query.toLowerCase()) ||
        service.name.toLowerCase().includes(query.toLowerCase());
      
      const matchesCategory = category === "All" || service.category === category;
      
      return matchesQuery && matchesCategory;
    });

    filteredServices.forEach((service, index) => {
      // Custom marker icon
      const markerIcon = L.divIcon({
        html: `<div style="background: linear-gradient(135deg, #4facfe, #00f2fe); width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; box-shadow: 0 4px 12px rgba(79,172,254,0.4); border: 3px solid white;">${service.emoji}</div>`,
        className: '',
        iconSize: [40, 40],
        iconAnchor: [20, 20]
      });

      const marker = L.marker([service.lat, service.lng], {icon: markerIcon})
        .addTo(window.serviceMap)
        .bindPopup(`
          <div style="min-width: 200px; font-family: 'Poppins', sans-serif; text-align: center;">
            <div style="font-size: 2rem; margin-bottom: 0.5rem;">${service.emoji}</div>
            <h3 style="margin: 0 0 0.5rem 0; color: #2c3e50;">${service.name}</h3>
            <p style="margin: 0 0 0.5rem 0; color: #4facfe; font-weight: 600;">${service.type}</p>
            <div style="color: #f39c12; font-weight: 600;">★${service.rating} (${service.reviews} reviews)</div>
            <div style="margin-top: 0.5rem; font-size: 0.9rem; color: #666;">${service.distance} away</div>
          </div>
        `);

      // Add service card with more features
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
          <span style="font-size: 2.5rem;">${service.emoji}</span>
          <div style="flex: 1;">
            <h3 style="margin: 0 0 0.3rem 0; color: #2c3e50;">${service.name}</h3>
            <p style="margin: 0; color: #4facfe; font-weight: 600; font-size: 0.95rem;">${service.type}</p>
          </div>
          ${service.availability ? '<span style="background: #27ae60; color: white; padding: 0.2rem 0.6rem; border-radius: 12px; font-size: 0.8rem; font-weight: 600;">Available</span>' : '<span style="background: #95a5a6; color: white; padding: 0.2rem 0.6rem; border-radius: 12px; font-size: 0.8rem; font-weight: 600;">Busy</span>'}
        </div>
        <div class="rating" style="color: #f39c12; font-weight: 600; margin-bottom: 0.3rem;">★${service.rating} (${service.reviews} reviews)</div>
        <div style="color: #7f8c8d; font-size: 0.9rem; margin-bottom: 0.5rem;">${service.distance} • ${service.price}</div>
        <div style="font-size: 0.85rem; color: #27ae60; font-weight: 600;">✅ ${service.availability ? 'Available Now' : 'Book for Later'}</div>
      `;
      
      card.onclick = () => {
        localStorage.setItem("selectedService", JSON.stringify(service));
        window.location.href = "details.html";
      };
      
      // Add hover effect to card
      card.style.transition = 'all 0.3s ease';
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-5px)';
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
      });
      
      listContainer.appendChild(card);
    });

    // Show no results message
    if (filteredServices.length === 0) {
      listContainer.innerHTML = `
        <div style="text-align: center; padding: 3rem; color: #7f8c8d;">
          <div style="font-size: 4rem; margin-bottom: 1rem;">🔍</div>
          <h3>No services found</h3>
          <p>Try adjusting your search or category filter</p>
        </div>
      `;
    }

    // Fit map bounds to markers
    if (filteredServices.length > 0) {
      const group = new L.featureGroup(filteredServices.map(s => 
        L.marker([s.lat, s.lng])
      ));
      window.serviceMap.fitBounds(group.getBounds().pad(0.1));
    }
    
  } catch (error) {
    console.error("Map initialization error:", error);
    const mapElement = document.getElementById("map");
    if (mapElement) {
      mapElement.innerHTML = '<div style="padding: 2rem; text-align: center; color: #7f8c8d;">Map loading... Please refresh if issue persists.</div>';
    }
  }
}

// Enhanced Details Page
function initDetailsPage() {
  const service = JSON.parse(localStorage.getItem("selectedService"));
  if (!service) {
    showError("Service not found. Please go back to services page.");
    return;
  }
  
  // Update all service details
  document.getElementById("provider-icon").textContent = service.emoji;
  document.getElementById("service-name").textContent = service.name;
  document.getElementById("service-type").textContent = service.type;
  document.getElementById("service-location").textContent = `${service.distance} away • Near Madhapur`;
  document.getElementById("service-phone").textContent = service.phone;
  document.getElementById("service-email").textContent = service.email;
  document.getElementById("service-exp").textContent = service.experience;
  document.getElementById("service-price").textContent = service.price;
  document.getElementById("service-desc").textContent = service.desc;
  
  // Stars rating
  const starsElement = document.querySelector('.stars');
  if (starsElement) {
    starsElement.innerHTML = '★'.repeat(Math.floor(service.rating)) + 
      (service.rating % 1 !== 0 ? '☆' : '') +
      ` (${service.reviews} reviews)`;
  }
  
  // Update Call Now button
  const callBtn = document.querySelector('a[href^="tel:"]');
  if (callBtn) callBtn.href = `tel:${service.phone.replace(/\s/g, '')}`;
  
  const emailBtn = document.querySelector('a[href^="mailto:"]');
  if (emailBtn) emailBtn.href = `mailto:${service.email}`;
  
  // Initialize map with service location
  const mapElement = document.getElementById("map");
  if (mapElement) {
    mapElement.style.height = "400px";
    setTimeout(() => {
      const detailsMap = L.map('map').setView([service.lat, service.lng], 16);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(detailsMap);
      
      const markerIcon = L.divIcon({
        html: `<div style="background: linear-gradient(135deg, #4facfe, #00f2fe); width: 50px; height: 50px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; box-shadow: 0 6px 20px rgba(79,172,254,0.4); border: 4px solid white;">${service.emoji}</div>`,
        className: '',
        iconSize: [50, 50],
        iconAnchor: [25, 25]
      });
      
      L.marker([service.lat, service.lng], {icon: markerIcon}).addTo(detailsMap)
        .bindPopup(`
          <b>${service.name}</b><br>
          ${service.type}<br>
          📍 ${service.distance} away<br>
          ★${service.rating}
        `);
    }, 200);
  }
}

// Contact Form with validation
function initContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;
  
  form.addEventListener("submit", function(e) {
    e.preventDefault();
    
    // Client-side validation
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();
    
    if (name === "" || email === "" || message === "") {
      alert("Please fill in all required fields.");
      return;
    }
    
    if (!email.includes('@')) {
      alert("Please enter a valid email address.");
      return;
    }
    
    // Simulate API call
    setTimeout(() => {
      form.style.display = "none";
      document.getElementById("successMessage").style.display = "block";
      
      // Simulate auto-reset after 5 seconds
      setTimeout(() => {
        resetForm();
      }, 5000);
      
      // Log form data (for demo)
      console.log("Form submitted:", { name, email, message });
      
    }, 1500);
  });
}

function resetForm() {
  const form = document.getElementById("contactForm");
  const successMsg = document.getElementById("successMessage");
  if (form && successMsg) {
    form.style.display = "block";
    successMsg.style.display = "none";
    form.reset();
  }
}

// Show error message
function showError(message) {
  document.body.innerHTML = `
    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; text-align: center; padding: 2rem;">
      <div style="font-size: 4rem; margin-bottom: 1rem;">⚠️</div>
      <h1 style="color: #e74c3c; margin-bottom: 1rem;">Error</h1>
      <p style="color: #7f8c8d; max-width: 500px;">${message}</p>
      <a href="services.html" style="margin-top: 2rem; padding: 1rem 2rem; background: linear-gradient(135deg, #4facfe, #00f2fe); color: white; text-decoration: none; border-radius: 25px; font-weight: 600;">← Back to Services</a>
    </div>
  `;
}

// Navigation Active State and Mobile Menu
function updateActiveNav() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === currentPage);
  });
}

function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      hamburger.classList.toggle('active');
    });
  }
}

// Testimonials slider (for about page)
function initTestimonials() {
  // Add testimonials if on about page
  if (window.location.pathname.includes('about.html')) {
    // This can be expanded later
  }
}

// Service booking simulation (for details page)
function initBooking() {
  // Add booking functionality later
}

// Initialize everything
document.addEventListener('DOMContentLoaded', function() {
  updateActiveNav();
  initMobileMenu();
  
  // Page-specific initialization
  const currentPath = window.location.pathname;
  
  if (currentPath.includes('services.html')) {
    initServicesPage();
  } else if (currentPath.includes('details.html')) {
    initDetailsPage();
  } else if (currentPath.includes('contact.html')) {
    initContactForm();
  }
  
  // Global interactions
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
  
  // Quick search for quick tags
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('quick-tag')) {
      e.preventDefault();
      const type = e.target.textContent;
      localStorage.setItem("searchQuery", type);
      window.location.href = `services.html?category=${encodeURIComponent(type)}`;
    }
  });
  
  // Enter key support for search
  document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      const searchInput = document.getElementById("search");
      if (searchInput && document.activeElement === searchInput) {
        goToServices();
      }
    }
  });
});

// Add loading animation
window.addEventListener('load', function() {
  document.body.classList.add('loaded');
});

// Preload Leaflet for better map performance
if (typeof L !== 'undefined') {
  console.log("Leaflet loaded successfully");
} else {
  console.log("Leaflet loading...");
}
