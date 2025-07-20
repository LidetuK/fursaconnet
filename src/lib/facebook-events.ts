
// Type declaration for Facebook Pixel
interface FacebookPixel {
  (event: string, eventName: string, params?: any): void;
  (event: string, params?: any): void;
}

// Extend the Window interface
declare global {
  interface Window {
    fbq?: FacebookPixel;
  }
}

export const FB_APP_ID = '1239452531081993';

// Standard events
export const trackPageView = () => {
  if (window.fbq) {
    window.fbq('track', 'PageView');
  }
};

export const trackPurchase = (value: number, currency: string = 'USD') => {
  if (window.fbq) {
    window.fbq('track', 'Purchase', {
      value: value,
      currency: currency
    });
  }
};

export const trackLead = () => {
  if (window.fbq) {
    window.fbq('track', 'Lead');
  }
};

export const trackCompleteRegistration = () => {
  if (window.fbq) {
    window.fbq('track', 'CompleteRegistration');
  }
};

export const trackInitiateCheckout = () => {
  if (window.fbq) {
    window.fbq('track', 'InitiateCheckout');
  }
};

// Custom events
export const trackCustomEvent = (eventName: string, params?: any) => {
  if (window.fbq) {
    window.fbq('trackCustom', eventName, params);
  }
}; 
