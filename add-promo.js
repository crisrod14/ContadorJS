const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Función para leer el archivo de configuración
function readConfig() {
    const configPath = path.join(__dirname, 'countdown-config.json');
    return JSON.parse(fs.readFileSync(configPath, 'utf8'));
}

// Función para guardar el archivo de configuración
function saveConfig(config) {
    const configPath = path.join(__dirname, 'countdown-config.json');
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
}

// Función para formatear la fecha
function formatDate(date) {
    return date.toISOString().slice(0, 19);
}

// Función para agregar una nueva promoción
async function addPromo() {
    try {
        const config = readConfig();
        
        console.log('\n=== Agregar Nueva Promoción ===\n');
        
        // Tipo de promoción
        const type = await new Promise(resolve => {
            rl.question('Tipo de promoción (promo-flash/evento-comercial): ', answer => {
                resolve(answer.toLowerCase());
            });
        });

        // Fechas
        const startDate = await new Promise(resolve => {
            rl.question('Fecha de inicio (YYYY-MM-DD HH:mm): ', answer => {
                resolve(new Date(answer));
            });
        });

        const endDate = await new Promise(resolve => {
            rl.question('Fecha de fin (YYYY-MM-DD HH:mm): ', answer => {
                resolve(new Date(answer));
            });
        });

        // Textos
        const boldText = await new Promise(resolve => {
            rl.question('Texto principal: ', resolve);
        });

        const plainText = await new Promise(resolve => {
            rl.question('Texto secundario: ', resolve);
        });

        // CTA
        const ctaText = await new Promise(resolve => {
            rl.question('Texto del botón: ', resolve);
        });

        const ctaLink = await new Promise(resolve => {
            rl.question('Link del botón: ', resolve);
        });

        // Configuración adicional
        const showCTA = await new Promise(resolve => {
            rl.question('¿Mostrar botón? (s/n): ', answer => {
                resolve(answer.toLowerCase() === 's');
            });
        });

        const smartDaysGlow = await new Promise(resolve => {
            rl.question('¿Activar efecto glow? (s/n): ', answer => {
                resolve(answer.toLowerCase() === 's');
            });
        });

        // Crear nueva promoción
        const newPromo = {
            type,
            start_date: formatDate(startDate),
            end_date: formatDate(endDate),
            boldText,
            icon: type === 'promo-flash' ? 'fa-bolt' : 'fa-lightbulb-on',
            plainText,
            ctaText,
            ctaLink,
            showCTA,
            smartDaysGlow
        };

        // Agregar campos específicos para promos flash
        if (type === 'promo-flash') {
            const routes = await new Promise(resolve => {
                rl.question('Rutas (separadas por coma): ', answer => {
                    resolve(answer.split(',').map(r => r.trim()));
                });
            });

            const promocode = await new Promise(resolve => {
                rl.question('Promocode: ', resolve);
            });

            const discount = await new Promise(resolve => {
                rl.question('Porcentaje de descuento: ', answer => {
                    resolve(parseInt(answer));
                });
            });

            Object.assign(newPromo, { routes, promocode, discount });
        }

        // Agregar la promoción al array correspondiente
        if (type === 'promo-flash') {
            config.flash_promos.push(newPromo);
        } else {
            config.commercial_events.push(newPromo);
        }

        // Guardar la configuración
        saveConfig(config);
        console.log('\n✅ Promoción agregada exitosamente');

        // Actualizar el contador
        require('./update-countdown.js');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        rl.close();
    }
}

// Ejecutar el script
addPromo(); 