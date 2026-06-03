# AgriBOT Frontend

A modern, clean React dashboard for agricultural advisory with disease detection, weather forecasting, irrigation guidance, and fertilizer recommendations.

## Features

✨ **Modern UI Design**
- Clean, minimalist interface with custom emojis
- Responsive design for desktop and mobile
- Smooth animations and transitions

🌙 **Theme Support**
- Light and dark theme toggle
- Persistent theme preference in localStorage
- System preference detection

🎯 **Core Features**
- **Disease Detection**: Upload plant images for AI-powered disease analysis
- **Weather Data**: Real-time weather information for your location
- **Irrigation Guide**: Personalized irrigation schedules based on crop type
- **Fertilizer Advice**: Customized fertilizer recommendations
- **Expert Advisory**: Ask agricultural questions and get expert responses

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Fast build tool & dev server
- **Tailwind CSS** - Utility-first styling
- **Axios** - API client

## Quick Start

### Prerequisites
- Node.js 16+ and npm/yarn
- Backend API running on `http://localhost:8000`

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create environment file:**
   ```bash
   cp .env.example .env.local
   ```

   Configure if needed:
   ```env
   VITE_API_URL=http://localhost:8000
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The compiled files will be in the `dist/` directory.

Preview the build locally:
```bash
npm run preview
```

## Project Structure

```
src/
├── components/         # React components
│   ├── Dashboard.tsx   # Main dashboard with all features
│   ├── Header.tsx      # Navigation header with theme toggle
│   └── UI.tsx          # Reusable UI components (Card, Button, etc.)
├── context/            # React context providers
│   └── ThemeContext.tsx # Light/dark theme management
├── lib/                # Utility functions
│   ├── api.ts          # Backend API client
│   └── emojis.ts       # Custom emoji definitions
├── App.tsx             # Main app component
├── main.tsx            # Entry point
└── index.css           # Global styles with Tailwind
```

## Key Components

### Dashboard (`Dashboard.tsx`)
Main component with 5 tabs:
- **Disease Detection**: Image upload and analysis
- **Weather**: Location-based weather data
- **Irrigation**: Crop-specific irrigation schedules
- **Fertilizer**: Soil-type based fertilizer recommendations
- **Advisory**: Chat-like expert consultation

### Theme Context (`ThemeContext.tsx`)
Manages light/dark mode across the app:
- Automatic dark class application to document
- localStorage persistence
- System preference fallback

### Reusable Components (`UI.tsx`)
- `Card` - Styled container component
- `Button` - Customizable button with variants
- `Badge` - Status/tag badge with emoji support
- `LoadingSpinner` - Animated loading indicator

## Styling

Uses **Tailwind CSS** with custom theme extensions:
- Primary green color scheme (`primary-*`)
- Earth tones (`earth-*`)
- Custom shadows for elevation
- Dark mode support throughout

### Custom Colors
- **Primary**: Green shades (agricultural theme)
- **Earth**: Brown/tan shades (soil/natural theme)

## API Integration

All API calls go through `src/lib/api.ts`:

```typescript
// Disease analysis
await analyzeDiseaseImage(imageFile)

// Weather data
await getWeatherData(location)

// Irrigation advice
await getIrrigationAdvice(cropType, location)

// Fertilizer advice
await getFertilizerAdvice(cropType, soilType)

// General advisory
await getAgricultureAdvice(query)
```

Ensure your backend API is running and accessible at the configured `VITE_API_URL`.

## Customization

### Emojis
Edit `src/lib/emojis.ts` to change custom emoji usage throughout the app:
```typescript
export const EMOJIS = {
  disease: '🦠',
  water: '💧',
  // ... more emojis
}
```

### Colors
Modify `tailwind.config.js` to adjust the color scheme:
```javascript
colors: {
  primary: { /* green shades */ },
  earth: { /* brown shades */ },
}
```

### UI Components
Extend reusable components in `src/components/UI.tsx` for consistent styling.

## Performance Tips

- Images are lazy-loaded
- CSS is purged in production builds
- Smooth animations via hardware acceleration
- Responsive images for different screen sizes

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Development Tips

### Hot Module Replacement (HMR)
Vite's HMR is automatically configured. Changes to components will reflect instantly.

### TypeScript
Strict mode is enabled. Run `tsc` to check for type errors without building.

### ESLint (Optional)
```bash
npm run lint
```

## Deployment

1. **Build the app:**
   ```bash
   npm run build
   ```

2. **Deploy the `dist/` folder** to your hosting service:
   - Vercel (recommended for React)
   - Netlify
   - AWS S3 + CloudFront
   - Docker container
   - Any static file server

3. **Set environment variables** on your hosting platform:
   ```
   VITE_API_URL=<your-backend-api-url>
   ```

## Troubleshooting

### API Connection Issues
- Ensure backend is running on the correct port
- Check `VITE_API_URL` environment variable
- Browser console will show CORS/network errors

### Theme Not Persisting
- Check localStorage is enabled in browser
- Clear browser cache and reload

### Styling Issues in Dark Mode
- Ensure Tailwind's `darkMode: 'class'` is set in config
- Add `dark` class to `<html>` element when switching themes

## License

MIT

## Support

For issues or questions about the AgriBOT frontend, please contact the development team.

---

Built with ❤️ for farmers in Pakistan
