const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const path = require('path');
const moment = require('moment-timezone');

const app = express();

// Configuración de la aplicación
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'jetsmart-countdown-cms',
    resave: false,
    saveUninitialized: true
}));

// Configuración de países
const COUNTRIES = {
    ar: {
        name: 'Argentina',
        culture: 'es-AR',
        language: 'Español',
        timezone: 'America/Argentina/Buenos_Aires'
    },
    cl: {
        name: 'Chile',
        culture: 'es-CL',
        language: 'Español',
        timezone: 'America/Santiago'
    },
    pe: {
        name: 'Perú',
        culture: 'es-PE',
        language: 'Español',
        timezone: 'America/Lima'
    },
    co: {
        name: 'Colombia',
        culture: 'es-CO',
        language: 'Español',
        timezone: 'America/Bogota'
    },
    uy: {
        name: 'Uruguay',
        culture: 'es-UY',
        language: 'Español',
        timezone: 'America/Montevideo'
    },
    py: {
        name: 'Paraguay',
        culture: 'es-PY',
        language: 'Español',
        timezone: 'America/Asuncion'
    },
    ec: {
        name: 'Ecuador',
        culture: 'es-EC',
        language: 'Español',
        timezone: 'America/Guayaquil'
    },
    us: {
        name: 'United States',
        culture: 'en-US',
        language: 'English',
        timezone: 'America/New_York'
    },
    br: {
        name: 'Brasil',
        culture: 'pt-BR',
        language: 'Português',
        timezone: 'America/Sao_Paulo'
    }
};

// Funciones de utilidad
async function readConfig(country) {
    try {
        const configPath = path.join(__dirname, 'config', `${country}.json`);
        const data = await fs.readFile(configPath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return {
            commercial_events: [],
            flash_promos: []
        };
    }
}

async function processEventData(event, isCommercial) {
    // Asegurar el formato correcto de la fecha
    const formatDate = (dateStr) => {
        if (!dateStr) return null;
        try {
            return moment(dateStr).format('YYYY-MM-DDTHH:mm:ss');
        } catch (error) {
            console.error('Error al formatear fecha:', error);
            return null;
        }
    };

    // Validar y limpiar el evento
    const cleanEvent = {
        ...event,
        type: isCommercial ? 'evento-comercial' : 'promo-flash',
        start_date: formatDate(event.start_date),
        end_date: formatDate(event.end_date),
        smartDaysGlow: Boolean(event.smartDaysGlow === true || event.smartDaysGlow === 'true' || event.smartDaysGlow === 'on'),
        showCTA: Boolean(event.showCTA === true || event.showCTA === 'true' || event.showCTA === 'on')
    };

    // Validar campos requeridos
    if (!cleanEvent.start_date || !cleanEvent.end_date) {
        throw new Error('Las fechas de inicio y fin son requeridas');
    }

    // Si showCTA es false, eliminar los campos CTA
    if (!cleanEvent.showCTA) {
        delete cleanEvent.ctaText;
        delete cleanEvent.ctaLink;
    } else {
        // Si showCTA es true, asegurarse de que los campos CTA existan
        cleanEvent.ctaText = cleanEvent.ctaText || '';
        cleanEvent.ctaLink = cleanEvent.ctaLink || '';
    }

    // Eliminar campos undefined o null
    Object.keys(cleanEvent).forEach(key => {
        if (cleanEvent[key] === undefined || cleanEvent[key] === null) {
            delete cleanEvent[key];
        }
    });

    return cleanEvent;
}

async function saveConfig(country, config) {
    // Procesar los eventos antes de guardar
    const processedConfig = {
        commercial_events: (config.commercial_events || []).map(event => processEventData(event, true)),
        flash_promos: (config.flash_promos || []).map(event => processEventData(event, false))
    };

    const configPath = path.join(__dirname, 'config', `${country}.json`);
    await fs.writeFile(configPath, JSON.stringify(processedConfig, null, 4));
}

async function updateCountdownScript(country, config) {
    const templatePath = path.join(__dirname, 'templates', 'countdown-template.js');
    const scriptPath = path.join(__dirname, 'public', 'js', `countdown-${country}.js`);
    
    try {
        let template = await fs.readFile(templatePath, 'utf8');
        
        // Procesar los eventos para asegurar el formato correcto
        const processEvents = async (events, isCommercial) => {
            return Promise.all(events.map(event => processEventData(event, isCommercial)));
        };

        const commercialEvents = await processEvents(config.commercial_events || [], true);
        const flashPromos = await processEvents(config.flash_promos || [], false);
        
        // Función para serializar objetos como JavaScript literal (array JS válido)
        const serializeAsJS = (obj) => {
            if (!obj || obj.length === 0) return '[]';
            return '[\n' + obj.map(item => {
                const entries = Object.entries(item).map(([key, value]) => {
                    if (typeof value === 'string') {
                        const escapedValue = value
                            .replace(/\\/g, '\\\\')
                            .replace(/'/g, "\\'")
                            .replace(/\n/g, '\\n')
                            .replace(/\r/g, '\\r')
                            .replace(/\t/g, '\\t');
                        return `${key}: '${escapedValue}'`;
                    }
                    if (typeof value === 'boolean' || typeof value === 'number') {
                        return `${key}: ${value}`;
                    }
                    if (value === null) {
                        return `${key}: null`;
                    }
                    if (typeof value === 'object') {
                        return `${key}: ${JSON.stringify(value, null, 2).replace(/\n/g, '\n    ')}`;
                    }
                    return `${key}: ${JSON.stringify(value)}`;
                });
                return `  {${entries.join(', ')}}`;
            }).join(',\n') + '\n]';
        };
        
        // Reemplazar los placeholders con objetos JS serializados
        template = template.replace('{{culture}}', COUNTRIES[country].culture);
        template = template.replace('{{commercial_events}}', serializeAsJS(commercialEvents));
        template = template.replace('{{flash_promos}}', serializeAsJS(flashPromos));
        
        // Asegurarse de que el directorio existe
        await fs.mkdir(path.dirname(scriptPath), { recursive: true });
        
        // Escribir el archivo
        await fs.writeFile(scriptPath, template);
        console.log(`Script generado para ${country} en ${scriptPath}`);
    } catch (error) {
        console.error('Error al generar el script:', error);
        throw error;
    }
}

// Rutas
app.get('/', (req, res) => {
    res.redirect('/country/ar');
});

app.get('/country/:country', async (req, res) => {
    const { country } = req.params;
    if (!COUNTRIES[country]) {
        req.session.messages = { error: 'País no válido' };
        return res.redirect('/');
    }

    try {
        const config = await readConfig(country);
        // Generar el script al cargar la página
        await updateCountdownScript(country, config);
        
        res.render('country', {
            COUNTRIES,
            country,
            config,
            moment,
            messages: req.session.messages || {}
        });
        delete req.session.messages;
    } catch (error) {
        console.error('Error al cargar la página:', error);
        req.session.messages = { error: 'Error al cargar la configuración' };
        res.redirect('/');
    }
});

app.post('/country/:country/save', async (req, res) => {
    const { country } = req.params;
    console.log('BODY:', req.body); // LOG para depuración
    if (!COUNTRIES[country]) {
        req.session.messages = { error: 'País no válido' };
        return res.redirect('/');
    }

    try {
        // Utilidad para parsear datos que pueden venir como string, objeto o array
        function parseInput(input) {
            if (!input) return [];
            if (typeof input === 'string') {
                try {
                    const parsed = JSON.parse(input);
                    return parseInput(parsed);
                } catch {
                    return [input];
                }
            }
            if (Array.isArray(input)) return input;
            if (typeof input === 'object' && input !== null) return [input];
            return [];
        }

        let config = {
            commercial_events: parseInput(req.body.commercial_events),
            flash_promos: parseInput(req.body.flash_promos)
        };

        // Si los datos están vacíos, leo el archivo config/ar.json como fallback
        if (config.commercial_events.length === 0 && config.flash_promos.length === 0) {
            console.log('Datos vacíos, usando fallback de config/ar.json');
            const fallbackConfig = require('./config/ar.json');
            config = fallbackConfig;
        }

        // Validar fechas y solapamientos
        const now = moment();
        const validateDates = (events, type) => {
            const sortedEvents = [...events].sort((a, b) => 
                moment(a.start_date).valueOf() - moment(b.start_date).valueOf()
            );

            for (let i = 0; i < sortedEvents.length; i++) {
                const event = sortedEvents[i];
                const startDate = moment(event.start_date);
                const endDate = moment(event.end_date);

                // Validar formato de fechas
                if (!startDate.isValid() || !endDate.isValid()) {
                    throw new Error(`Fechas inválidas en ${type}`);
                }

                // Validar que la fecha de inicio sea anterior a la de fin
                if (startDate.isAfter(endDate)) {
                    throw new Error(`La fecha de inicio debe ser anterior a la fecha de fin en ${type}`);
                }

                // Validar solapamientos
                if (i < sortedEvents.length - 1) {
                    const nextEvent = sortedEvents[i + 1];
                    const nextStartDate = moment(nextEvent.start_date);
                    if (endDate.isAfter(nextStartDate)) {
                        throw new Error(`Hay solapamiento de fechas en ${type}`);
                    }
                }
            }
        };

        validateDates(config.commercial_events, 'eventos comerciales');
        validateDates(config.flash_promos, 'promociones flash');

        // Guardar la configuración
        const configPath = path.join(__dirname, 'config', `${country}.json`);
        await fs.writeFile(configPath, JSON.stringify(config, null, 4));
        console.log('Configuración guardada en:', configPath);

        // Generar el script
        await updateCountdownScript(country, config);
        console.log('Script generado correctamente');

        req.session.messages = { success: 'Configuración guardada correctamente' };
    } catch (error) {
        console.error('Error al guardar la configuración:', error);
        req.session.messages = { error: error.message };
    }

    res.redirect(`/country/${country}`);
});

// Nueva ruta para obtener el script generado
app.get('/country/:country/script', async (req, res) => {
    const { country } = req.params;
    if (!COUNTRIES[country]) {
        return res.status(400).send('País no válido');
    }

    try {
        const scriptPath = path.join(__dirname, 'public', 'js', `countdown-${country}.js`);
        const script = await fs.readFile(scriptPath, 'utf8');
        res.send(script);
    } catch (error) {
        res.status(500).send('Error al leer el script');
    }
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
    console.log(`CMS corriendo en http://localhost:${PORT}`);
}).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.log(`El puerto ${PORT} está en uso, intentando con el puerto ${PORT + 1}`);
        server.close();
        app.listen(PORT + 1, () => {
            console.log(`CMS corriendo en http://localhost:${PORT + 1}`);
        });
    } else {
        console.error('Error al iniciar el servidor:', err);
    }
});

// Exporto updateCountdownScript para poder usarla desde fuera
module.exports = { updateCountdownScript };