// Initialize Firebase (you'll need to add your Firebase config)
// const firebaseConfig = {
//     // Your Firebase configuration
// };
// firebase.initializeApp(firebaseConfig);

// Sample data structure for requests (replace with Firebase in production)
let requests = [];

// Handle request help form submission
document.getElementById('requestHelpForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const request = {
        id: Date.now(),
        type: 'direct',
        name: document.getElementById('requesterName').value,
        phone: document.getElementById('requesterPhone').value,
        email: document.getElementById('requesterEmail').value,
        address: document.getElementById('requesterAddress').value,
        needType: document.getElementById('requestType').value,
        description: document.getElementById('requestDetails').value,
        status: 'pending',
        timestamp: new Date().toISOString()
    };
    
    // Add to requests array (replace with Firebase in production)
    requests.unshift(request);
    
    // Update UI
    updateActiveRequests();
    
    // Clear form
    this.reset();
    
    // Show success message
    alert('Your request has been submitted successfully. We will contact you soon.');
});

// Handle report need form submission
document.getElementById('reportNeedForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const report = {
        id: Date.now(),
        type: 'reported',
        reporterName: document.getElementById('reporterName').value,
        reporterPhone: document.getElementById('reporterPhone').value,
        reporterEmail: document.getElementById('reporterEmail').value,
        location: document.getElementById('needLocation').value,
        needType: document.getElementById('reportedNeedType').value,
        description: document.getElementById('needDescription').value,
        status: 'pending',
        timestamp: new Date().toISOString()
    };
    
    // Add to requests array (replace with Firebase in production)
    requests.unshift(report);
    
    // Update UI
    updateActiveRequests();
    
    // Clear form
    this.reset();
    
    // Show success message
    alert('Thank you for reporting this need. We will look into it.');
});

// Function to update active requests display
function updateActiveRequests() {
    const activeRequestsList = document.getElementById('activeRequestsList');
    activeRequestsList.innerHTML = '';
    
    // Show only the 6 most recent requests
    const recentRequests = requests.slice(0, 6);
    
    recentRequests.forEach(request => {
        const requestCard = document.createElement('div');
        requestCard.className = 'col-md-4';
        requestCard.innerHTML = `
            <div class="request-card">
                <h4>${request.type === 'direct' ? request.name : 'Reported Need'}</h4>
                <div class="request-type">${capitalizeFirstLetter(request.needType)}</div>
                <div class="request-location">${request.type === 'direct' ? request.address : request.location}</div>
                <div class="request-description">${request.description}</div>
                <div class="request-meta">
                    <span>${formatDate(request.timestamp)}</span>
                    <span class="request-status status-${request.status}">${capitalizeFirstLetter(request.status)}</span>
                </div>
            </div>
        `;
        activeRequestsList.appendChild(requestCard);
    });
}

// Helper function to capitalize first letter
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Helper function to format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Initialize the display
document.addEventListener('DOMContentLoaded', function() {
    updateActiveRequests();
}); 