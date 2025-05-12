var CountdownBannerInterval = setInterval(function () {
    // Cambia estas condiciones según tu entorno real:
    if (typeof JetSmart === "undefined" || JetSmart.TealiumData.culture !== 'es-CL' || !document.querySelector('bb-searchbox')) return;
    clearInterval(CountdownBannerInterval);

    // =================== CONFIGURACIÓN ===================
    // SVG del avión (pattern)
    const planeSVG = `<svg width="51" height="49" viewBox="0 0 51 49" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M35.8278 14.8679C37.9065 13.8986 42.4016 13.9611 43.3994 16.1009C44.4258 18.3019 41.5557 21.7243 39.477 22.6936L32.3238 26.0292L31.2276 39.6405C31.1459 40.4229 30.6444 41.1033 29.9719 41.4169L26.5482 43.0134C25.8756 43.327 25.1015 42.9437 24.9998 42.2468L23.092 30.3341L16.8559 33.242L15.8193 38.0425C15.7499 38.3725 15.5624 38.6089 15.2567 38.7514L12.6889 39.9488C12.1998 40.1769 11.6619 39.9811 11.4338 39.492C11.4053 39.4308 11.3768 39.3697 11.3483 39.3086L10.1402 31.6099L5.04776 25.797C5.01925 25.7359 4.99074 25.6747 4.93372 25.5525C4.73416 25.1245 4.90142 24.5255 5.39053 24.2974L7.95834 23.1C8.26403 22.9575 8.59411 23.0268 8.89156 23.1859L13.2067 25.4163L19.4428 22.5084L11.5719 13.4507C11.1034 12.9248 11.2789 12.0243 11.9514 11.7106L15.3752 10.1141C16.0477 9.80053 16.9198 9.9149 17.5717 10.3552L28.6747 18.2035L35.8278 14.8679Z" fill="#B5373E"/></svg>`;
    const patternDataUrl = `data:image/svg+xml;base64,${btoa(planeSVG)}`;

    // RANGOS DE FECHAS Y MENSAJES (EDITABLE)
    const COUNTDOWN_RANGES = [
      {
        start_date: '2025-04-09T17:00:00',
        end_date:   '2025-06-10T10:00:00',
        boldText: 'SMART Days',
        icon: '<i class="fa-solid fa-lightbulb-on"></i>',
        plainText: '¡Aprovecha antes que se acabe!',
        ctaText: 'Ver ofertas',
        ctaLink: '#ofertas'
      },
      // Puedes agregar más rangos aquí
    ];

    // COLORES Y FUENTES
    const COLOR_BG = '#AF272F';
    const COLOR_CELESTE = '#00AEC7';
    const COLOR_WHITE = '#FFFFFF';
    const FONT_MAIN = 'Encode Sans', FONT_SECONDARY = 'Lato';

    // =================== LÓGICA DE RANGO ACTIVO ===================
    function getActiveRange() {
      const now = new Date();
      return COUNTDOWN_RANGES.find(r => new Date(r.start_date) <= now && now < new Date(r.end_date));
    }
    const activeRange = getActiveRange();
    if (!activeRange) return;

    // =================== INYECTAR CSS DEL USUARIO ===================
    var userCss = `@import url('https://fonts.googleapis.com/css2?family=Encode+Sans:wght@400;500;700;800&family=Lato:wght@400;600&display=swap');

.smart-banner {
  display: flex;
  height: 83px;
  padding: 20px 128px;
  justify-content: center;
  align-items: center;
  background-color: #af272f;
  gap: 81px;
}

.banner-header {
  display: flex;
  align-items: center;
  gap: 16px;
}

.banner-title {
  color: #fff;
  font-family: 'Encode Sans', sans-serif;
  font-size: 24px;
  font-weight: 700;
  letter-spacing: -0.48px;
  margin: 0;
}

.banner-crown {
  color: #fff;
  font-family: 'Encode Sans', sans-serif;
  font-size: 24px;
  font-weight: 700;
  letter-spacing: -0.48px;
}

.banner-subtitle {
  color: #fff;
  font-family: 'Lato', sans-serif;
  font-size: 22px;
  font-weight: 400;
  line-height: 20px;
  margin: 0;
}

.countdown-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

.countdown-box {
  display: flex;
  padding: 2px 10px;
  flex-direction: column;
  align-items: center;
  gap: -3px;
  border-radius: 6.7px;
  background-color: #00aec7;
}

.countdown-box:first-child {
  margin-right: 6px;
}

.countdown-number {
  color: #fff;
  text-align: center;
  font-family: 'Encode Sans', sans-serif;
  font-size: 36px;
  font-weight: 800;
  letter-spacing: -0.72px;
}

.countdown-label {
  color: #fff;
  text-align: center;
  font-family: 'Lato', sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: 15px;
}

.countdown-separator {
  color: #fff;
  font-family: 'Encode Sans', sans-serif;
  font-size: 23px;
  font-weight: 500;
}

.offers-button {
  display: flex;
  height: 34px;
  padding: 9px 16px;
  justify-content: center;
  align-items: center;
  gap: 6px;
  border-radius: 30px;
  background-color: rgba(255, 255, 255, 0.3);
  margin-left: 48px;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.offers-button:hover {
  background-color: rgba(255, 255, 255, 0.4);
}

.button-text {
  color: #fff;
  font-family: 'Lato', sans-serif;
  font-size: 18px;
  font-weight: 600;
}

.button-arrow {
  color: #fff;
  font-family: 'Lato', sans-serif;
  font-size: 18px;
  font-weight: 600;
}

@media (max-width: 991px) {
  .smart-banner {
    padding: 20px 64px;
  }
}

@media (max-width: 640px) {
  .smart-banner {
    padding: 8px 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    height: auto;
    flex-grow: 0;
    gap: 7px;
    justify-content: center;
    width: 100vw;
    margin-left: calc(50% - 50vw);
  }

  .banner-header {
    gap: 10px;
    flex-grow: 0;
    width: auto;
    align-self: stretch;
    justify-content: center;
    display: flex;
    flex-direction: row;
  }

  .banner-title {
    font-size: 18px;
    text-align: center;
  }

  .banner-crown {
    font-size: 19px;
    text-align: center;
    letter-spacing: -0.5px;
  }

  .banner-subtitle {
    font-size: 12px;
    font-family: 'Encode Sans', sans-serif;
    text-align: center;
  }

  .countdown-container {
    gap: 6px;
    width: auto;
    align-self: center;
  }

  .countdown-number {
    font-size: 28px;
  }

  .countdown-label {
    font-size: 10px;
  }

  .countdown-separator {
    font-size: 20px;
  }

  .offers-button {
    flex-grow: 0;
    width: auto;
    align-self: center;
    justify-content: center;
    padding-top: 2px;
    padding-bottom: 2px;
    display: flex;
    flex-direction: row;
    gap: 6px;
    margin-left: 3px;
  }

  .button-text {
    font-size: 11px;
    margin-bottom: auto;
    margin-top: auto;
    flex-grow: 0;
    height: auto;
    align-self: stretch;
    width: 55.3px;
  }

  .button-arrow {
    font-size: 11px;
  }
}`;

    // Inyectar CSS del usuario
    var style = document.createElement('style');
    style.textContent = userCss;
    document.head.appendChild(style);

    // Inyectar FontAwesome (para el icono)
    var faLink = document.createElement('link');
    faLink.rel = 'stylesheet';
    faLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css';
    document.head.appendChild(faLink);

    // =================== CREAR HTML DEL BANNER ===================
    var banner = document.createElement('div');
    banner.className = 'smart-banner';
    banner.style.backgroundImage = `url('${patternDataUrl}')`;
    banner.style.backgroundRepeat = 'repeat';
    banner.style.backgroundColor = '#af272f';
    banner.style.backgroundSize = '32px 30px';
    banner.style.backgroundPosition = 'center';
    banner.style.position = 'relative';
    banner.style.overflow = 'hidden';

    banner.innerHTML = `
      <div class="banner-header">
        <span class="banner-title">${activeRange.boldText}</span>
        <span class="banner-crown">${activeRange.icon}</span>
        <span class="banner-subtitle">${activeRange.plainText}</span>
      </div>
      <div class="countdown-container">
        <div class="countdown-box"><span class="countdown-number" id="sdays">00</span><span class="countdown-label">Días</span></div>
        <span class="countdown-separator">:</span>
        <div class="countdown-box"><span class="countdown-number" id="shours">00</span><span class="countdown-label">Hr</span></div>
        <span class="countdown-separator">:</span>
        <div class="countdown-box"><span class="countdown-number" id="smins">00</span><span class="countdown-label">Min</span></div>
        <span class="countdown-separator">:</span>
        <div class="countdown-box"><span class="countdown-number" id="ssecs">00</span><span class="countdown-label">Seg</span></div>
      </div>
      <a class="offers-button" href="${activeRange.ctaLink}" target="_blank" rel="noopener">
        <span class="button-text">${activeRange.ctaText}</span>
        <span class="button-arrow"><i class="fa-solid fa-arrow-right"></i></span>
      </a>
    `;

    // Insertar antes de .site-content o al inicio del body
    var ref = document.querySelector('.site-content');
    if (ref) {
      ref.parentNode.insertBefore(banner, ref);
    } else {
      document.body.insertBefore(banner, document.body.firstChild);
    }

    // =================== COUNTDOWN ===================
    function updateCountdown() {
      var now = new Date();
      var end = new Date(activeRange.end_date);
      var diff = end - now;
      if (diff < 0) diff = 0;
      var days = Math.floor(diff / (1000 * 60 * 60 * 24));
      var hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      var mins = Math.floor((diff / (1000 * 60)) % 60);
      var secs = Math.floor((diff / 1000) % 60);
      document.getElementById('sdays').textContent = days.toString().padStart(2, '0');
      document.getElementById('shours').textContent = hours.toString().padStart(2, '0');
      document.getElementById('smins').textContent = mins.toString().padStart(2, '0');
      document.getElementById('ssecs').textContent = secs.toString().padStart(2, '0');
    }
    updateCountdown();
    setInterval(updateCountdown, 1000);

    // =================== ANIMACIÓN DEL MENSAJE ===================
    var msg = banner.querySelector('.banner-header');
    function animateMsg() {
      msg.style.transition = 'transform 0.25s cubic-bezier(.7,-0.01,.7,1.2), color 0.25s';
      msg.style.transform = 'scale(1.13)';
      msg.style.color = '#00AEC7';
      setTimeout(function() {
        msg.style.transform = '';
        msg.style.color = '';
      }, 500);
    }
    setTimeout(animateMsg, 900); // Primera animación tras slide-in
    setInterval(animateMsg, 5000);

}, 800);
