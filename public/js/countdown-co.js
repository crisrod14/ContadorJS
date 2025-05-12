var CountdownBannerInterval = setInterval(function () {
    if (typeof JetSmart === "undefined" || JetSmart.TealiumData.culture !== 'es-CO' || !document.querySelector('bb-searchbox')) return;
    clearInterval(CountdownBannerInterval);

    // =================== CONFIGURACIÓN ===================
    // SVG del avión (pattern)
    const planeSVG = `<svg width="51" height="49" viewBox="0 0 51 49" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M35.8278 14.8679C37.9065 13.8986 42.4016 13.9611 43.3994 16.1009C44.4258 18.3019 41.5557 21.7243 39.477 22.6936L32.3238 26.0292L31.2276 39.6405C31.1459 40.4229 30.6444 41.1033 29.9719 41.4169L26.5482 43.0134C25.8756 43.327 25.1015 42.9437 24.9998 42.2468L23.092 30.3341L16.8559 33.242L15.8193 38.0425C15.7499 38.3725 15.5624 38.6089 15.2567 38.7514L12.6889 39.9488C12.1998 40.1769 11.6619 39.9811 11.4338 39.492C11.4053 39.4308 11.3768 39.3697 11.3483 39.3086L10.1402 31.6099L5.04776 25.797C5.01925 25.7359 4.99074 25.6747 4.93372 25.5525C4.73416 25.1245 4.90142 24.5255 5.39053 24.2974L7.95834 23.1C8.26403 22.9575 8.59411 23.0268 8.89156 23.1859L13.2067 25.4163L19.4428 22.5084L11.5719 13.4507C11.1034 12.9248 11.2789 12.0243 11.9514 11.7106L15.3752 10.1141C16.0477 9.80053 16.9198 9.9149 17.5717 10.3552L28.6747 18.2035L35.8278 14.8679Z" fill="#B5373E"/></svg>`;
    const patternDataUrl = `data:image/svg+xml;base64,${btoa(planeSVG)}`;

    // RANGOS DE FECHAS Y MENSAJES
    const COUNTDOWN_RANGES = [
        ...[
  {boldText: 'SMART Days', plainText: '¡Aprovecha antes que se acabe!', icon: '<i class="fa-solid fa-lightbulb-on"></i>', smartDaysGlow: true, start_date: '2025-05-12T10:00:00', end_date: '2025-05-19T10:00:00', showCTA: false, type: 'evento-comercial'}
],
        ...[]
    ];

    function getActiveRange() {
      const now = new Date();
      
      // Primero buscar promos flash activas
      const activeFlashPromo = COUNTDOWN_RANGES.find(r => 
        r.type === 'promo-flash' && 
        new Date(r.start_date) <= now && 
        now < new Date(r.end_date)
      );

      // Si hay una promo flash activa, retornarla
      if (activeFlashPromo) {
        return activeFlashPromo;
      }

      // Si no hay promo flash, buscar el evento comercial activo
      return COUNTDOWN_RANGES.find(r => 
        r.type === 'evento-comercial' && 
        new Date(r.start_date) <= now && 
        now < new Date(r.end_date)
      );
    }
    const activeRange = getActiveRange();
    if (!activeRange) return;

    // =================== INYECTAR CSS DEL USUARIO ===================
    var userCss = `@import url('https://fonts.googleapis.com/css2?family=Encode+Sans:wght@400;500;700;800&family=Lato:wght@400;600&display=swap');

@keyframes glow {
  0% {
    text-shadow: 0 0 2px #00AEC7, 0 0 4px #00AEC7;
  }
  50% {
    text-shadow: 0 0 8px #00AEC7, 0 0 16px #00AEC7;
  }
  100% {
    text-shadow: 0 0 2px #00AEC7, 0 0 4px #00AEC7;
  }
}

.smartdays-glow {
  animation: glow 2s cubic-bezier(0.4,0,0.2,1) alternate infinite;
}

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
  animation: banner-slide-pass 2.2s cubic-bezier(0.7,0,0.3,1) 1;
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
  font-family: 'Encode Sans', sans-serif;
  font-size: 20px;
  font-weight: 400;
  line-height: 20px;
  margin: 0;
}

.countdown-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  opacity: 0;
  pointer-events: none;
}

.countdown-box {
  display: flex;
  padding: 2px 10px;
  flex-direction: column;
  align-items: center;
  gap: -3px;
  border-radius: 6.7px;
  background-color: #00aec7;
  width: 65px;
  box-sizing: border-box;
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
  width: 100%;
  display: inline-block;
}

.countdown-label {
  color: #fff;
  text-align: center;
  font-family: 'Encode Sans', sans-serif;
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
  opacity: 0;
  pointer-events: none;
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
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    position: relative;
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
    margin-left: 6px;
    height: 28px;
    font-size: 11px;
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
}

@keyframes banner-slide-pass {
  0% {
    transform: translateX(-100%);
    opacity: 0.2;
  }
  60% {
    transform: translateX(calc(100vw - 100% - 48px));
    opacity: 1;
  }
  70% {
    transform: translateX(calc(100vw - 100% - 48px));
    opacity: 1;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes pop-in {
  0% {
    transform: scale(0.3);
    opacity: 0;
  }
  60% {
    transform: scale(1.15);
    opacity: 1;
  }
  80% {
    transform: scale(0.95);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
.banner-content-pop {
  animation: pop-in 0.7s cubic-bezier(0.2, 1.5, 0.5, 1) 1;
  opacity: 1 !important;
  pointer-events: auto;
}

@keyframes fade-in {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
.banner-button-fade {
  animation: fade-in 1s ease 1;
  opacity: 1 !important;
  pointer-events: auto;
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
        <span class="banner-title${activeRange.smartDaysBorderGlow ? ' smartdays-border-glow' : ''}${activeRange.smartDaysGlow ? ' smartdays-glow' : ''}">${activeRange.boldText}</span>
        <span class="banner-crown${activeRange.smartDaysBorderGlow ? ' smartdays-border-glow' : ''}${activeRange.smartDaysGlow ? ' smartdays-glow' : ''}">${activeRange.icon}</span>
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
        ${activeRange.showCTA ? `<a class="offers-button" href="${activeRange.ctaLink}" target="_blank" rel="noopener">
          <span class="button-text">${activeRange.ctaText}</span>
        </a>` : ''}
      </div>
    `;

    // Insertar antes de #carousel o al inicio del body
    var ref = document.getElementById('rt-carousel');
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

    // =================== ANIMACIÓN GLOW INTERMITENTE ===================
    // Solo si smartDaysGlow está en true
    if (activeRange.smartDaysGlow) {
      const header = banner.querySelector('.banner-title');
      const crown = banner.querySelector('.banner-crown');
      function toggleGlow(on) {
        if (on) {
          header.classList.add('smartdays-glow');
          crown.classList.add('smartdays-glow');
        } else {
          header.classList.remove('smartdays-glow');
          crown.classList.remove('smartdays-glow');
        }
      }
      // Ciclo: cada 8s, activa 4s, luego desactiva 4s
      toggleGlow(false);
      setInterval(() => {
        toggleGlow(true);
        setTimeout(() => toggleGlow(false), 4000);
      }, 8000);
    }

    // Después de insertar el banner en el DOM, agrega este código JS para animaciones secuenciales
    setTimeout(() => {
      const countdown = banner.querySelector('.countdown-container');
      const offersButton = banner.querySelector('.offers-button');
      if (countdown) {
        countdown.classList.add('banner-content-pop');
      }
      if (offersButton) {
        setTimeout(() => {
          offersButton.classList.add('banner-button-fade');
        }, 2000);
      }
    }, 2200);

}, 800); 