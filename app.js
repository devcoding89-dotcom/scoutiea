// ===================================
// EMAIL OUTREACH PLATFORM - APP LOGIC
// ===================================

// State Management
const AppState = {
    currentPage: 'dashboard',
    theme: localStorage.getItem('theme') || 'dark',
    campaigns: JSON.parse(localStorage.getItem('campaigns')) || [],
    contacts: JSON.parse(localStorage.getItem('contacts')) || [],
    templates: []
};

// ===================================
// INITIALIZATION
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    setupEventListeners();
    loadSavedData();
});

function initializeApp() {
    // Set initial theme
    document.documentElement.setAttribute('data-theme', AppState.theme);
    updateThemeButton();

    // Show dashboard by default
    showPage('dashboard');
}

// ===================================
// NAVIGATION
// ===================================

function setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.getAttribute('data-page');
            showPage(page);

            // Update active state
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });

    // Theme toggle
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    // Campaign form
    const campaignForm = document.getElementById('campaignForm');
    if (campaignForm) {
        campaignForm.addEventListener('submit', handleCampaignSubmit);
    }

    // Preview email button
    const previewBtn = document.getElementById('previewEmailBtn');
    if (previewBtn) {
        previewBtn.addEventListener('click', showEmailPreview);
    }

    // Save template button
    const saveTemplateBtn = document.getElementById('saveTemplateBtn');
    if (saveTemplateBtn) {
        saveTemplateBtn.addEventListener('click', saveAsTemplate);
    }

    // Create campaign button on dashboard
    const createCampaignBtn = document.getElementById('createCampaignBtn');
    if (createCampaignBtn) {
        createCampaignBtn.addEventListener('click', () => showPage('campaigns'));
    }

    // File upload
    setupFileUpload();

    // AI Tools
    setupAITools();
}

function showPage(pageId) {
    // Check if it's an auth page
    const isAuthPage = ['login', 'signup'].includes(pageId);

    // Toggle sidebar visibility
    const sidebar = document.getElementById('sidebar');
    if (isAuthPage) {
        sidebar.style.display = 'none';
        document.querySelector('.main-content').style.marginLeft = '0';
    } else {
        sidebar.style.display = 'flex';
        if (window.innerWidth > 1024) {
            document.querySelector('.main-content').style.marginLeft = '280px';
        }
    }

    // Hide all pages
    document.querySelectorAll('.page, .page-overlay').forEach(page => {
        page.classList.add('hidden');
        page.classList.remove('active');
    });

    // Show target page
    const targetPage = document.getElementById(`page-${pageId}`);
    if (targetPage) {
        targetPage.classList.remove('hidden');
        targetPage.classList.add('active');
        AppState.currentPage = pageId;

        // Update nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.dataset.page === pageId) {
                link.classList.add('active');
            }
        });
    }
}

// ===================================
// AUTHENTICATION LOGIC
// ===================================

// ===================================
// UTILITY FUNCTIONS
// ===================================

function toggleTheme() {
    const newTheme = AppState.theme === 'dark' ? 'light' : 'dark';
    AppState.theme = newTheme;
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeButton();
}

function updateThemeButton() {
    const themeIcon = document.getElementById('themeIcon');
    const themeBtn = document.getElementById('themeToggle');

    if (AppState.theme === 'dark') {
        themeIcon.textContent = '🌙';
        themeBtn.querySelector('span:last-child').textContent = 'Dark Mode';
    } else {
        themeIcon.textContent = '☀️';
        themeBtn.querySelector('span:last-child').textContent = 'Light Mode';
    }
}

// ===================================
// CAMPAIGN MANAGEMENT
// ===================================

function handleCampaignSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const campaign = {
        id: Date.now(),
        name: formData.get('name') || 'Untitled Campaign',
        subject: document.getElementById('emailSubject').value,
        body: document.getElementById('emailBody').value,
        status: 'active',
        createdAt: new Date().toISOString()
    };

    AppState.campaigns.push(campaign);
    saveCampaigns();

    // Show success message
    showNotification('Campaign launched successfully! 🚀', 'success');

    // Reset form
    e.target.reset();

    // Navigate to dashboard
    setTimeout(() => {
        showPage('dashboard');
        document.querySelector('[data-page="dashboard"]').classList.add('active');
        document.querySelector('[data-page="campaigns"]').classList.remove('active');
    }, 1500);
}

function showEmailPreview() {
    const subject = document.getElementById('emailSubject').value;
    const body = document.getElementById('emailBody').value;

    if (!subject || !body) {
        showNotification('Please fill in subject and body first', 'warning');
        return;
    }

    // Replace tokens with sample data
    const sampleData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        company: 'Acme Corp',
        position: 'CEO'
    };

    const previewSubject = replaceTokens(subject, sampleData);
    const previewBody = replaceTokens(body, sampleData);

    document.getElementById('previewSubject').textContent = previewSubject;
    document.getElementById('previewBody').textContent = previewBody;

    openModal('previewModal');
}

function replaceTokens(text, data) {
    let result = text;
    Object.keys(data).forEach(key => {
        const regex = new RegExp(`{{${key}}}`, 'g');
        result = result.replace(regex, data[key]);
    });
    return result;
}

function saveAsTemplate() {
    const subject = document.getElementById('emailSubject').value;
    const body = document.getElementById('emailBody').value;

    if (!subject || !body) {
        showNotification('Please fill in subject and body first', 'warning');
        return;
    }

    const template = {
        id: Date.now(),
        name: 'Custom Template',
        subject: subject,
        body: body,
        createdAt: new Date().toISOString()
    };

    AppState.templates.push(template);
    saveTemplates();

    showNotification('Template saved successfully! 💾', 'success');
}

// ===================================
// FILE UPLOAD & CONTACT MANAGEMENT
// ===================================

function setupFileUpload() {
    const fileUpload = document.getElementById('fileUpload');
    const fileInput = document.getElementById('fileInput');

    if (!fileUpload || !fileInput) return;

    // Click to upload
    fileUpload.addEventListener('click', () => {
        fileInput.click();
    });

    // Drag and drop
    fileUpload.addEventListener('dragover', (e) => {
        e.preventDefault();
        fileUpload.classList.add('dragover');
    });

    fileUpload.addEventListener('dragleave', () => {
        fileUpload.classList.remove('dragover');
    });

    fileUpload.addEventListener('drop', (e) => {
        e.preventDefault();
        fileUpload.classList.remove('dragover');

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFileUpload(files[0]);
        }
    });

    // File input change
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleFileUpload(e.target.files[0]);
        }
    });
}

function handleFileUpload(file) {
    const validTypes = ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/plain'];

    if (!validTypes.includes(file.type) && !file.name.match(/\.(csv|xlsx|txt)$/)) {
        showNotification('Please upload a CSV, Excel, or TXT file', 'error');
        return;
    }

    // Show progress
    const progressContainer = document.getElementById('uploadProgress');
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    const resultsContainer = document.getElementById('uploadResults');

    progressContainer.classList.remove('hidden');
    resultsContainer.classList.add('hidden');

    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 20;
        if (progress > 100) progress = 100;

        progressBar.style.width = progress + '%';
        progressText.textContent = Math.round(progress) + '%';

        if (progress >= 100) {
            clearInterval(interval);

            // Simulate processing
            setTimeout(() => {
                processContactFile(file);
                progressContainer.classList.add('hidden');
            }, 500);
        }
    }, 200);
}

function processContactFile(file) {
    // Simulate file processing
    const totalContacts = Math.floor(Math.random() * 1000) + 500;
    const validEmails = Math.floor(totalContacts * 0.95);
    const duplicates = totalContacts - validEmails;

    document.getElementById('totalContacts').textContent = totalContacts.toLocaleString();
    document.getElementById('validEmails').textContent = validEmails.toLocaleString();
    document.getElementById('duplicates').textContent = duplicates.toLocaleString();

    document.getElementById('uploadResults').classList.remove('hidden');

    showNotification('Contacts uploaded successfully! ✅', 'success');
}

// ===================================
// AI TOOLS
// ===================================

function setupAITools() {
    // Grammar Checker
    document.getElementById('checkGrammarBtn')?.addEventListener('click', () => {
        const input = document.getElementById('grammarInput').value;
        if (!input) {
            showNotification('Please enter some text to analyze', 'info');
            return;
        }

        const btn = document.getElementById('checkGrammarBtn');
        btn.innerHTML = '<span>⌛</span> <span>Analyzing...</span>';
        btn.disabled = true;

        setTimeout(() => {
            document.getElementById('grammarResults').classList.remove('hidden');
            btn.innerHTML = '<span>🤖</span> <span>Analyze</span>';
            btn.disabled = false;
        }, 1500);
    });

    // Subject Analyzer
    document.getElementById('analyzeSubjectBtn')?.addEventListener('click', () => {
        const input = document.getElementById('subjectInput').value;
        if (!input) {
            showNotification('Please enter a subject line', 'info');
            return;
        }

        const btn = document.getElementById('analyzeSubjectBtn');
        btn.innerHTML = '<span>⌛</span> <span>Analyzing...</span>';
        btn.disabled = true;

        setTimeout(() => {
            document.getElementById('subjectResults').classList.remove('hidden');
            btn.innerHTML = '<span>🤖</span> <span>Analyze</span>';
            btn.disabled = false;
        }, 1500);
    });

    // Spam Checker
    document.getElementById('checkSpamBtn')?.addEventListener('click', () => {
        const input = document.getElementById('spamInput').value;
        if (!input) {
            showNotification('Please paste your email content', 'info');
            return;
        }

        const btn = document.getElementById('checkSpamBtn');
        btn.innerHTML = '<span>⌛</span> <span>Checking...</span>';
        btn.disabled = true;

        setTimeout(() => {
            document.getElementById('spamResults').classList.remove('hidden');
            btn.innerHTML = '<span>🤖</span> <span>Check Spam Score</span>';
            btn.disabled = false;
        }, 2000);
    });

    // Name Extractor
    document.getElementById('extractNamesBtn')?.addEventListener('click', () => {
        const input = document.getElementById('nameInput').value;
        if (!input) {
            showNotification('Please enter some email addresses', 'info');
            return;
        }

        const btn = document.getElementById('extractNamesBtn');
        btn.innerHTML = '<span>⌛</span> <span>Extracting...</span>';
        btn.disabled = true;

        setTimeout(() => {
            document.getElementById('nameResults').classList.remove('hidden');
            btn.innerHTML = '<span>🤖</span> <span>Extract Names</span>';
            btn.disabled = false;
        }, 1500);
    });
}

// ===================================
// MODAL MANAGEMENT
// ===================================

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Close modal on backdrop click
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-backdrop')) {
        closeModal(e.target.id);
    }
});

// Close modal on ESC key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal-backdrop.active').forEach(modal => {
            closeModal(modal.id);
        });
    }
});

// ===================================
// NOTIFICATIONS
// ===================================

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? 'var(--gradient-success)' :
            type === 'error' ? 'var(--gradient-accent)' :
                type === 'warning' ? 'var(--gradient-warm)' :
                    'var(--gradient-primary)'};
        color: white;
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-xl);
        z-index: 10000;
        font-weight: 600;
        animation: slideIn 0.3s ease-out;
        max-width: 400px;
    `;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Add fadeOut animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        from {
            opacity: 1;
            transform: translateY(0);
        }
        to {
            opacity: 0;
            transform: translateY(-20px);
        }
    }
`;
document.head.appendChild(style);

// ===================================
// DATA PERSISTENCE
// ===================================

function loadSavedData() {
    // Load campaigns
    const savedCampaigns = localStorage.getItem('campaigns');
    if (savedCampaigns) {
        AppState.campaigns = JSON.parse(savedCampaigns);
    }

    // Load templates
    const savedTemplates = localStorage.getItem('templates');
    if (savedTemplates) {
        AppState.templates = JSON.parse(savedTemplates);
    }

    // Load contacts
    const savedContacts = localStorage.getItem('contacts');
    if (savedContacts) {
        AppState.contacts = JSON.parse(savedContacts);
    }
}

function saveCampaigns() {
    localStorage.setItem('campaigns', JSON.stringify(AppState.campaigns));
}

function saveTemplates() {
    localStorage.setItem('templates', JSON.stringify(AppState.templates));
}

function saveContacts() {
    localStorage.setItem('contacts', JSON.stringify(AppState.contacts));
}

// ===================================
// UTILITY FUNCTIONS
// ===================================

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function formatNumber(num) {
    return num.toLocaleString();
}

function calculatePercentage(part, total) {
    if (total === 0) return 0;
    return ((part / total) * 100).toFixed(1);
}

// ===================================
// ANALYTICS & CHARTS
// ===================================

function updateDashboardStats() {
    // This would typically fetch real data from a backend
    // For now, we're using the static data in the HTML
    console.log('Dashboard stats updated');
}

// ===================================
// EXPORT FUNCTIONS
// ===================================

window.closeModal = closeModal;
window.openModal = openModal;
window.showPage = showPage;
window.showNotification = showNotification;

console.log('🚀 Scoutier Email Outreach Platform loaded successfully!');
