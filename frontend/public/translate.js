
function googleTranslateElementInit() {
  new google.translate.TranslateElement({
    pageLanguage: 'en',
    includedLanguages: 'en,hi,bn,ta,te,ml,gu,mr,kn,pa,ur,or,as',
    autoDisplay: false
  }, 'google_translate_element');

  // start waiting for the injected google select
  waitForGoogleSelect();
}

function waitForGoogleSelect() {
  const maxMs = 12000;      // maximum wait time
  const intervalMs = 250;   // polling interval
  let elapsed = 0;

  const poll = setInterval(() => {
    // the hidden google select may have class goog-te-combo OR be inside #google_translate_element
    const googleSelect = document.querySelector('.goog-te-combo') || document.querySelector('#google_translate_element select');

    if (googleSelect) {
      clearInterval(poll);
      setupCustomControl(googleSelect);
      return;
    }

    elapsed += intervalMs;
    if (elapsed >= maxMs) {
      clearInterval(poll);
      // fallback UI: enable but show tooltip that translation isn't available
      const custom = document.getElementById('customTranslate');
      if (custom) {
        custom.style.display = 'inline-block';
        custom.disabled = true;
        custom.title = 'Translation unavailable — check adblock/CSP or network';
      }
      console.warn('Google Translate select not found (timeout). Check adblock/CSP or network.');
    }
  }, intervalMs);
}

function setupCustomControl(googleSelect) {
  const custom = document.getElementById('customTranslate');
  if (!custom) return;

  // show and enable custom control
  custom.style.display = 'inline-block';
  custom.disabled = false;
  custom.title = '';

  // attach change listener
  custom.addEventListener('change', function () {
    const lang = this.value;
    if (!lang) return;

    try {
      // primary approach: set value on google's select and dispatch change
      googleSelect.value = lang;
      // modern browsers:
      googleSelect.dispatchEvent(new Event('change'));
      // older fallback (some environments):
      googleSelect.dispatchEvent(new CustomEvent('change'));
    } catch (err) {
      console.error('Error triggering google select change:', err);
      // as a last resort, try clicking the menu frame links (may be blocked by cross-origin)
      tryClickInIframe(lang);
    }
  });

  console.info('Custom translate control is ready.');
}

// last-resort attempt: click language links inside the google iframe menu
function tryClickInIframe(langCode) {
  // map codes to English names (used in iframe labels) — adjust names if needed
  const codeToName = {
    en: 'English', hi: 'Hindi', bn: 'Bengali', ta: 'Tamil', te: 'Telugu',
    ml: 'Malayalam', gu: 'Gujarati', mr: 'Marathi', kn: 'Kannada', pa: 'Punjabi',
    ur: 'Urdu', or: 'Odia', as: 'Assamese'
  };
  const name = codeToName[langCode];
  if (!name) return;

  const iframe = document.querySelector('iframe.goog-te-menu-frame');
  if (!iframe) {
    console.warn('Google translate iframe not found for fallback click.');
    return;
  }

  try {
    const doc = iframe.contentDocument || iframe.contentWindow.document;
    const anchors = doc.querySelectorAll('a');
    for (let a of anchors) {
      if ((a.innerText || '').trim().toLowerCase().includes(name.toLowerCase())) {
        a.click();
        return;
      }
    }
    console.warn('Language link not found inside iframe for', name);
  } catch (e) {
    console.warn('Cannot access google translate iframe due to cross-origin restrictions.', e);
  }
}

