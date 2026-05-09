export function useCookies() {
  const getConsent = () => {
    try {
      const consent = localStorage.getItem("cookieConsent");
      return consent ? JSON.parse(consent) : null;
    } catch {
      return null;
    }
  };

  const hasConsent = (type) => {
    const consent = getConsent();
    return consent ? consent[type] || false : false;
  };

  const getAllConsent = () => {
    return getConsent() || {
      necessary: false,
      analytics: false,
      marketing: false,
      functional: false,
    };
  };

  const revokeConsent = () => {
    localStorage.removeItem("cookieConsent");
    localStorage.removeItem("cookieConsentDate");
    window.location.reload();
  };

  return {
    getConsent,
    hasConsent,
    getAllConsent,
    revokeConsent,
  };
}