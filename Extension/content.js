// Listen for messages from the background script
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'getStatus') {
      const url = window.location.href;
  
      // Retrieve the temporary status from local storage
      chrome.storage.local.get(url, function(result) {
        const status = result[url] || 'Checking';
        sendResponse({ status });
      });
  
      // Keep the connection open for async response
      return true;
    }
  });
  
  // Inject CSS styles for the popup status
  const style = document.createElement('style');
  style.textContent = `
    .ge-popup-status {
      position: fixed;
      top: 10px;
      right: 10px;
      background-color: #333;
      color: #fff;
      padding: 8px;
      font-size: 14px;
      font-weight: bold;
      z-index: 9999;
    }
  `;
  document.head.appendChild(style);
  
  // Create the popup status element
  const popupStatus = document.createElement('div');
  popupStatus.className = 'ge-popup-status';
  document.body.appendChild(popupStatus);
  
  // Send a message to the background script to get the current status
  chrome.runtime.sendMessage({ action: 'getStatus' }, function(response) {
    if (response && response.status) {
      popupStatus.textContent = response.status;
    }
  });
  
  // Listen for messages from the background script
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'updateStatus') {
      popupStatus.textContent = request.status;
    }
  });
  