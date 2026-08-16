import React, { useState, useEffect } from 'react';
import { Download, Smartphone, X, Check } from 'lucide-react';

export function PWAInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isDismissed, setIsDismissed] = useState(() => {
    return localStorage.getItem('ymc_pwa_dismissed') === 'true';
  });

  useEffect(() => {
    // Detect if already running in standalone PWA mode
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
      setIsInstalled(true);
    }

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      // For iOS or browsers without direct prompt
      alert('To install this app on your phone:\n\n1. Tap the Share button in your browser (Safari/Chrome).\n2. Scroll and select "Add to Home Screen".');
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem('ymc_pwa_dismissed', 'true');
  };

  if (isInstalled || isDismissed) return null;

  return (
    <div className="pwa-banner">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: '12px',
            background: 'rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fbbf24',
            flexShrink: 0
          }}
        >
          <Smartphone size={24} />
        </div>
        <div className="pwa-banner-content">
          <h4>Install YMC Fellowship App</h4>
          <p>Access your workbooks & tasks anytime, even offline during meetings.</p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <button
          className="btn btn-gold btn-sm"
          onClick={handleInstallClick}
        >
          <Download size={14} /> Install PWA
        </button>
        <button
          className="btn-icon btn-sm"
          style={{ background: 'transparent', border: 'none', color: '#94a3b8' }}
          onClick={handleDismiss}
          aria-label="Dismiss"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
