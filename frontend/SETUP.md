# Frontend Setup & Installation Guide

## Overview
The AgriBOT frontend is a modern React dashboard built with Vite, TypeScript, and Tailwind CSS. It provides a clean, intuitive interface for farmers to access agricultural advisory services.

## Prerequisites

Ensure you have the following installed:
- **Node.js** 16.0 or higher (check with `node --version`)
- **npm** 7.0 or higher (check with `npm --version`)
- Your **backend API** running on `http://localhost:8000`

## Installation Steps

### Step 1: Navigate to Frontend Directory
```bash
cd agribot-pakistan/frontend
```

### Step 2: Install Dependencies
```bash
npm install
```

This will install all required packages:
- React & React DOM
- TypeScript
- Vite
- Tailwind CSS
- Axios
- And more...

### Step 3: Configure Environment (Optional)
Create a `.env.local` file if you want to use a different API URL:

```bash
cp .env.example .env.local
```

Edit `.env.local` if needed:
```env
VITE_API_URL=http://localhost:8000
```

### Step 4: Start Development Server
```bash
npm run dev
```

The app will start at:
```
http://localhost:5173
```

Your terminal will show:
```
  VITE v5.0.8  ready in 123 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

## Features Overview

### 🎨 User Interface
- **Header**: Logo, title, and theme toggle button (☀️/🌙)
- **Tab Navigation**: 5 main sections for different agricultural services
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Custom Emojis**: Agricultural-themed emojis throughout the UI

### 🌙 Dark/Light Theme
- Toggle button in the header (top-right)
- Preference saved in browser's localStorage
- Automatically matches system preference on first visit
- Smooth transitions between themes

### 📋 Available Tabs

1. **Disease Detection** 🦠
   - Upload plant images
   - AI-powered disease analysis
   - Shows disease name, confidence %, severity, and treatment

2. **Weather** ☀️
   - Enter location (e.g., "Lahore", "Pakistan")
   - Get temperature, humidity, rainfall, and weather condition

3. **Irrigation** 💧
   - Select crop type (Wheat, Cotton, Rice, etc.)
   - Input location
   - Receive water requirement and irrigation schedule

4. **Fertilizer** 🧪
   - Choose crop type
   - Select soil type (Loam, Clay, Sandy, Silt)
   - Get fertilizer type, quantity, and application timing

5. **Advisory** 🌿
   - Ask agricultural questions
   - Receive expert advice from the AI

## Development Commands

### Run Development Server
```bash
npm run dev
```
- Hot Module Replacement (HMR) enabled
- Changes appear instantly without reload

### Build for Production
```bash
npm run build
```
- Optimized bundle in `dist/` folder
- Minified and tree-shaken code
- Ready to deploy

### Preview Production Build
```bash
npm run preview
```
- Test the production build locally
- Good for checking optimization

### Run Linter (Optional)
```bash
npm run lint
```
- Checks for code quality issues
- Requires ESLint setup

## Troubleshooting

### Issue: Port 5173 Already in Use
```bash
npm run dev -- --port 3000
```
Use a different port if 5173 is occupied.

### Issue: API Connection Errors
**Problem**: `Failed to fetch from API`

**Solution**:
1. Ensure backend is running:
   ```bash
   # In backend directory
   python main.py
   ```
2. Check `VITE_API_URL` in `.env.local`
3. Check browser console for CORS errors
4. Verify backend port is 8000

### Issue: Theme Not Working
**Problem**: Dark mode toggle not working

**Solution**:
1. Clear browser cache and cookies
2. Check localStorage is enabled (DevTools → Application → Local Storage)
3. Refresh the page

### Issue: Styles Not Applying
**Problem**: Tailwind CSS classes not working

**Solution**:
1. Ensure `npm install` completed successfully
2. Restart dev server: `npm run dev`
3. Clear browser cache (Ctrl+Shift+Delete)

### Issue: TypeScript Errors
**Problem**: Type errors in components

**Solution**:
1. Check `tsconfig.json` configuration
2. Run `npm install` to update types
3. Restart VS Code if using it

## Project Structure

```
frontend/
├── src/
│   ├── components/           # React components
│   │   ├── Dashboard.tsx     # Main dashboard
│   │   ├── Header.tsx        # Navigation header
│   │   └── UI.tsx            # Reusable components
│   ├── context/              # React context
│   │   └── ThemeContext.tsx  # Theme provider
│   ├── lib/                  # Utilities
│   │   ├── api.ts            # API client
│   │   └── emojis.ts         # Emoji constants
│   ├── App.tsx               # Root component
│   ├── main.tsx              # Entry point
│   └── index.css             # Global styles
├── index.html                # HTML template
├── package.json              # Dependencies
├── tsconfig.json             # TypeScript config
├── vite.config.ts            # Vite config
├── tailwind.config.js        # Tailwind config
├── postcss.config.js         # PostCSS config
├── README.md                 # Project readme
└── .env.example              # Environment template
```

## Deployment

### Option 1: Vercel (Recommended for React)
```bash
npm install -g vercel
vercel
```

### Option 2: Netlify
```bash
npm run build
# Drag & drop dist/ folder to Netlify
```

### Option 3: Traditional Server
```bash
npm run build
# Upload dist/ folder to your web server
```

### Option 4: Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

## Browser Support

✅ Fully supported:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

⚠️ Partial support:
- Chrome Mobile
- Safari iOS 14+

❌ Not supported:
- Internet Explorer (any version)

## Performance Tips

1. **Use production build for deployment**
   ```bash
   npm run build
   ```

2. **Lazy load images** (already implemented)

3. **Enable GZIP compression** on your server

4. **Use a CDN** for static assets

5. **Monitor with DevTools** (F12 → Performance tab)

## Next Steps

1. ✅ Install dependencies
2. ✅ Start development server
3. ✅ Open `http://localhost:5173` in browser
4. ✅ Test all features with your backend
5. ✅ Customize theme colors if needed
6. ✅ Deploy to production

## Getting Help

**Check these resources**:
- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Tailwind CSS Docs](https://tailwindcss.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

## Common Customizations

### Change Primary Color
Edit `tailwind.config.js`:
```javascript
colors: {
  primary: {
    600: '#your-color',
    // ... other shades
  }
}
```

### Add More Emojis
Edit `src/lib/emojis.ts`:
```typescript
export const EMOJIS = {
  newFeature: '🆕',
  // ...
}
```

### Add New Page
1. Create new component in `src/components/`
2. Import in `Dashboard.tsx`
3. Add to tab navigation

---

**Your frontend is ready! 🎉**

Start developing with `npm run dev`
