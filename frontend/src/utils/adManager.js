// Simple ad manager for monetization
// In production, integrate with Google AdMob or similar

class AdManager {
  constructor() {
    this.adsEnabled = true;
    this.interstitialCount = 0;
    this.interstitialFrequency = 3; // Show after every 3 games
  }

  setAdsEnabled(enabled) {
    this.adsEnabled = enabled;
  }

  shouldShowInterstitial() {
    if (!this.adsEnabled) return false;
    
    this.interstitialCount++;
    
    if (this.interstitialCount >= this.interstitialFrequency) {
      this.interstitialCount = 0;
      return true;
    }
    
    return false;
  }

  showInterstitial() {
    if (!this.adsEnabled) return Promise.resolve();
    
    // In production, this would trigger actual ad SDK
    console.log('Showing interstitial ad');
    
    // Simulate ad display
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Interstitial ad closed');
        resolve();
      }, 2000);
    });
  }

  initializeBannerAd(containerId) {
    if (!this.adsEnabled) return;
    
    // In production, initialize banner ad SDK here
    console.log('Initializing banner ad in:', containerId);
    
    // For demo, create a placeholder
    const container = document.getElementById(containerId);
    if (container && !container.hasChildNodes()) {
      const placeholder = document.createElement('div');
      placeholder.style.cssText = `
        width: 100%;
        height: 50px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 12px;
        font-weight: bold;
        border-radius: 8px;
        margin: 8px 0;
      `;
      placeholder.textContent = '🎯 Ad Space - Revenue Support';
      container.appendChild(placeholder);
    }
  }

  removeBannerAd(containerId) {
    const container = document.getElementById(containerId);
    if (container) {
      container.innerHTML = '';
    }
  }
}

export default new AdManager();