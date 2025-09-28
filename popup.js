document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const settingsBtn = document.getElementById('settingsBtn');
    const backBtn = document.getElementById('backBtn');
    const mainView = document.getElementById('mainView');
    const settingsView = document.getElementById('settingsView');
    const pronounSelect = document.getElementById('pronounSelect');
    const photoUpload = document.getElementById('photoUpload');
    const saveSettings = document.getElementById('saveSettings');
    const removePhoto = document.getElementById('removePhoto');
    const userPhoto = document.getElementById('userPhoto');
    const photoPlaceholder = document.getElementById('photoPlaceholder');
    const motivationMessage = document.getElementById('motivationMessage');
    const siteInput = document.getElementById('siteInput');
    const addSiteBtn = document.getElementById('addSite');
    const blockedSitesList = document.getElementById('blockedSitesList');

    // Load saved settings on startup
    loadSettings();

    // Event listeners
    settingsBtn.addEventListener('click', () => {
        mainView.style.display = 'none';
        settingsView.style.display = 'block';
    });

    backBtn.addEventListener('click', () => {
        settingsView.style.display = 'none';
        mainView.style.display = 'block';
    });

    photoUpload.addEventListener('change', handlePhotoUpload);
    removePhoto.addEventListener('click', handleRemovePhoto);
    saveSettings.addEventListener('click', handleSaveSettings);
    addSiteBtn.addEventListener('click', handleAddSite);
    siteInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleAddSite();
        }
    });

    function handlePhotoUpload(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const imageData = e.target.result;
                userPhoto.src = imageData;
                userPhoto.style.display = 'block';
                photoPlaceholder.style.display = 'none';
                removePhoto.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    }

    function handleRemovePhoto() {
        userPhoto.style.display = 'none';
        photoPlaceholder.style.display = 'flex';
        removePhoto.style.display = 'none';
        photoUpload.value = '';
        
        // Remove from storage
        chrome.storage.local.remove(['userPhoto']);
    }

    function handleSaveSettings() {
        const pronoun = pronounSelect.value;
        const photoSrc = userPhoto.src;

        const settings = {
            pronoun: pronoun
        };

        if (photoSrc && !photoSrc.includes('blob:')) {
            settings.userPhoto = photoSrc;
        }

        chrome.storage.local.set(settings, function() {
            updateMainView();
            // Go back to main view
            settingsView.style.display = 'none';
            mainView.style.display = 'block';
        });
    }

    function loadSettings() {
        chrome.storage.local.get(['pronoun', 'userPhoto', 'blockedSites'], function(result) {
            if (result.pronoun) {
                pronounSelect.value = result.pronoun;
            }
            
            if (result.userPhoto) {
                userPhoto.src = result.userPhoto;
                userPhoto.style.display = 'block';
                photoPlaceholder.style.display = 'none';
                removePhoto.style.display = 'block';
            }

            if (result.blockedSites) {
                displayBlockedSites(result.blockedSites);
            } else {
                displayBlockedSites([]);
            }

            updateMainView();
        });
    }

    function updateMainView() {
        chrome.storage.local.get(['pronoun', 'userPhoto'], function(result) {
            if (result.pronoun && result.userPhoto) {
                motivationMessage.textContent = `do it for ${result.pronoun}`;
                userPhoto.src = result.userPhoto;
                userPhoto.style.display = 'block';
                photoPlaceholder.style.display = 'none';
            } else if (result.pronoun) {
                motivationMessage.textContent = `do it for ${result.pronoun}`;
            } else if (result.userPhoto) {
                motivationMessage.textContent = 'Click settings to add a pronoun';
                userPhoto.src = result.userPhoto;
                userPhoto.style.display = 'block';
                photoPlaceholder.style.display = 'none';
            } else {
                motivationMessage.textContent = 'Click settings to set up your motivation';
                userPhoto.style.display = 'none';
                photoPlaceholder.style.display = 'flex';
            }
        });
    }

    function handleAddSite() {
        const siteUrl = siteInput.value.trim();
        if (!siteUrl) return;

        // Clean up the URL (remove protocol, www, trailing slash)
        const cleanUrl = siteUrl.replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/$/, '');
        
        chrome.storage.local.get(['blockedSites'], function(result) {
            const blockedSites = result.blockedSites || [];
            
            if (!blockedSites.includes(cleanUrl)) {
                blockedSites.push(cleanUrl);
                chrome.storage.local.set({ blockedSites: blockedSites }, function() {
                    displayBlockedSites(blockedSites);
                    siteInput.value = '';
                });
            }
        });
    }

    function displayBlockedSites(sites) {
        blockedSitesList.innerHTML = '';
        
        if (sites.length === 0) {
            blockedSitesList.innerHTML = '<div class="empty-list">No blocked sites yet</div>';
            return;
        }

        sites.forEach((site, index) => {
            const siteItem = document.createElement('div');
            siteItem.className = 'blocked-site-item';
            siteItem.innerHTML = `
                <span class="site-url">${site}</span>
                <button class="remove-site-btn" data-site="${site}">×</button>
            `;
            
            siteItem.querySelector('.remove-site-btn').addEventListener('click', function() {
                removeSite(site);
            });
            
            blockedSitesList.appendChild(siteItem);
        });
    }

    function removeSite(siteToRemove) {
        chrome.storage.local.get(['blockedSites'], function(result) {
            const blockedSites = result.blockedSites || [];
            const updatedSites = blockedSites.filter(site => site !== siteToRemove);
            
            chrome.storage.local.set({ blockedSites: updatedSites }, function() {
                displayBlockedSites(updatedSites);
            });
        });
    }
});