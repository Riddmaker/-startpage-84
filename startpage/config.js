/*
 * config.js — Behaviour & Content
 * ═══════════════════════════════════════════════════════════════════════════
 * Edit this file to change tiles, search engine, and feature toggles.
 * No knowledge of HTML/CSS required.
 * ═══════════════════════════════════════════════════════════════════════════
 */

const CONFIG = {

  // ── Page ────────────────────────────────────────────────────────────────
  title: '84',

  // Path to the logo image (relative to index.html).
  // Replace logo.png with any image — PNG with transparency recommended.
  logoSrc: './logo.png',

  // ── Search bar ──────────────────────────────────────────────────────────
  // The search query is appended directly to this URL.
  searchUrl: 'https://www.google.com/search?q=',
  // searchUrl: 'http://localhost:8080/search?q=',   // ← SearXNG instance

  // ── Localisation ─────────────────────────────────────────────────────────
  // BCP-47 language tag used for UI text and date/time formatting.
  // Examples: 'en', 'de', 'fr', 'es', 'ja', 'zh', 'nl', 'pt', 'it', 'pl'
  // Controls: search-bar placeholder, clock day/month names, AM/PM marker and weather module.
  language: 'en',

  // ── Weather ──────────────────────────────────────────────────────────────
  showWeather: true,

  // Paste your OpenWeatherMap API key here (free tier is enough).
  // Get one at: https://openweathermap.org/api → "Current Weather Data"
  weatherApiKey: 'YOUR_API_KEY',

  // 'metric' → °C  |  'imperial' → °F
  weatherUnits: 'metric',

  // Fallback city name used when the browser denies geolocation.
  // Leave empty to show nothing if geolocation is unavailable.
  weatherCity: '',

  // Nerd Font characters for each condition group.
  // Browse / swap at https://www.nerdfonts.com/cheat-sheet
  weatherIcons: {
    thunderstorm:      '\u{F0193}',  // nf-md-weather_lightning
    drizzle:           '\u{F0196}',  // nf-md-weather_rainy
    rain:              '\u{F0197}',  // nf-md-weather_pouring
    snow:              '\u{F0198}',  // nf-md-weather_snowy
    atmosphere:        '\u{F0191}',  // nf-md-weather_fog
    clearDay:          '\u{F0199}',  // nf-md-weather_sunny
    clearNight:        '\u{F0594}',  // nf-md-weather_night
    partlyCloudyDay:   '\u{F0595}',  // nf-md-weather_partly_cloudy
    partlyCloudyNight: '\u{F0594}',  // nf-md-weather_night (reuse moon)
    cloudy:            '\u{F0190}',  // nf-md-weather_cloudy
  },

  // Icon colours — reference any CSS variable from config.css.
  // Temperature thresholds are always in °C regardless of weatherUnits.
  weatherColors: {
    thunderstorm:  'var(--maroon)',   // dark red — dramatic
    drizzle:       'var(--sky)',      // light blue
    rain:          'var(--blue)',     // blue
    snow:          'var(--text)',     // near-white
    atmosphere:    'var(--overlay1)', // muted — fog / haze / mist
    clearNight:    'var(--lavender)', // soft purple
    cloudy:        'var(--overlay1)', // muted grey
    clearDay:      'var(--yellow)',   // mild / normal
    clearDayWarm:  'var(--peach)',    // warm  (above weatherTempWarm)
    clearDayHot:   'var(--red)',      // hot   (above weatherTempHot)
  },
  weatherTempWarm: 22,  // °C — clearDay → clearDayWarm
  weatherTempHot:  30,  // °C — clearDayWarm → clearDayHot

  // ── Features ────────────────────────────────────────────────────────────

  // Show a live clock + date above the logo.
  showClock: true,

  // 24-hour clock (true) or 12-hour AM/PM (false).
  // When false, the AM/PM marker is rendered in the chosen language.
  clockFormat24h: true,

  // Pressing any printable key (letters, numbers…) while the search bar
  // is not focused will jump back to it automatically.
  focusOnKeypress: true,

  // ── Quick-link tiles ─────────────────────────────────────────────────────────
  // A data-driven configuration array used to generate the dashboard links.
  // Each object represents a single clickable tile.
  // You can add, remove, or rearrange tiles by editing this array. 
  // If you want to add a tile, simply copy-paste one of the existing objects and modify its properties.
  //
  // Tile Properties:
  // • name   (string) : The display name for the tile (e.g., 'Gemini', 'YouTube').
  // • url    (string) : The destination link. Can be an absolute URL (https://...) 
  //                     or a local path (/apps/...).
  // • accent (string) : The hover/active color for the tile. 
  //                     Best practice: use var(--name) to reference your config.css 
  //                     variables for easy theming, or fall back to hex/rgb.
  // • svg    (string) : The raw inner HTML of the icon. 
  //                     IMPORTANT: The rendering engine wraps this string in an 
  //                     <svg viewBox="0 0 24 24"> tag. Do NOT include the outer 
  //                     <svg> tags here, only the inner <path>, <circle>, etc.
  //                     STYLING: Use fill="currentColor" or stroke="currentColor" 
  //                     so the icon automatically adapts to light/dark mode text colors.
  //                     RESOURCES: Grab paths from https://lucide.dev, 
  //                     https://simpleicons.org, or custom 24x24 grid designs.
  // ─────────────────────────────────────────────────────────────────────────────
  tiles: [

    {
      name:   'Gemini',
      url:    'https://gemini.google.com',
      accent: 'var(--blue)',
      svg:    `<path d="M12 2 L13.8 10.2 L22 12 L13.8 13.8 L12 22 L10.2 13.8 L2 12 L10.2 10.2 Z"
                     fill="currentColor"/>`,
    },

    {
      name:   'Mistral',
      url:    'https://chat.mistral.ai',
      accent: 'var(--peach)',
      // Pixel-art M: 7-col × 5-row grid, block=3px, step=3.5px, viewBox 0 0 24 24.
      svg:    `<path d="M3.5 3.5h3v3h-3z M17.5 3.5h3v3h-3z M3.5 7h6.5v3h-6.5z M14 7h6.5v3h-6.5z M3.5 10.5h17v3h-17z M3.5 14h3v3h-3z M10.5 14h3v3h-3z M17.5 14h3v3h-3z M0 17.5h10v3H0z M14 17.5h10v3H14z" 
                    fill="currentColor"/>`,
    },

    {
      name:   'Google',
      url:    'https://google.com',
      accent: 'var(--mauve)',
      svg:    `<path d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44
                        C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27
                        c3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2
                        C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10
                        c5.35 0 9.25-3.67 9.25-9.09 0-1.15-.15-1.81-.15-1.81z"
                     fill="currentColor"/>`,
    },

    {
      name:   'YouTube',
      url:    'https://youtube.com',
      accent: 'var(--red)',
      svg:    `<path d="M23 7s-.3-2-1.2-2.8c-1.1-1.2-2.4-1.2-3-1.3C16.3 2.8 12 2.8 12 2.8
                        s-4.3 0-6.8.1c-.6.1-1.9.1-3 1.3C1.3 5 1 7 1 7S.7 9.2.7 11.4v2
                        c0 2.2.3 4.4.3 4.4s.3 2 1.2 2.8c1.1 1.2 2.6 1.1 3.3 1.2
                        C7.2 22 12 22 12 22s4.3 0 6.8-.2c.6-.1 1.9-.1 3-1.3
                        .9-.8 1.2-2.8 1.2-2.8s.3-2.2.3-4.4v-2C23.3 9.2 23 7 23 7z
                        M9.7 15.5V8.4l8.1 3.6-8.1 3.5z"
                     fill="currentColor"/>`,
    },

  ],

};
