# Email Outreach Platform

A premium email outreach application with bulk email campaigns, AI-powered tools, analytics, and smart automation.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-1.0.0-green.svg)

## 🚀 Features

- **📊 Dashboard** - Performance stats & campaign overview
- **🚀 Campaign Builder** - Personalized bulk emails with dynamic tokens
- **👥 Contact Manager** - CSV/Excel upload with duplicate detection
- **📝 Template Library** - Save & reuse successful campaigns
- **📈 Analytics** - Track opens, responses, and performance metrics
- **🤖 AI Tools** - Grammar check, subject analyzer, spam checker, name extractor
- **⚙️ Settings** - Email configuration & preferences
- **🌙 Dark/Light Mode** - Premium design with smooth animations

## 🎨 Design Features

- ✨ Premium dark mode (toggleable to light mode)
- 🎨 Glassmorphism effects
- 🌈 Vibrant gradient accents
- ⚡ Smooth animations and micro-interactions
- 📱 Fully responsive design

## 🛠️ Technology Stack

- **HTML5** - Semantic structure
- **CSS3** - Modern design system with CSS variables
- **Vanilla JavaScript** - SPA functionality, no dependencies
- **Local Storage** - Data persistence

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/email-outreach-platform.git
```

2. Navigate to the project directory:
```bash
cd email-outreach-platform
```

3. Open `index.html` in your browser:
```bash
# On Windows
start index.html

# On macOS
open index.html

# On Linux
xdg-open index.html
```

That's it! No build process or dependencies required.

## 🚀 Usage

### 1. Upload Contacts
- Navigate to the **Contacts** page
- Upload a CSV or Excel file with email addresses
- Review the upload summary (total, valid, duplicates removed)

### 2. Create a Campaign
- Go to the **Campaigns** page
- Fill in campaign details
- Use personalization tokens: `{{firstName}}`, `{{company}}`, etc.
- Preview your email
- Launch or schedule the campaign

### 3. Monitor Performance
- Check the **Dashboard** for an overview
- Visit **Analytics** for detailed metrics
- Track open rates, response rates, and engagement

### 4. Use AI Tools
- **Grammar Checker** - Analyze tone and fix errors
- **Subject Line Analyzer** - Predict open rates
- **Spam Checker** - Ensure inbox delivery
- **Name Extractor** - Extract names from email addresses

## 📁 File Structure

```
email-outreach-platform/
├── index.html      # Main application (SPA structure)
├── style.css       # Design system & styling
├── app.js          # Application logic & interactivity
└── README.md       # This file
```

## 🎯 Personalization Tokens

Use these tokens in your email subject and body:

- `{{firstName}}` - Recipient's first name
- `{{lastName}}` - Recipient's last name
- `{{email}}` - Recipient's email address
- `{{company}}` - Company name
- `{{position}}` - Job title

## 🌟 Key Features Explained

### Campaign Management
- Bulk personalized emails
- Token-based personalization
- Campaign scheduling
- Speed control (100-500 emails/hour)
- Email preview with sample data

### Contact Management
- CSV/Excel file upload
- Drag & drop interface
- Automatic duplicate detection
- Email validation
- Multiple contact lists

### AI-Powered Tools
- Grammar and tone analysis
- Subject line optimization
- Spam score checking
- Automatic name extraction

### Analytics & Insights
- Performance dashboard
- Open/response rate tracking
- Best performing send times
- Campaign comparisons
- Trend analysis

## 🎨 Customization

### Changing Theme Colors

Edit the CSS variables in `style.css`:

```css
:root {
  --primary-500: #6366f1;
  --accent-purple: #a855f7;
  /* Add your custom colors */
}
```

### Adding New Features

The application uses a simple SPA structure. To add a new page:

1. Add a navigation link in the sidebar
2. Create a new page section in `index.html`
3. Add the page logic in `app.js`

## 📊 Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Inspired by modern email outreach platforms
- Built with modern web standards
- Designed for simplicity and performance

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

**Made with ❤️ for email marketers and outreach professionals**
