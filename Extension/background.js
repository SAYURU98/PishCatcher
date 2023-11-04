chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.status === 'loading' && isUrlValid(tab.url)) {
      // Send POST request to the API
      const apiUrl = 'http://localhost:8000/predict'; // Updated API URL
      const url = tab.url;
      const data = { url };
  
      fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
        .then(response => response.json())
        .then(result => {
          handleApiResponse(result, tabId, tab.url);
        })
        .catch(error => {
          console.error('Error:', error);
        });
    }
  });
  
  function handleApiResponse(result, tabId, url) {
    if (result === 1) {
      // Block access to the webpage
      chrome.tabs.update(tabId, { url: 'blocked.html' });
    } else if (result === 0) {
      // Update the temporary status in local storage
      chrome.storage.local.set({ status: 'Legitimate', [url]: 'Legitimate' }, function() {
        // Send a message to the popup script to update the status field
        chrome.runtime.sendMessage({ action: 'updateStatus', status: 'Legitimate' });
      });
    } else {
      // Handle error or invalid result
      chrome.storage.local.set({ status: 'Checking' }, function() {
        chrome.runtime.sendMessage({ action: 'updateStatus', status: 'Checking' });
      });
    }
  }
  
  function isUrlValid(url) {
    // Add your URL validation logic here
    // Return true if the URL is valid, false otherwise
    // Example validation: Check if the URL starts with "http://" or "https://"
    return url.startsWith('http://') || url.startsWith('https://');
  }
  
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'getStatus') {
      chrome.storage.local.get('status', function(result) {
        const status = result.status || '';
        sendResponse({ status: status });
      });
    }
  });
  