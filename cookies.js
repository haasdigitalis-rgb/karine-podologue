/**
 * cookies.js — Google Consent Mode v2
 * Cabinet de Podologie Agde
 * Refus par défaut. Consentement explicite requis.
 */

// ============================================================
// INITIALISATION — déjà effectuée dans le <head> via gtag()
// Ce fichier gère uniquement les fonctions de consentement.
// ============================================================

/**
 * acceptCookies()
 * Appelée au clic sur "Accepter"
 * Active analytics_storage + ad_storage
 */
function acceptCookies() {
  gtag('consent', 'update', {
    'ad_storage':         'granted',
    'analytics_storage':  'granted',
    'ad_user_data':       'granted',
    'ad_personalization': 'granted'
  });

  // Mémoriser le choix 13 mois
  var expires = new Date();
  expires.setTime(expires.getTime() + 13 * 30 * 24 * 60 * 60 * 1000);
  document.cookie = 'cookie_consent=accepted; expires=' + expires.toUTCString() + '; path=/; SameSite=Lax';

  // Pour compatibilité localStorage (bandeau init)
  try { localStorage.setItem('cookie_consent', 'accepted'); } catch(e) {}

  // Masquer le bandeau
  var banner = document.getElementById('cookie-banner');
  if (banner) banner.classList.remove('show');
}

/**
 * refuseCookies()
 * Appelée au clic sur "Refuser"
 * Maintient le refus par défaut
 */
function refuseCookies() {
  gtag('consent', 'update', {
    'ad_storage':         'denied',
    'analytics_storage':  'denied',
    'ad_user_data':       'denied',
    'ad_personalization': 'denied'
  });

  // Mémoriser le refus 13 mois
  var expires = new Date();
  expires.setTime(expires.getTime() + 13 * 30 * 24 * 60 * 60 * 1000);
  document.cookie = 'cookie_consent=refused; expires=' + expires.toUTCString() + '; path=/; SameSite=Lax';

  try { localStorage.setItem('cookie_consent', 'refused'); } catch(e) {}

  // Masquer le bandeau
  var banner = document.getElementById('cookie-banner');
  if (banner) banner.classList.remove('show');
}

/**
 * Lecture du cookie stocké au chargement de page
 * Restaure le consentement sans redemander à l'utilisateur
 */
(function restoreConsent() {
  // Lire depuis cookie navigateur
  var cookies = document.cookie.split(';');
  var consentValue = null;
  for (var i = 0; i < cookies.length; i++) {
    var c = cookies[i].trim();
    if (c.indexOf('cookie_consent=') === 0) {
      consentValue = c.substring('cookie_consent='.length);
      break;
    }
  }

  // Fallback localStorage
  if (!consentValue) {
    try { consentValue = localStorage.getItem('cookie_consent'); } catch(e) {}
  }

  if (consentValue === 'accepted') {
    gtag('consent', 'update', {
      'ad_storage':         'granted',
      'analytics_storage':  'granted',
      'ad_user_data':       'granted',
      'ad_personalization': 'granted'
    });
  }
  // Si refusé ou absent → le refus par défaut défini dans le <head> reste actif
})();
