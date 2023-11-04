document.addEventListener('DOMContentLoaded', function() {
    const statusElement = document.getElementById('status');
    const whitelistForm = document.getElementById('whitelist-form');
    const urlInput = document.getElementById('url-input');
    const whitelist = document.getElementById('whitelist');
  
    // Function to update the status field
    function updateStatusField(status) {
      statusElement.textContent = status;
    }
  
    // Listen for messages from the background script
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'updateStatus') {
      updateStatusField(request.status);
    }
  });
});

  
    // Retrieve the whitelist from local storage and display it
    chrome.storage.local.get(null, function(items) {
      Object.keys(items).forEach(function(url) {
        if (url !== 'status') {
          addWhitelistItem(url);
        }
      });
    });
  
    // Add event listener for the whitelist form submission
    whitelistForm.addEventListener('submit', function(event) {
      event.preventDefault();
      const url = urlInput.value.trim();
      if (url) {
        addWhitelistItem(url);
        urlInput.value = '';
  
        // Store the URL in the local storage
        chrome.storage.local.set({ [url]: 'Legitimate' });
      }
    });
  
    // Add event listener for the remove button clicks
    whitelist.addEventListener('click', function(event) {
      const removeButton = event.target.closest('.remove-btn');
      if (removeButton) {
        const listItem = removeButton.closest('.whitelist-item');
        const url = listItem.dataset.url;
        if (url) {
          listItem.remove();
  
          // Remove the URL from the local storage
          chrome.storage.local.remove(url);
        }
      }
    });
  
    // Function to add a new whitelist item
    function addWhitelistItem(url) {
      const listItem = document.createElement('li');
      listItem.className = 'whitelist-item';
      listItem.dataset.url = url;
  
      const urlElement = document.createElement('span');
      urlElement.className = 'url';
      urlElement.textContent = url;
  
      const removeButton = document.createElement('span');
      removeButton.className = 'remove-btn';
      removeButton.textContent = 'Remove';
  
      listItem.appendChild(urlElement);
      listItem.appendChild(removeButton);
      whitelist.appendChild(listItem);
    }
  
    // Listen for messages from the background script
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
      if (request.action === 'updateStatus') {
        updateStatusField(request.status);
      }
    });
  });
  