document.addEventListener('DOMContentLoaded', function() {
    const motivationPhoto = document.getElementById('motivationPhoto');
    const photoPlaceholder = document.getElementById('photoPlaceholder');
    const motivationMessage = document.getElementById('motivationMessage');
    const blockedUrl = document.getElementById('blockedUrl');
    const goBackBtn = document.getElementById('goBack');
    const allowOnceBtn = document.getElementById('allowOnce');
    const openSettingsBtn = document.getElementById('openSettings');

    // Get the blocked URL from the current page
    const currentUrl = window.location.href;
    const urlParams = new URLSearchParams(window.location.search);
    const blocked = urlParams.get('blocked') || window.location.hostname;
    
    if (blocked) {
        blockedUrl.textContent = blocked;
    }

    // Load user settings
    loadUserSettings();

    // Event listeners
    goBackBtn.addEventListener('click', () => {
        window.history.back();
    });

    allowOnceBtn.addEventListener('click', () => {
        // Store temporary permission and redirect
        const originalUrl = urlParams.get('url');
        if (originalUrl) {
            // Set temporary permission for this session
            sessionStorage.setItem(`allow_${blocked}`, 'true');
            window.location.href = originalUrl;
        } else {
            window.history.back();
        }
    });

    openSettingsBtn.addEventListener('click', (e) => {
        e.preventDefault();
        // Open extension popup (this will only work in Chrome extensions context)
        if (chrome && chrome.runtime) {
            chrome.runtime.sendMessage({action: 'openSettings'});
        }
    });

    function loadUserSettings() {
        if (chrome && chrome.storage) {
            chrome.storage.local.get(['pronoun', 'userPhoto'], function(result) {
                if (result.userPhoto) {
                    motivationPhoto.src = result.userPhoto;
                    motivationPhoto.style.display = 'block';
                    photoPlaceholder.style.display = 'none';
                }

                if (result.pronoun) {
                    motivationMessage.textContent = `Stay focused and do it for ${result.pronoun}!`;
                }
            });
        }
    }
});