export function showLoadingIndicator(message) {
    let indicator = document.getElementById('loadingIndicator');
    if (!indicator) {
        indicator = document.createElement('div');
        indicator.id = 'loadingIndicator';
        Object.assign(indicator.style, {
            position: 'fixed', bottom: '20px', left: '20px',
            backgroundColor: 'rgba(0,0,0,0.8)', color: 'white',
            padding: '10px 20px', borderRadius: '8px', 
            zIndex: '10000', boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            fontSize: '14px'
        });
        document.body.appendChild(indicator);
    }
    indicator.textContent = message;
    indicator.style.display = 'block';
    return indicator;
}

export function hideLoadingIndicator(indicator) {
    if (indicator && indicator.style) { 
        indicator.style.display = 'none';
    } else {
        const existingIndicator = document.getElementById('loadingIndicator');
        if (existingIndicator) {
            existingIndicator.style.display = 'none';
        }
    }
}