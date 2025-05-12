const fs = require('fs');
const path = require('path');

// Función para leer y procesar el archivo de configuración
function processConfig() {
    try {
        const configPath = path.join(__dirname, 'countdown-config.json');
        const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        
        // Combinar eventos comerciales y promos flash
        const allEvents = [...config.commercial_events, ...config.flash_promos];
        
        // Generar el código JavaScript para el contador
        const jsCode = generateCountdownCode(allEvents);
        
        // Actualizar el archivo del contador
        updateCountdownFile(jsCode);
        
        console.log('✅ Contador actualizado exitosamente');
    } catch (error) {
        console.error('❌ Error al procesar la configuración:', error.message);
    }
}

// Función para generar el código JavaScript del contador
function generateCountdownCode(events) {
    const eventsString = JSON.stringify(events, null, 2)
        .replace(/"icon": "([^"]+)"/g, '"icon": "<i class=\\"fa-solid $1\\"></i>"');
    
    return `var CountdownBannerInterval = setInterval(function () {
    if (typeof JetSmart === "undefined" || JetSmart.TealiumData.culture !== 'es-AR' || !document.querySelector('bb-searchbox')) return;
    clearInterval(CountdownBannerInterval);

    // =================== CONFIGURACIÓN ===================
    // SVG del avión (pattern)
    const planeSVG = \`<svg width="51" height="49" viewBox="0 0 51 49" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M35.8278 14.8679C37.9065 13.8986 42.4016 13.9611 43.3994 16.1009C44.4258 18.3019 41.5557 21.7243 39.477 22.6936L32.3238 26.0292L31.2276 39.6405C31.1459 40.4229 30.6444 41.1033 29.9719 41.4169L26.5482 43.0134C25.8756 43.327 25.1015 42.9437 24.9998 42.2468L23.092 30.3341L16.8559 33.242L15.8193 38.0425C15.7499 38.3725 15.5624 38.6089 15.2567 38.7514L12.6889 39.9488C12.1998 40.1769 11.6619 39.9811 11.4338 39.492C11.4053 39.4308 11.3768 39.3697 11.3483 39.3086L10.1402 31.6099L5.04776 25.797C5.01925 25.7359 4.99074 25.6747 4.93372 25.5525C4.73416 25.1245 4.90142 24.5255 5.39053 24.2974L7.95834 23.1C8.26403 22.9575 8.59411 23.0268 8.89156 23.1859L13.2067 25.4163L19.4428 22.5084L11.5719 13.4507C11.1034 12.9248 11.2789 12.0243 11.9514 11.7106L15.3752 10.1141C16.0477 9.80053 16.9198 9.9149 17.5717 10.3552L28.6747 18.2035L35.8278 14.8679Z" fill="#B5373E"/></svg>\`;
    const patternDataUrl = \`data:image/svg+xml;base64,\${btoa(planeSVG)}\`;

    // RANGOS DE FECHAS Y MENSAJES
    const COUNTDOWN_RANGES = ${eventsString};

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

    // ... resto del código del contador ...
    // [Aquí va el resto del código del contador que ya tienes]
});`;
}

// Función para actualizar el archivo del contador
function updateCountdownFile(jsCode) {
    const countdownPath = path.join(__dirname, 'Contador New Desktop.js');
    fs.writeFileSync(countdownPath, jsCode);
}

// Ejecutar el proceso
processConfig(); 