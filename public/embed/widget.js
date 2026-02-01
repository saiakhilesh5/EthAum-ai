// EthAum.ai Embed Widget Script
// Usage: <script src="https://ethaum.ai/embed/widget.js" data-startup-id="..." async></script>

(function() {
  'use strict';

  const ETHAUM_BASE_URL = 'https://ethaum.ai';

  function init() {
    // Find all script tags for this widget
    const scripts = document.querySelectorAll('script[data-startup-id]');

    scripts.forEach(function(script) {
      const startupId = script.getAttribute('data-startup-id');
      const theme = script.getAttribute('data-theme') || 'light';
      const size = script.getAttribute('data-size') || 'md';
      const showReviews = script.getAttribute('data-show-reviews') !== 'false';

      if (!startupId) {
        console.error('EthAum Widget: Missing data-startup-id attribute');
        return;
      }

      // Find or create container
      let container = document.getElementById('ethaum-trust-badge-' + startupId);
      
      if (!container) {
        // Create container before the script tag
        container = document.createElement('div');
        container.id = 'ethaum-trust-badge-' + startupId;
        script.parentNode.insertBefore(container, script);
      }

      // Create iframe
      const iframe = document.createElement('iframe');
      iframe.src = ETHAUM_BASE_URL + '/embed/trust-badge/' + startupId + 
        '?theme=' + theme + 
        '&size=' + size + 
        '&reviews=' + showReviews;
      iframe.frameBorder = '0';
      iframe.scrolling = 'no';
      iframe.loading = 'lazy';
      iframe.title = 'EthAum Trust Badge';
      
      // Set dimensions based on size
      const dimensions = {
        sm: { width: '200px', height: '60px' },
        md: { width: '300px', height: '80px' },
        lg: { width: '400px', height: '100px' }
      };

      const dim = dimensions[size] || dimensions.md;
      iframe.style.width = dim.width;
      iframe.style.height = dim.height;
      iframe.style.border = 'none';
      iframe.style.borderRadius = '8px';
      iframe.style.overflow = 'hidden';

      // Clear container and append iframe
      container.innerHTML = '';
      container.appendChild(iframe);

      // Add resize listener for responsive behavior
      window.addEventListener('message', function(event) {
        if (event.origin !== ETHAUM_BASE_URL) return;
        
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'ethaum-resize' && data.startupId === startupId) {
            iframe.style.height = data.height + 'px';
          }
        } catch (e) {
          // Ignore parsing errors
        }
      });
    });
  }

  // Run init when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
