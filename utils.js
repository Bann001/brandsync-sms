// Utility functions for UI and Logic

// Show Toast notification
window.showToast = (message, type = 'success') => {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let icon = 'icon-lucide-check-circle';
    if (type === 'error') icon = 'icon-lucide-alert-circle';

    toast.innerHTML = `
        <i class="${icon}"></i>
        <div>${message}</div>
    `;

    container.appendChild(toast);

    // Animate out and remove
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
};

// GSM 7-bit validation and counter
// A standard GSM 7-bit character set includes basic letters, numbers, and some symbols.
// For simplicity, we define max length rules.
window.calculateSMSLength = (text) => {
    // Check if contains non-GSM characters (e.g. unicode / emojis)
    const gsmRegex = /^[@£$¥èéùìòÇ\nØø\rÅåΔ_ΦΓΛΩΠΨΣΘΞ\^{}\[\]~|€ÆæßÉ !"#¤%&'()*+,\-./0-9:;<=>?¡A-ZÄÖÑÜ§¿a-zäöñüà]*$/;
    const isGSM = gsmRegex.test(text);
    const length = text.length;

    let segmentLength = 160;
    let maxSegments = 1;
    let encoding = isGSM ? 'GSM-7' : 'UCS-2';

    if (isGSM) {
        if (length > 160) segmentLength = 153; // Concatenated SMS standard
        maxSegments = Math.ceil(length / segmentLength) || 1;
    } else {
        segmentLength = 70;
        if (length > 70) segmentLength = 67;
        maxSegments = Math.ceil(length / segmentLength) || 1;
    }

    return {
        length,
        segments: maxSegments,
        encoding,
        remainingInSegment: segmentLength - (length % segmentLength === 0 && length > 0 ? segmentLength : length % segmentLength)
    };
};
