// Get the textarea element and save button
const problemNum = document.getElementById('problemNum');
const input = document.getElementById('input');
const saveBtn = document.getElementById('save');

function onGotTab(tab){
  console.log(tab);
  if (tab.url.match(/https:\/\/leetcode\.com\/problems\/.*/)){
    problemNum.innerHTML = tab.url;
  } else {
    problemNum.innerHTML = "Not in a leetcode site";
  }
}

function onError(error){
  console.log(`Error: ${error}`);
}

// Load saved text on page load
window.onload = () => {
  browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => onGotTab(tabs[0]), onError);

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