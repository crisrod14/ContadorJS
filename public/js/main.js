// Utility functions
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type} fade-in`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('fade-out');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function formatDate(date) {
    return new Date(date).toLocaleString('es-AR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Event handling functions
function toggleEventForm(type) {
    const form = document.getElementById(`${type}-form`);
    const button = document.querySelector(`[data-toggle="${type}"]`);
    
    if (form.style.display === 'none') {
        form.style.display = 'block';
        button.textContent = 'Cancelar';
    } else {
        form.style.display = 'none';
        button.textContent = type === 'commercial' ? 'Agregar Evento Comercial' : 'Agregar Promo Flash';
        form.reset();
    }
}

function addEvent(type, eventData) {
    const container = document.getElementById(`${type}-events`);
    const eventCard = createEventCard(type, eventData);
    container.insertBefore(eventCard, container.firstChild);
    showToast(`${type === 'commercial' ? 'Evento' : 'Promo'} agregado exitosamente`);
}

function createEventCard(type, event) {
    const card = document.createElement('div');
    card.className = 'event-card fade-in';
    card.innerHTML = `
        <div class="event-header">
            <h3 class="event-title">${event.boldText}</h3>
            <span class="event-type ${type}">${type === 'commercial' ? 'Evento Comercial' : 'Promo Flash'}</span>
        </div>
        <div class="event-dates">
            <strong>Inicio:</strong> ${formatDate(event.start_date)}<br>
            <strong>Fin:</strong> ${formatDate(event.end_date)}
        </div>
        <div class="event-details">
            <div class="event-detail">
                <strong>Texto Principal:</strong>
                <span>${event.boldText}</span>
            </div>
            <div class="event-detail">
                <strong>Icono:</strong>
                <span>${event.icon}</span>
            </div>
            <div class="event-detail">
                <strong>Texto Secundario:</strong>
                <span>${event.plainText}</span>
            </div>
            <div class="event-detail">
                <strong>CTA:</strong>
                <span>${event.ctaText}</span>
            </div>
            <div class="event-detail">
                <strong>Link:</strong>
                <span>${event.ctaLink}</span>
            </div>
            <div class="event-detail">
                <strong>Rutas:</strong>
                <span>${event.routes.join(', ')}</span>
            </div>
            <div class="event-detail">
                <strong>Promocódigo:</strong>
                <span>${event.promocode}</span>
            </div>
            <div class="event-detail">
                <strong>Descuento:</strong>
                <span>${event.discount}%</span>
            </div>
        </div>
        <div class="event-actions">
            <button class="btn btn-secondary" onclick="editEvent('${type}', '${event.id}')">
                Editar
            </button>
            <button class="btn btn-danger" onclick="deleteEvent('${type}', '${event.id}')">
                Eliminar
            </button>
        </div>
    `;
    return card;
}

function editEvent(type, eventId) {
    // TODO: Implementar edición de eventos
    showToast('Función de edición en desarrollo', 'warning');
}

function deleteEvent(type, eventId) {
    if (confirm('¿Estás seguro de que deseas eliminar este evento?')) {
        const eventCard = document.querySelector(`[data-event-id="${eventId}"]`);
        eventCard.classList.add('fade-out');
        setTimeout(() => {
            eventCard.remove();
            showToast(`${type === 'commercial' ? 'Evento' : 'Promo'} eliminado exitosamente`);
        }, 300);
    }
}

// Form handling functions
function handleFormSubmit(event, type) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    
    const eventData = {
        id: Date.now().toString(),
        type: type === 'commercial' ? 'evento-comercial' : 'promo-flash',
        boldText: formData.get('boldText'),
        plainText: formData.get('plainText'),
        start_date: formData.get('start_date'),
        end_date: formData.get('end_date'),
        icon: formData.get('icon'),
        ctaText: formData.get('ctaText'),
        ctaLink: formData.get('ctaLink'),
        routes: formData.get('routes').split(',').map(r => r.trim()),
        promocode: formData.get('promocode'),
        discount: parseInt(formData.get('discount')),
        showCTA: formData.get('showCTA') === 'on',
        smartDaysGlow: formData.get('smartDaysGlow') === 'on'
    };
    
    addEvent(type, eventData);
    form.reset();
    toggleEventForm(type);
}

// Save changes function
function saveChanges() {
    const commercialEvents = Array.from(document.querySelectorAll('#commercial-events .event-card')).map(card => ({
        type: 'evento-comercial',
        boldText: card.querySelector('.event-title').textContent,
        plainText: card.querySelector('.event-detail:nth-child(3) span').textContent,
        start_date: new Date(card.querySelector('.event-dates').textContent.split('Inicio:')[1].split('Fin:')[0].trim()).toISOString(),
        end_date: new Date(card.querySelector('.event-dates').textContent.split('Fin:')[1].trim()).toISOString(),
        icon: card.querySelector('.event-detail:nth-child(2) span').textContent,
        ctaText: card.querySelector('.event-detail:nth-child(4) span').textContent,
        ctaLink: card.querySelector('.event-detail:nth-child(5) span').textContent,
        routes: card.querySelector('.event-detail:nth-child(6) span').textContent.split(',').map(r => r.trim()),
        promocode: card.querySelector('.event-detail:nth-child(7) span').textContent,
        discount: parseInt(card.querySelector('.event-detail:nth-child(8) span').textContent),
        showCTA: true,
        smartDaysGlow: true
    }));
    
    const flashEvents = Array.from(document.querySelectorAll('#flash-events .event-card')).map(card => ({
        type: 'promo-flash',
        boldText: card.querySelector('.event-title').textContent,
        plainText: card.querySelector('.event-detail:nth-child(3) span').textContent,
        start_date: new Date(card.querySelector('.event-dates').textContent.split('Inicio:')[1].split('Fin:')[0].trim()).toISOString(),
        end_date: new Date(card.querySelector('.event-dates').textContent.split('Fin:')[1].trim()).toISOString(),
        icon: card.querySelector('.event-detail:nth-child(2) span').textContent,
        ctaText: card.querySelector('.event-detail:nth-child(4) span').textContent,
        ctaLink: card.querySelector('.event-detail:nth-child(5) span').textContent,
        routes: card.querySelector('.event-detail:nth-child(6) span').textContent.split(',').map(r => r.trim()),
        promocode: card.querySelector('.event-detail:nth-child(7) span').textContent,
        discount: parseInt(card.querySelector('.event-detail:nth-child(8) span').textContent),
        showCTA: true,
        smartDaysGlow: true
    }));
    
    const data = {
        commercial_events: commercialEvents,
        flash_promos: flashEvents
    };
    
    fetch(`/country/${window.location.pathname.split('/')[2]}/save`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showToast('Cambios guardados exitosamente');
        } else {
            showToast('Error al guardar los cambios', 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showToast('Error al guardar los cambios', 'error');
    });
}

// Initialize event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Form submission handlers
    document.getElementById('commercial-form').addEventListener('submit', (e) => handleFormSubmit(e, 'commercial'));
    document.getElementById('flash-form').addEventListener('submit', (e) => handleFormSubmit(e, 'flash'));
    
    // Toggle button handlers
    document.querySelector('[data-toggle="commercial"]').addEventListener('click', () => toggleEventForm('commercial'));
    document.querySelector('[data-toggle="flash"]').addEventListener('click', () => toggleEventForm('flash'));
}); 