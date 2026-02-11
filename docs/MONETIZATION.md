# Monetization Guide

## Revenue Streams

### 1. Google AdMob (Primary)
### 2. In-App Purchases
### 3. Premium Version
### 4. Sponsorships
### 5. Affiliate Marketing

---

## Google AdMob Integration

### Setup Steps

**1. Create AdMob Account**

1. Go to [AdMob](https://admob.google.com)
2. Sign in with Google account
3. Click "Get Started"
4. Complete registration

**2. Create App**

1. Click "Apps" in sidebar
2. Click "Add App"
3. Select platform (Android/iOS)
4. Enter app details:
   - Name: Neo-Minesweeper
   - Platform: Android/iOS
   - App store URL: (if published)

**3. Create Ad Units**

Create these ad units:

- **Banner Ad**
  - Format: Banner
  - Size: Smart Banner (recommended)
  - Name: "Neo-Minesweeper Banner"
  
- **Interstitial Ad**
  - Format: Interstitial
  - Name: "Neo-Minesweeper Interstitial"

**4. Get Ad Unit IDs**

Copy the Ad Unit IDs (format: ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY)

### Implementation

**Install AdMob SDK**

For Web/PWA:
```bash
yarn add @capacitor-community/admob
```

For React Native:
```bash
yarn add react-native-google-mobile-ads
```

**Update Environment Variables**

`.env.production`:
```env
REACT_APP_ADMOB_APP_ID=ca-app-pub-XXXXXXXXXXXXXXXX~YYYYYYYYYY
REACT_APP_ADMOB_BANNER_ID=ca-app-pub-XXXXXXXXXXXXXXXX/BANNER_ID
REACT_APP_ADMOB_INTERSTITIAL_ID=ca-app-pub-XXXXXXXXXXXXXXXX/INTERSTITIAL_ID
```

**Update Ad Manager**

`src/utils/adManager.js`:

```javascript
import { AdMob, BannerAdOptions, BannerAdSize } from '@capacitor-community/admob';

class AdManager {
  constructor() {
    this.adsEnabled = true;
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return;
    
    try {
      await AdMob.initialize({
        requestTrackingAuthorization: true,
        initializeForTesting: false, // Set true for testing
        testDeviceIds: ['YOUR_TEST_DEVICE_ID'] // For testing
      });
      
      this.initialized = true;
      console.log('AdMob initialized');
    } catch (error) {
      console.error('AdMob initialization failed:', error);
    }
  }

  async showBanner() {
    if (!this.adsEnabled || !this.initialized) return;
    
    try {
      const options = {
        adId: process.env.REACT_APP_ADMOB_BANNER_ID,
        adSize: BannerAdSize.SMART_BANNER,
        position: 'BOTTOM_CENTER',
        margin: 0
      };
      
      await AdMob.showBanner(options);
    } catch (error) {
      console.error('Failed to show banner:', error);
    }
  }

  async hideBanner() {
    try {
      await AdMob.hideBanner();
    } catch (error) {
      console.error('Failed to hide banner:', error);
    }
  }

  async showInterstitial() {
    if (!this.adsEnabled || !this.initialized) return;
    
    try {
      // Prepare interstitial
      await AdMob.prepareInterstitial({
        adId: process.env.REACT_APP_ADMOB_INTERSTITIAL_ID
      });
      
      // Show interstitial
      await AdMob.showInterstitial();
    } catch (error) {
      console.error('Failed to show interstitial:', error);
    }
  }
}

export default new AdManager();
```

### Revenue Optimization

**1. Ad Placement Strategy**

- **Banner**: Show during gameplay (non-intrusive)
- **Interstitial**: Show every 3-5 games at natural break points
- **Never show ads**:
  - During active gameplay
  - On win screen (bad UX)
  - More than once per minute

**2. eCPM Optimization**

```javascript
// Implement mediation for higher eCPM
const mediationConfig = {
  networks: [
    'admob',      // Primary
    'facebook',   // Secondary
    'unity',      // Fill rate
    'applovin'    // Backup
  ]
};
```

**3. User Segmentation**

```javascript
// Show different ads based on user value
const adStrategy = {
  newUsers: 'gentle',      // Fewer ads
  activeUsers: 'standard', // Normal frequency
  whales: 'none'          // Offer premium instead
};
```

### Expected Revenue

**Estimates (US traffic)**:

- **Banner CPM**: $0.50 - $2.00
- **Interstitial CPM**: $3.00 - $8.00
- **Average eCPM**: $2.00 - $4.00

**Monthly Revenue Formula**:
```
Revenue = (DAU × Sessions/User × Impressions/Session × eCPM) / 1000

Example:
- 1,000 DAU
- 3 sessions per user
- 2 impressions per session
- $3 eCPM
= (1000 × 3 × 2 × $3) / 1000 = $18/day = $540/month
```

---

## In-App Purchases

### Premium Features to Offer

1. **Ad Removal** - $2.99 one-time
   - Remove all ads permanently
   - Most popular IAP

2. **Theme Pack** - $0.99 one-time
   - Unlock exclusive themes
   - Seasonal themes

3. **Power-Ups** - $0.99 - $4.99
   - Hint system (reveal safe cell)
   - Undo move
   - Time freeze

4. **Premium Subscription** - $2.99/month
   - Ad-free
   - Exclusive themes
   - Priority support
   - Cloud save

### Implementation with Stripe

**Install Stripe**:
```bash
yarn add @stripe/stripe-js
```

**Setup** (`src/utils/payments.js`):

```javascript
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_live_...');

export async function purchaseAdRemoval() {
  const stripe = await stripePromise;
  
  const response = await fetch('/api/create-checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      items: [{ id: 'ad_removal', quantity: 1 }]
    })
  });
  
  const session = await response.json();
  
  const result = await stripe.redirectToCheckout({
    sessionId: session.id
  });
  
  if (result.error) {
    console.error(result.error.message);
  }
}
```

### Pricing Strategy

**A/B Test Prices**:
```javascript
const pricingVariants = {
  A: { adRemoval: 1.99 },
  B: { adRemoval: 2.99 },
  C: { adRemoval: 4.99 }
};

// Track conversion rate for each
```

**Psychological Pricing**:
- $2.99 (not $3.00)
- $0.99 (impulse buy)
- $9.99 (premium tier)

---

## Premium Version

### Features

**Free Version**:
- 3 themes
- 3 difficulty levels
- Ads present
- Local leaderboard

**Premium Version** ($4.99 one-time):
- ✅ All 5 themes + exclusive themes
- ✅ No ads
- ✅ Unlimited custom grid sizes
- ✅ Cloud sync
- ✅ Global leaderboard
- ✅ Statistics export
- ✅ Priority support

### Implementation

```javascript
// src/utils/premium.js
export class PremiumManager {
  constructor() {
    this.isPremium = this.checkPremiumStatus();
  }
  
  checkPremiumStatus() {
    // Check local storage
    const premiumData = localStorage.getItem('premium');
    if (!premiumData) return false;
    
    // Verify with backend
    return this.verifyPremium(JSON.parse(premiumData));
  }
  
  async unlock(purchaseToken) {
    try {
      const response = await fetch('/api/premium/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: purchaseToken })
      });
      
      const data = await response.json();
      
      if (data.valid) {
        localStorage.setItem('premium', JSON.stringify(data));
        this.isPremium = true;
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Premium verification failed:', error);
      return false;
    }
  }
}
```

---

## Sponsorships

### Potential Sponsors

1. **Gaming Brands**: Razer, Logitech, SteelSeries
2. **Puzzle Game Companies**: King, Zynga
3. **Tech Companies**: CPU/GPU manufacturers
4. **Brain Training Apps**: Lumosity, Peak

### Sponsorship Models

**1. Branded Theme** - $500-$2,000/month
- Custom theme with sponsor's colors/logo
- Example: "Razer Viper Theme"

**2. Loading Screen** - $1,000-$5,000/month
- Sponsor logo on loading screen
- "Powered by [Sponsor]"

**3. Tournament Sponsorship** - $5,000-$20,000
- Weekly/monthly tournaments
- Prizes provided by sponsor
- Branding throughout

### Pitch Template

```
Subject: Partnership Opportunity - Neo-Minesweeper

Hi [Name],

Neo-Minesweeper is a modern puzzle game with:
- [X] monthly active users
- [Y] average session duration
- [Z] daily games played

We're looking for partners to:
1. Sponsor custom themes
2. Co-brand tournaments
3. Reach our engaged audience

Audience demographics:
- Age: 18-45
- Interest: Gaming, puzzles, strategy
- Engagement: [X] min/session

Partnership options:
- Theme sponsorship: $X/month
- Tournament title sponsor: $Y/event
- Loading screen: $Z/month

Interested in exploring this opportunity?

Best,
[Your Name]
```

---

## Affiliate Marketing

### Products to Promote

1. **Gaming Peripherals** (Amazon Associates)
   - 4-8% commission
   - Gaming mice, keyboards
   
2. **Brain Training Apps** (CPA)
   - $0.50-$5.00 per install
   - Lumosity, Peak, Elevate

3. **Game Development Courses** (ClickBank)
   - 50-75% commission
   - Unity courses, game design

### Implementation

```javascript
// Add affiliate links in appropriate places
const affiliateLinks = {
  upgradeTip: 'https://amazon.com/gaming-mouse?tag=YOUR_TAG',
  courseAd: 'https://clickbank.com/game-dev?affiliate=YOUR_ID'
};

// Track clicks and conversions
function trackAffiliateClick(link, source) {
  analytics.track('affiliate_click', {
    link,
    source,
    timestamp: new Date()
  });
}
```

---

## Revenue Tracking

### Dashboard

```javascript
// src/utils/revenueTracker.js
export class RevenueTracker {
  trackAdImpression(type, revenue) {
    const data = {
      type,      // 'banner' or 'interstitial'
      revenue,   // eCPM / 1000
      timestamp: Date.now()
    };
    
    // Send to analytics
    this.recordRevenue(data);
  }
  
  trackPurchase(item, amount) {
    const data = {
      item,      // 'ad_removal', 'theme_pack', etc.
      amount,    // $2.99
      timestamp: Date.now()
    };
    
    this.recordRevenue(data);
  }
  
  async getMonthlyRevenue() {
    // Calculate total revenue
    const adRevenue = await this.calculateAdRevenue();
    const iapRevenue = await this.calculateIAPRevenue();
    const affiliateRevenue = await this.calculateAffiliateRevenue();
    
    return {
      ads: adRevenue,
      iap: iapRevenue,
      affiliate: affiliateRevenue,
      total: adRevenue + iapRevenue + affiliateRevenue
    };
  }
}
```

### Analytics Integration

```javascript
// Track revenue events
analytics.track('revenue', {
  source: 'admob_banner',
  amount: 0.002, // $0.002 per impression
  currency: 'USD'
});

analytics.track('purchase', {
  item: 'ad_removal',
  amount: 2.99,
  currency: 'USD'
});
```

---

## Growth Strategies

### User Acquisition

1. **App Store Optimization (ASO)**
   - Keywords: minesweeper, puzzle game, brain game
   - Screenshots showcasing features
   - Video preview
   - Reviews management

2. **Social Media Marketing**
   - TikTok: Gameplay clips, tips
   - Instagram: Theme showcases
   - Twitter: Daily challenges
   - Reddit: r/AndroidGaming, r/iosgaming

3. **Content Marketing**
   - "10 Minesweeper Strategies"
   - "History of Minesweeper"
   - YouTube tutorials

4. **Paid Advertising**
   - Google App Campaigns: $0.50-$2.00 CPI
   - Facebook Ads: $0.75-$3.00 CPI
   - TikTok Ads: $1.00-$4.00 CPI

### Retention Tactics

1. **Daily Challenges**: New puzzle daily
2. **Streaks**: Reward consecutive days
3. **Achievements**: Unlock badges
4. **Social Features**: Share scores
5. **Push Notifications**: Re-engagement

### Monetization Calendar

**Month 1-3**: Build user base
- Focus on growth
- Light ads only
- Gather feedback

**Month 4-6**: Optimize monetization
- Introduce IAP
- Increase ad frequency
- A/B test pricing

**Month 7-12**: Scale revenue
- Premium version launch
- Seek sponsorships
- Add affiliate links

---

## Legal & Compliance

### Required Documents

1. **Privacy Policy** (Required by App Stores)
   - What data is collected
   - How it's used
   - Third-party services (AdMob, Analytics)
   - User rights (GDPR, CCPA)

2. **Terms of Service**
   - Usage rules
   - Refund policy
   - Liability disclaimers

3. **Cookie Policy** (GDPR)
   - What cookies are used
   - Opt-out options

### Compliance Checklist

- [ ] Privacy policy published
- [ ] Terms of service published
- [ ] GDPR consent banner (EU users)
- [ ] CCPA compliance (California users)
- [ ] COPPA compliance (no users under 13)
- [ ] AdMob policies followed
- [ ] Store policies followed

---

## Success Metrics

### KPIs to Track

1. **Revenue Metrics**
   - ARPU (Average Revenue Per User)
   - ARPPU (Average Revenue Per Paying User)
   - LTV (Lifetime Value)
   - Conversion rate (free to paid)

2. **User Metrics**
   - DAU / MAU ratio
   - Retention (D1, D7, D30)
   - Session length
   - Session frequency

3. **Monetization Metrics**
   - Ad fill rate
   - eCPM
   - IAP conversion rate
   - Revenue per session

### Targets (6-month goals)

- Monthly revenue: $1,000+
- ARPU: $0.10+
- Paying user %: 2-5%
- Ad fill rate: 90%+
- D1 retention: 40%+

---

**Questions?** Contact: monetization@your-domain.com