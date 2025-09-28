// Background script to handle site blocking
chrome.runtime.onInstalled.addListener(() => {
    console.log('do it for extension installed');
    updateBlockingRules();
});

// Listen for storage changes to update blocking rules
chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'local' && changes.blockedSites) {
        updateBlockingRules();
    }
});

// Handle messages from content scripts and popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'openSettings') {
        chrome.tabs.create({
            url: chrome.runtime.getURL('popup.html')
        });
    }
});

async function updateBlockingRules() {
    try {
        // Get blocked sites from storage
        const result = await chrome.storage.local.get(['blockedSites']);
        const blockedSites = result.blockedSites || [];
        
        // Clear existing rules
        const existingRules = await chrome.declarativeNetRequest.getDynamicRules();
        const ruleIdsToRemove = existingRules.map(rule => rule.id);
        
        if (ruleIdsToRemove.length > 0) {
            await chrome.declarativeNetRequest.updateDynamicRules({
                removeRuleIds: ruleIdsToRemove
            });
        }
        
        // Create new rules for blocked sites
        const newRules = blockedSites.map((site, index) => ({
            id: index + 1,
            priority: 1,
            action: {
                type: 'redirect',
                redirect: {
                    url: chrome.runtime.getURL(`block.html?blocked=${encodeURIComponent(site)}`)
                }
            },
            condition: {
                urlFilter: `*://${site}/*`,
                resourceTypes: ['main_frame']
            }
        }));
        
        if (newRules.length > 0) {
            await chrome.declarativeNetRequest.updateDynamicRules({
                addRules: newRules
            });
        }
        
        console.log(`Updated blocking rules for ${blockedSites.length} sites`);
    } catch (error) {
        console.error('Error updating blocking rules:', error);
    }
}