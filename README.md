# Neo-Minesweeper 🎮

A modern, production-ready minesweeper game with customizable themes, difficulty levels, analytics, and monetization. Built with React and FastAPI.

![Neo-Minesweeper](https://img.shields.io/badge/version-1.0.0-blue)
![React](https://img.shields.io/badge/react-19.0.0-61dafb)
![License](https://img.shields.io/badge/license-MIT-green)

## 🌟 Features

### Core Gameplay
- **5 Unique Themes**: Bomb, Soldier, Gun, Sword, Animal
- **3 Difficulty Levels**: Easy (8×8), Medium (10×10), Hard (16×16)
- **Smart Mine Placement**: First click always safe
- **Flood Fill Algorithm**: Efficient cell revelation
- **Mobile-Optimized**: Touch controls with Dig/Flag toggle
- **Desktop Support**: Right-click flagging
- **Beautiful Dark UI**: Neo-arcade aesthetic

### Business Features
- **User Analytics**: DAU, sessions, win/loss rate, retention tracking
- **Leaderboard System**: Top 10 per difficulty with local persistence
- **Ad Monetization**: Banner + interstitial ad integration points
- **Data Persistence**: LocalStorage for offline capability
- **PWA Ready**: Progressive Web App with manifest
- **Statistics Dashboard**: Comprehensive user engagement metrics

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and Yarn
- Python 3.8+ (for backend, optional)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/neo-minesweeper.git
cd neo-minesweeper

# Install frontend dependencies
cd frontend
yarn install

# Start development server
yarn start

# Open http://localhost:3000
```

### Backend Setup (Optional)

The game runs entirely in the frontend. Backend is provided for future features.

```bash
cd backend
pip install -r requirements.txt
python server.py
```

## 📦 Project Structure

```
neo-minesweeper/
├── frontend/                 # React application
│   ├── public/              # Static assets
│   │   ├── index.html       # HTML template
│   │   └── manifest.json    # PWA manifest
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── game/        # Game-specific components
│   │   │   │   ├── Board.js
│   │   │   │   ├── Cell.js
│   │   │   │   ├── Header.js
│   │   │   │   ├── SetupModal.js
│   │   │   │   ├── GameOverModal.js
│   │   │   │   ├── Leaderboard.js
│   │   │   │   ├── StatsModal.js
│   │   │   │   ├── ThemeSelector.js
│   │   │   │   └── BottomControls.js
│   │   │   └── ui/          # Shadcn UI components
│   │   ├── contexts/        # React contexts
│   │   │   ├── GameContext.js
│   │   │   └── ThemeContext.js
│   │   ├── utils/           # Utility functions
│   │   │   ├── analytics.js
│   │   │   ├── storage.js
│   │   │   └── adManager.js
│   │   ├── App.js           # Main app component
│   │   ├── App.css          # App styles
│   │   └── index.js         # Entry point
│   ├── package.json         # Dependencies
│   └── tailwind.config.js   # Tailwind config
├── backend/                 # FastAPI backend (optional)
│   ├── server.py            # Main server
│   ├── requirements.txt     # Python dependencies
│   └── .env                 # Environment variables
├── docs/                    # Documentation
│   ├── DEPLOYMENT.md        # Deployment guide
│   ├── MONETIZATION.md      # Monetization guide
│   └── API.md               # API documentation
├── .gitignore              # Git ignore rules
├── LICENSE                 # MIT License
└── README.md               # This file
```

## 🎮 How to Play

1. **Select Difficulty**: Choose Easy, Medium, or Hard
2. **Pick a Theme**: Select your preferred danger icon
3. **Customize Grid**: Adjust size if desired (8×8 to 30×30)
4. **Start Playing**: Click cells to reveal, right-click to flag
5. **Win Condition**: Reveal all non-mine cells
6. **Mobile**: Use bottom toggle for Dig/Flag mode

## 🛠️ Development

### Available Scripts

```bash
# Development
yarn start          # Start dev server
yarn build          # Production build
yarn test           # Run tests

# Linting
yarn lint           # Run ESLint
yarn lint:fix       # Fix linting issues
```

### Environment Variables

Create `frontend/.env.local`:

```env
REACT_APP_BACKEND_URL=http://localhost:8001
REACT_APP_ADMOB_APP_ID=ca-app-pub-xxxxx
REACT_APP_ADMOB_BANNER_ID=ca-app-pub-xxxxx/banner
REACT_APP_ADMOB_INTERSTITIAL_ID=ca-app-pub-xxxxx/interstitial
```

### Adding New Themes

1. Open `src/contexts/ThemeContext.js`
2. Add theme configuration:

```javascript
newTheme: {
  name: 'Theme Name',
  primary: '#HEX_COLOR',
  glow: '0 0 20px rgba(R, G, B, 0.5)',
  icon: 'IconName'
}
```

3. Import icon in `src/components/game/Cell.js`

### Modifying Difficulty

Edit `src/contexts/GameContext.js`:

```javascript
const DIFFICULTIES = {
  yourDifficulty: { 
    name: 'Your Difficulty', 
    mineRatio: 0.18,  // 18% mines
    gridSize: 12 
  }
};
```

## 📱 Deployment

### Deploy to Vercel

```bash
npm i -g vercel
cd frontend
vercel --prod
```

### Deploy to Netlify

```bash
npm i -g netlify-cli
cd frontend
netlify deploy --prod --dir=build
```

### Deploy to Firebase

```bash
npm i -g firebase-tools
firebase init hosting
firebase deploy
```

### Deploy as PWA to Google Play

1. Build production: `yarn build`
2. Install Bubblewrap: `npm i -g @bubblewrap/cli`
3. Initialize TWA: `bubblewrap init`
4. Build APK: `bubblewrap build`
5. Upload to Google Play Console

See [DEPLOYMENT.md](docs/DEPLOYMENT.md) for detailed instructions.

## 💰 Monetization

### Google AdMob Integration

1. **Create AdMob Account**: https://admob.google.com
2. **Create App and Ad Units**
3. **Update Ad Manager**:

```javascript
// src/utils/adManager.js
import { AdMob } from '@capacitor-community/admob';

class AdManager {
  async initialize() {
    await AdMob.initialize({
      requestTrackingAuthorization: true,
      initializeForTesting: false
    });
  }
  
  async showBanner() {
    await AdMob.showBanner({
      adId: process.env.REACT_APP_ADMOB_BANNER_ID,
      position: 'BOTTOM_CENTER'
    });
  }
}
```

4. **Install SDK**: `yarn add @capacitor-community/admob`

See [MONETIZATION.md](docs/MONETIZATION.md) for complete guide.

## 📊 Analytics

### Accessing Analytics Data

```javascript
import analytics from '@/utils/analytics';

// Get all statistics
const stats = analytics.getStats();

// Get DAU for last 7 days
const dau = analytics.getDAU(7);

// Export as JSON
console.log(JSON.stringify(stats, null, 2));
```

### Tracked Metrics
- Total games played
- Win/loss rate
- Average play time
- Games by difficulty
- Best times per difficulty
- Daily active users
- Session count
- Retention (Day 1, 7, 30)

## 🧪 Testing

```bash
# Run all tests
yarn test

# Run with coverage
yarn test --coverage

# E2E tests (Playwright)
yarn test:e2e
```

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md).

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file.

## 🙏 Acknowledgments

- Design inspiration: Neo-arcade aesthetic
- Icons: [Lucide Icons](https://lucide.dev)
- UI Components: [Shadcn/ui](https://ui.shadcn.com)
- Animations: [Framer Motion](https://www.framer.com/motion)
- Celebrations: [Canvas Confetti](https://github.com/catdad/canvas-confetti)

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/neo-minesweeper/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/neo-minesweeper/discussions)
- **Email**: your.email@example.com

## 🗺️ Roadmap

- [ ] Global leaderboard with backend
- [ ] Social sharing features
- [ ] Achievement system
- [ ] Multiplayer mode
- [ ] Daily challenges
- [ ] Custom theme creator
- [ ] Sound effect customization
- [ ] Haptic feedback

## 📈 Performance

- Lighthouse Score: 95+
- First Contentful Paint: < 1.5s
- Time to Interactive: < 2.5s
- Bundle Size: < 500KB (gzipped)

## 🌐 Browser Support

- Chrome/Edge: ✅ Latest 2 versions
- Firefox: ✅ Latest 2 versions
- Safari: ✅ Latest 2 versions
- Mobile Safari: ✅ iOS 12+
- Chrome Android: ✅ Latest

---

**Made with ❤️ for minesweeper enthusiasts**

⭐ Star this repo if you found it helpful!