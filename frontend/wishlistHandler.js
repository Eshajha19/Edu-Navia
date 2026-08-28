export class UnivWishlistHandler {
    constructor() {
        this.wishlist = JSON.parse(localStorage.getItem('eduNavia_univ_wishlist')) || [];
        this.listeners = [];
    }

    subscribe(callback) {
        this.listeners.push(callback);
    }

    notify() {
        this.listeners.forEach(cb => cb(this.wishlist));
    }

    toggle(univName) {
        if (this.wishlist.includes(univName)) {
            this.wishlist = this.wishlist.filter(n => n !== univName);
        } else {
            this.wishlist.push(univName);
        }
        localStorage.setItem('eduNavia_univ_wishlist', JSON.stringify(this.wishlist));
        this.notify();
        return this.wishlist.includes(univName);
    }

    getWishlist() {
        return this.wishlist;
    }
}

// Singleton Instance
export const univWishlist = new UnivWishlistHandler();

// Global handler for HTML inline onclick
window.handleUnivWishlist = function(btn, univName) {
    const isWished = univWishlist.toggle(univName);
    
    // Animate heartbeat effect
    btn.style.transform = "scale(1.2)";
    setTimeout(() => btn.style.transform = "scale(1)", 150);
    
    // Re-render ALL hearts to keep in sync
    document.querySelectorAll('.univ-wishlist-btn').forEach(b => {
        // Some buttons might be nested or have different attributes, checking via onclick fallback if needed
        const bName = b.dataset.univName || b.getAttribute('onclick').split("'")[1];
        if (bName === univName) {
            const svg = b.querySelector('svg');
            if (svg) {
                svg.setAttribute('fill', isWished ? '#ff4b4b' : 'none');
                svg.setAttribute('stroke', isWished ? '#ff4b4b' : '#ccc');
                svg.style.transition = 'all 0.2s';
            }
        }
    });
};
