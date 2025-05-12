# JetSmart Countdown CMS

Sistema de gestión de contenido para los contadores regresivos de JetSmart Airlines.

## Descripción

Este CMS permite gestionar los eventos comerciales y promociones flash para diferentes países donde opera JetSmart Airlines. El sistema genera scripts personalizados para cada país que pueden ser integrados en los sitios web correspondientes.

## Características

- Gestión de eventos comerciales y promociones flash
- Soporte para múltiples países
- Generación automática de scripts personalizados
- Interfaz intuitiva y fácil de usar
- Validación de fechas y solapamientos
- Soporte para diferentes idiomas y zonas horarias

## Requisitos

- Node.js (v14 o superior)
- npm (v6 o superior)

## Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/tu-usuario/jetsmart-countdown-cms.git
cd jetsmart-countdown-cms
```

2. Instalar dependencias:
```bash
npm install
```

3. Iniciar el servidor:
```bash
npm run dev
```

El CMS estará disponible en `http://localhost:3000`

## Uso

1. Accede al CMS a través de tu navegador
2. Selecciona el país que deseas configurar
3. Agrega o modifica eventos comerciales y promociones flash
4. Guarda los cambios
5. Utiliza el botón "Ver Script" para obtener el código a integrar

## Estructura del Proyecto

```
jetsmart-countdown-cms/
├── config/             # Archivos de configuración por país
├── public/            # Archivos estáticos
│   ├── css/          # Estilos
│   ├── js/           # Scripts generados
│   └── img/          # Imágenes
├── templates/         # Plantillas para scripts
├── views/            # Vistas EJS
├── server.js         # Servidor Express
└── package.json      # Dependencias y scripts
```

## Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## Contacto

Tu Nombre - [@tutwitter](https://twitter.com/tutwitter) - email@ejemplo.com

Link del Proyecto: [https://github.com/tu-usuario/jetsmart-countdown-cms](https://github.com/tu-usuario/jetsmart-countdown-cms) 