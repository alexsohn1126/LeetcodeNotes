// Get the textarea element and save button
const input = document.getElementById('input');
const saveBtn = document.getElementById('save');

// Load saved text on page load
window.onload = () => {
  browser.storage.sync.get('savedText').then((data) => {
    if (data.savedText) {
      input.value = data.savedText;
    }
  });
};

// Save text when button is clicked
saveBtn.onclick = () => {
  const text = input.value;
  browser.storage.sync.set({ savedText: text });
};