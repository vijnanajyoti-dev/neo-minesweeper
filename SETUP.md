# Neo-Minesweeper Setup Guide

## Quick Start

### 1. Prerequisites
- Node.js 16+ and Yarn
- Python 3.8+ (optional, for backend)
- Git

### 2. Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Install dependencies
yarn install

# Create environment file
cp .env.example .env.local

# Edit .env.local with your configuration
# nano .env.local

# Start development server
yarn start

# Open http://localhost:3000
```

### 3. Backend Setup (Optional)

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create environment file
cp .env.example .env

# Edit .env with your configuration
# nano .env

# Start server
python server.py
```

### 4. First Run Checklist

- [ ] Dependencies installed
- [ ] Environment variables configured
- [ ] Development server running
- [ ] Game loads in browser
- [ ] All 5 themes working
- [ ] Difficulty levels functional
- [ ] Analytics tracking (check browser console)

## Next Steps

1. **Read Documentation**: Check `docs/` folder
2. **Configure AdMob**: For monetization (see MONETIZATION.md)
3. **Deploy**: Follow DEPLOYMENT.md
4. **Customize**: Modify themes, colors, grid sizes
5. **Test**: Run `yarn test` in frontend

## Need Help?

- Documentation: `docs/`
- Issues: Create GitHub issue
- Contributing: See CONTRIBUTING.md

## Resources

- Main README: `README.md`
- Deployment Guide: `docs/DEPLOYMENT.md`
- Monetization Guide: `docs/MONETIZATION.md`
- Contributing Guide: `CONTRIBUTING.md`

