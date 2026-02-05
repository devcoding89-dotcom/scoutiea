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
    renderContactLists();
    updateContactDropdowns();
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
        // Skip toggle buttons that are not direct page links
        if (!link.hasAttribute('data-page')) return;

        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.getAttribute('data-page');
            showPage(page);
        });
    });

    // Menu toggles
    const outreachBtn = document.getElementById('outreachMenuBtn');
    if (outreachBtn) {
        outreachBtn.addEventListener('click', () => {
            const submenu = document.getElementById('outreachSubmenu');
            const isExpanded = outreachBtn.getAttribute('aria-expanded') === 'true';

            outreachBtn.setAttribute('aria-expanded', !isExpanded);
            submenu.classList.toggle('open');
        });
    }

    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const sidebar = document.getElementById('sidebar');

    if (mobileMenuBtn && sidebar && sidebarOverlay) {
        mobileMenuBtn.addEventListener('click', () => {
            const isActive = sidebar.classList.toggle('active');
            sidebarOverlay.classList.toggle('active');
            document.getElementById('menuIcon').textContent = isActive ? '✕' : '☰';
        });

        // Close sidebar when clicking overlay
        sidebarOverlay.addEventListener('click', () => {
            sidebar.classList.remove('active');
            sidebarOverlay.classList.remove('active');
            document.getElementById('menuIcon').textContent = '☰';
        });
    }

    // Theme toggle

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

    // Toggle sidebar visibility for auth pages
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.querySelector('.main-content');

    if (isAuthPage) {
        sidebar.style.display = 'none';
        mainContent.style.marginLeft = '0';
    } else {
        sidebar.style.display = 'flex';
        // Reset styles that might have been set by auth page logic
        if (window.innerWidth > 1024) {
            mainContent.style.marginLeft = '280px';
        } else {
            mainContent.style.marginLeft = '0';
        }
    }

    // On mobile, close sidebar after navigation
    if (window.innerWidth <= 768) {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebarOverlay');
        if (sidebar && sidebar.classList.contains('active')) {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
            document.getElementById('menuIcon').textContent = '☰';
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

                // If link is inside a submenu, ensure submenu is open
                const parentItem = link.closest('.nav-wrapper');
                if (parentItem) {
                    const submenu = parentItem.querySelector('.nav-submenu');
                    const toggleBtn = parentItem.querySelector('button.nav-link');

                    if (submenu && toggleBtn) {
                        submenu.classList.add('open');
                        toggleBtn.setAttribute('aria-expanded', 'true');
                    }
                }
            }
        });

        // Always refresh contact UI when showing a page to ensure dropdowns are sync'd
        renderContactLists();
        updateContactDropdowns();
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
    const reader = new FileReader();

    reader.onload = function (e) {
        const content = e.target.result;
        const lines = content.split(/\r?\n/);
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        const validEmailsList = new Set();
        let invalidOrDuplicateCount = 0;
        let totalCandidateCount = 0;

        lines.forEach(line => {
            // Split by comma, semicolon, or whitespace to find potential emails
            const parts = line.split(/[,\s;]+/);
            parts.forEach(part => {
                const trimmed = part.trim();
                if (trimmed) {
                    totalCandidateCount++;
                    const lowerEmail = trimmed.toLowerCase();
                    if (emailRegex.test(trimmed)) {
                        if (validEmailsList.has(lowerEmail)) {
                            invalidOrDuplicateCount++;
                        } else {
                            validEmailsList.add(lowerEmail);
                        }
                    } else {
                        invalidOrDuplicateCount++;
                    }
                }
            });
        });

        const totalFound = totalCandidateCount;
        const validCount = validEmailsList.size;

        if (validCount === 0) {
            showNotification('No valid emails found. Please ensure your file is a CSV or TXT with standard email addresses.', 'error');
            document.getElementById('uploadProgress').classList.add('hidden');
            return;
        }

        const contactList = {
            id: Date.now(),
            name: file.name,
            total: totalFound,
            valid: validCount,
            duplicates: invalidOrDuplicateCount,
            date: new Date().toISOString()
        };

        // Save to state and persistence
        AppState.contacts.push(contactList);
        saveContacts();

        // Update UI
        document.getElementById('totalContacts').textContent = totalFound.toLocaleString();
        document.getElementById('validEmails').textContent = validCount.toLocaleString();
        document.getElementById('duplicates').textContent = invalidOrDuplicateCount.toLocaleString();

        document.getElementById('uploadResults').classList.remove('hidden');

        renderContactLists();
        updateContactDropdowns();

        showNotification(`Processed ${totalFound} entries. Found ${validCount} valid emails! ✅`, 'success');
    };

    reader.onerror = function () {
        showNotification('Error reading file. Please try a different format.', 'error');
    };

    reader.readAsText(file);
}

function renderContactLists() {
    const container = document.getElementById('contactListContainer');
    if (!container) return;

    if (AppState.contacts.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 2rem 1rem;">
                <div style="font-size: 3rem; margin-bottom: 1rem;">👥</div>
                <h4 style="margin-bottom: 0.5rem;">No contact lists yet</h4>
                <p class="text-secondary">Upload a CSV or Excel file to get started</p>
            </div>
        `;
        return;
    }

    let html = `
        <div class="table-container">
            <table class="table">
                <thead>
                    <tr>
                        <th>List Name</th>
                        <th>Total</th>
                        <th>Valid</th>
                        <th>Date</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
    `;

    AppState.contacts.slice().reverse().forEach(list => {
        html += `
            <tr>
                <td class="font-semibold">${list.name}</td>
                <td>${list.total.toLocaleString()}</td>
                <td><span style="color: var(--accent-green)">${list.valid.toLocaleString()}</span></td>
                <td class="text-sm text-secondary">${formatDate(list.date)}</td>
                <td>
                    <button class="btn btn-outline btn-sm" onclick="deleteContactList(${list.id})">🗑️</button>
                </td>
            </tr>
        `;
    });

    html += `
                </tbody>
            </table>
        </div>
    `;

    container.innerHTML = html;
}

function updateContactDropdowns() {
    const select = document.getElementById('campaignContactSelect');
    if (!select) return;

    if (AppState.contacts.length === 0) {
        select.innerHTML = '<option value="">No contact lists yet - Upload contacts first</option>';
        return;
    }

    let html = '<option value="">Select a contact list</option>';
    AppState.contacts.forEach(list => {
        html += `<option value="${list.id}">${list.name} (${list.total} contacts)</option>`;
    });

    select.innerHTML = html;
}

function deleteContactList(id) {
    if (confirm('Are you sure you want to delete this contact list?')) {
        AppState.contacts = AppState.contacts.filter(list => list.id !== id);
        saveContacts();
        renderContactLists();
        updateContactDropdowns();
        showNotification('Contact list deleted', 'info');
    }
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
