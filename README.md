# VTMFASHION - Premium E-Commerce Website

A modern, responsive single-page e-commerce website for selling fashion products online with an integrated admin panel.

## 🌟 Features

### Customer-Facing Website
- **Premium Modern Design** - Dark theme with smooth animations and glassmorphism effects
- **Product Showcase** - High-quality product images with detailed information
- **Interactive Selection** - Size and color selection with visual feedback
- **WhatsApp Integration** - Direct ordering via WhatsApp with pre-filled product details
- **Responsive Design** - Fully optimized for mobile, tablet, and desktop
- **SEO Optimized** - Proper meta tags, semantic HTML, and fast loading
- **Contact Section** - WhatsApp and social media links
- **Professional Footer** - Company information and quick links

### Admin Panel
- **Secure Authentication** - Login system to protect admin access
- **Dashboard Overview** - Quick stats showing product status, price, sizes, and colors
- **Product Management** - Add, edit, and update product details
- **Live Preview** - See changes in real-time before publishing
- **Easy Updates** - Update price, sizes, colors, stock availability
- **Image Management** - Support for external image URLs
- **User-Friendly Interface** - Intuitive design for easy management

## 📁 Project Structure

```
vtmfashion/
├── index.html          # Main customer-facing page
├── styles.css          # Main website styles
├── script.js           # Main website functionality
├── admin.html          # Admin panel page
├── admin-styles.css    # Admin panel styles
├── admin-script.js     # Admin panel functionality
└── README.md           # This file
```

## 🚀 Getting Started

### Local Development

1. **Clone or download** the project files to your computer

2. **Open the website** by opening `index.html` in your web browser

3. **Access the admin panel** by opening `admin.html` in your web browser

### Admin Login Credentials

```
Username: xxxxxxxx
Password: xxxxxxxxx
```

**⚠️ IMPORTANT:** Change these credentials in `admin-script.js` before deploying to production!

## 🛠️ Configuration

### WhatsApp Number

Update the WhatsApp number in `script.js`:

```javascript
const WHATSAPP_NUMBER = "xxxxxxxxx"; // Change to your number
```

### Admin Credentials

Update credentials in `admin-script.js`:

```javascript
const ADMIN_CREDENTIALS = {
    username: 'xxxxxxx',
    password: 'xxxxxxxxxx'
};
```

### Default Product

The default product is configured in both `script.js` and `admin-script.js`. You can modify it or use the admin panel to update it.

## 📱 How to Use

### For Customers

1. Visit the website
2. View the featured product
3. Select desired size and color
4. Click "Buy Now via WhatsApp"
5. Complete the order through WhatsApp

### For Admins

1. Navigate to `admin.html`
2. Login with credentials
3. View dashboard statistics
4. Update product details:
   - Product name and description
   - Price
   - Product image URL
   - Available sizes (comma-separated)
   - Available colors (name + color picker)
   - Stock status
5. See live preview of changes
6. Click "Update Product" to save changes

## 🌐 Deployment Options

### Option 1: GitHub Pages (Free)

1. Create a GitHub account at https://github.com
2. Create a new repository
3. Upload all project files
4. Go to Settings → Pages
5. Select main branch and save
6. Your site will be live at `https://yourusername.github.io/repository-name`

### Option 2: Netlify (Free)

1. Create account at https://netlify.com
2. Drag and drop your project folder
3. Your site will be live instantly
4. Get a free subdomain like `yoursite.netlify.app`
5. Can add custom domain later

### Option 3: Vercel (Free)

1. Create account at https://vercel.com
2. Import your project from GitHub or upload directly
3. Deploy with one click
4. Get a free subdomain like `yoursite.vercel.app`

### Option 4: Firebase Hosting (Free)

1. Create account at https://firebase.google.com
2. Install Firebase CLI: `npm install -g firebase-tools`
3. Run `firebase init hosting`
4. Deploy with `firebase deploy`

## 🎨 Customization

### Colors

Edit CSS variables in `styles.css` and `admin-styles.css`:

```css
:root {
    --primary-color: #6366f1;
    --secondary-color: #ec4899;
    --accent-color: #f59e0b;
    /* ... more colors */
}
```

### Fonts

Current fonts: Inter (body) and Playfair Display (headings)

To change fonts, update the Google Fonts link in HTML files and CSS font variables.

### Social Media Links

Update social media links in `index.html`:

```html
<a href="YOUR_FACEBOOK_URL" class="social-icon facebook">
<a href="YOUR_INSTAGRAM_URL" class="social-icon instagram">
<a href="YOUR_TWITTER_URL" class="social-icon twitter">
```

## 📊 Data Storage

The website uses **localStorage** to store product data. This means:
- ✅ No backend required
- ✅ Data persists between sessions
- ✅ Fast and simple
- ⚠️ Data is stored locally in the browser
- ⚠️ Clearing browser data will reset to defaults

For production use with multiple products, consider integrating a backend service like:
- Firebase Realtime Database
- Supabase
- MongoDB Atlas
- Custom Node.js backend

## 🔒 Security Notes

**For Production Deployment:**

1. **Change Admin Credentials** - Update username and password
2. **Use HTTPS** - All deployment platforms provide free SSL
3. **Backend Authentication** - Consider implementing proper backend authentication
4. **Environment Variables** - Store sensitive data in environment variables
5. **Rate Limiting** - Implement rate limiting for admin login attempts

## 📞 Support & Contact

For support or questions about this website:
- WhatsApp: +94 xxxxxxxxxxx
- Email: info@vtmfashion.com

## 📝 License

This project is created for VTMFASHION. All rights reserved.

## 🎯 Future Enhancements

Potential features to add:
- Multiple products support
- Shopping cart functionality
- Customer order tracking
- Email notifications
- Payment gateway integration
- Product reviews and ratings
- Inventory management
- Analytics dashboard
- Multi-language support

## 🙏 Credits

- Design & Development: vtx Team
- Fonts: Google Fonts (Inter, Playfair Display)
- Icons: Heroicons
- Images: Unsplash (replace with your own)

---

**Made with ❤️ for VTMFASHION**



