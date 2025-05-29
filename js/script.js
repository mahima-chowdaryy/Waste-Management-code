document.querySelectorAll('.image-container img').forEach(image => {
    image.onclick = () => {
        document.querySelector('.pop-image').style.display = 'block';
        document.querySelector('.pop-image img').src = image.getAttribute('src');
    }
});

document.querySelector('.pop-image span').onclick = () => {
    document.querySelector('.pop-image').style.display = 'none';
}

// Form submission handling
document.getElementById('donationForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = {
        name: document.getElementById('name').value,
        mobile: document.getElementById('mobile').value,
        donation_type: document.getElementById('donation_type').value,
        address: document.getElementById('address').value,
        message: document.getElementById('message').value
    };

    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
        alert('Please login to submit your donation');
        window.location.href = 'login.html';
        return;
    }

    // Save donation to localStorage
    const donations = JSON.parse(localStorage.getItem('donations') || '[]');
    const newDonation = {
        ...formData,
        userId: localStorage.getItem('userId'),
        date: new Date().toISOString(),
        status: 'Pending'
    };
    donations.push(newDonation);
    localStorage.setItem('donations', JSON.stringify(donations));

    // Send email notification
    const templateParams = {
        to_email: 'hopehubbfoundation@gmail.com', // Admin email
        to_name: 'Admin',
        from_name: formData.name,
        donation_type: formData.donation_type,
        address: formData.address,
        message: formData.message || 'No additional message',
        mobile: formData.mobile
    };

    // Show loading message
    document.getElementById('formMessage').textContent = 'Processing your donation...';

    emailjs.send('hopehubfoundation_gmail', 'template_q2ui18a', templateParams)
        .then(function(response) {
            console.log('Email sent successfully:', response);
            document.getElementById('formMessage').textContent = 'Thank you for your donation! We will contact you soon.';
            document.getElementById('donationForm').reset();
            
            // Add social share buttons after successful submission
            setTimeout(addSocialShareButtons, 1000);
        })
        .catch(function(error) {
            console.error('Failed to send email:', error);
            document.getElementById('formMessage').textContent = 'Thank you for your donation! We will contact you soon.';
            document.getElementById('donationForm').reset();
        });
});

// Authentication functions
function login(email, password) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userId', user.id);
        localStorage.setItem('userName', user.name);
        return true;
    }
    return false;
}

function signup(name, email, password) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Check if user already exists
    if (users.some(u => u.email === email)) {
        return false;
    }

    const newUser = {
        id: Date.now().toString(),
        name,
        email,
        password
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    return true;
}

function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    window.location.href = 'index.html';
}

// Check authentication status
function checkAuth() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const authLinks = document.querySelector('.auth-links');
    
    if (authLinks) {
        if (isLoggedIn) {
            authLinks.innerHTML = `
                <li class="nav-item">
                    <a class="nav-link" href="dashboard.html">Dashboard</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#" onclick="logout()">Logout</a>
                </li>
            `;
        } else {
            authLinks.innerHTML = `
                <li class="nav-item">
                    <a class="nav-link" href="login.html">Login</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="signup.html">Sign Up</a>
                </li>
            `;
        }
    }
}

// Statistics Counter Animation
function animateCounter(element, target) {
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 40);
}

// Update Statistics
function updateStats() {
    const donations = JSON.parse(localStorage.getItem('donations') || '[]');
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Calculate statistics
    const totalDonors = users.length;
    const totalDonations = donations.length;
    const peopleHelped = Math.floor(totalDonations * 3); // Assuming each donation helps 3 people
    const activeDays = Math.floor((new Date() - new Date('2024-01-01')) / (1000 * 60 * 60 * 24));
    
    // Animate counters
    animateCounter(document.getElementById('totalDonors'), totalDonors);
    animateCounter(document.getElementById('totalDonations'), totalDonations);
    animateCounter(document.getElementById('peopleHelped'), peopleHelped);
    animateCounter(document.getElementById('activeDays'), activeDays);
}

// Wishlist Management
const wishlistItems = [
    {
        id: 1,
        title: 'Winter Clothes',
        icon: 'fa-tshirt',
        target: 100,
        current: 45,
        description: 'Winter clothes for children in need',
        donation_type: 'clothes'
    },
    {
        id: 2,
        title: 'School Supplies',
        icon: 'fa-book',
        target: 200,
        current: 120,
        description: 'Books and stationery for underprivileged students',
        donation_type: 'books'
    },
    {
        id: 3,
        title: 'Food Items',
        icon: 'fa-cutlery',
        target: 150,
        current: 80,
        description: 'Non-perishable food items for families',
        donation_type: 'food'
    }
];

function updateWishlist() {
    const wishlistContainer = document.getElementById('wishlistItems');
    if (!wishlistContainer) return;

    wishlistContainer.innerHTML = wishlistItems.map(item => `
        <div class="col-md-4">
            <div class="wishlist-item fade-in">
                <i class="fa ${item.icon}"></i>
                <div class="wishlist-content">
                    <h4>${item.title}</h4>
                    <p>${item.description}</p>
                    <div class="progress">
                        <div class="progress-bar" role="progressbar" 
                             style="width: ${(item.current / item.target) * 100}%"
                             aria-valuenow="${item.current}" 
                             aria-valuemin="0" 
                             aria-valuemax="${item.target}">
                        </div>
                    </div>
                    <p>${item.current} of ${item.target} items collected</p>
                    <button class="btn1" onclick="donateForNeed('${item.donation_type}')">Donate Now</button>
                </div>
            </div>
        </div>
    `).join('');
}

// Function to handle donation for specific need
function donateForNeed(donationType) {
    // Check if user is logged in
    if (!localStorage.getItem('isLoggedIn')) {
        alert('Please login to make a donation');
        window.location.href = 'login.html';
        return;
    }

    // Scroll to donation form
    document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
    
    // Set the donation type in the form
    const donationSelect = document.getElementById('donation_type');
    if (donationSelect) {
        donationSelect.value = donationType;
    }
}

// Social Sharing
function shareOnSocial(platform) {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent('Join me in making a difference with Waste2Welfare Foundation');
    
    let shareUrl;
    switch(platform) {
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
            break;
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
            break;
        case 'linkedin':
            shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}`;
            break;
        case 'whatsapp':
            shareUrl = `https://wa.me/?text=${title}%20${url}`;
            break;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
}

// Add social share buttons to donation success message
function addSocialShareButtons() {
    const formMessage = document.getElementById('formMessage');
    if (formMessage) {
        const socialShareDiv = document.createElement('div');
        socialShareDiv.className = 'social-share';
        socialShareDiv.innerHTML = `
            <p>Share your contribution:</p>
            <a href="#" onclick="shareOnSocial('facebook')"><i class="fa fa-facebook"></i></a>
            <a href="#" onclick="shareOnSocial('twitter')"><i class="fa fa-twitter"></i></a>
            <a href="#" onclick="shareOnSocial('linkedin')"><i class="fa fa-linkedin"></i></a>
            <a href="#" onclick="shareOnSocial('whatsapp')"><i class="fa fa-whatsapp"></i></a>
        `;
        formMessage.appendChild(socialShareDiv);
    }
}

// Volunteer Registration
document.getElementById('volunteerForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const volunteerData = {
        name: document.getElementById('volunteerName').value,
        email: document.getElementById('volunteerEmail').value,
        phone: document.getElementById('volunteerPhone').value,
        interest: document.getElementById('volunteerInterest').value,
        message: document.getElementById('volunteerMessage').value,
        date: new Date().toISOString()
    };

    // Save volunteer data to localStorage
    const volunteers = JSON.parse(localStorage.getItem('volunteers') || '[]');
    volunteers.push(volunteerData);
    localStorage.setItem('volunteers', JSON.stringify(volunteers));

    // Show success message
    alert('Thank you for volunteering! We will contact you soon.');
    this.reset();
});

// Events Management
const upcomingEvents = [
    {
        id: 1,
        title: 'Winter Clothes Drive',
        date: '2024-02-15',
        time: '10:00 AM',
        location: 'Community Center',
        description: 'Help us collect and distribute winter clothes to those in need.',
        interested: 45
    },
    {
        id: 2,
        title: 'School Supply Collection',
        date: '2024-02-20',
        time: '2:00 PM',
        location: 'City Hall',
        description: 'Collecting school supplies for underprivileged children.',
        interested: 30
    },
    {
        id: 3,
        title: 'Food Distribution Day',
        date: '2024-02-25',
        time: '11:00 AM',
        location: 'Central Park',
        description: 'Distributing food packages to families in need.',
        interested: 60
    }
];

function formatDate(dateString) {
    const date = new Date(dateString);
    return {
        day: date.getDate(),
        month: date.toLocaleString('default', { month: 'short' })
    };
}

function updateEvents() {
    const eventsList = document.getElementById('eventsList');
    if (!eventsList) return;

    eventsList.innerHTML = upcomingEvents.map(event => {
        const date = formatDate(event.date);
        return `
            <div class="col-md-4">
                <div class="event-card">
                    <div class="event-date">
                        <div class="day">${date.day}</div>
                        <div class="month">${date.month}</div>
                    </div>
                    <div class="event-details">
                        <h4>${event.title}</h4>
                        <p><i class="fa fa-clock-o"></i> ${event.time}</p>
                        <p><i class="fa fa-map-marker"></i> ${event.location}</p>
                        <p>${event.description}</p>
                    </div>
                    <div class="event-actions">
                        <span><i class="fa fa-users"></i> ${event.interested} interested</span>
                        <button class="btn1" onclick="markInterest(${event.id})">I'm Interested</button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function markInterest(eventId) {
    if (!localStorage.getItem('isLoggedIn')) {
        alert('Please login to mark your interest');
        window.location.href = 'login.html';
        return;
    }

    const event = upcomingEvents.find(e => e.id === eventId);
    if (event) {
        event.interested++;
        updateEvents();
    }
}

// Gallery Image Hover Effect
document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('mouseenter', function() {
        this.querySelector('.before-img').style.opacity = '0';
        this.querySelector('.after-img').style.opacity = '1';
    });

    item.addEventListener('mouseleave', function() {
        this.querySelector('.before-img').style.opacity = '1';
        this.querySelector('.after-img').style.opacity = '0';
    });
});

// Initialize all features
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    updateStats();
    updateWishlist();
    updateEvents();
    
    // Add social share buttons to donation form
    const donationForm = document.getElementById('donationForm');
    if (donationForm) {
        donationForm.addEventListener('submit', function(e) {
            // ... existing form submission code ...
            
            // Add social share buttons after successful submission
            setTimeout(addSocialShareButtons, 1000);
        });
    }
});
