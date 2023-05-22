// Get the pproblemNum element, textarea element and save button
const problemNum = document.getElementById('problemNum');
const input = document.getElementById('input');
const saveBtn = document.getElementById('save');

function getQuestionNum(){
  let spans = document.getElementsByTagName("span");
  let spanMatch = /\d+\. .+/;

  for (const s in spans) {
    if (spans[s].textContent && spans[s].textContent.match(spanMatch)) {
      return spans[s].textContent.split(".")[0];
    }
  }
}

function onGotTab(tab){
  if (!tab.url.match(/https:\/\/leetcode\.com\/problems\/.*/)){
    return;
  }
  browser.scripting.executeScript(
    {
      target: { tabId: tab.id },
      func: getQuestionNum,
    }
  ).then(result => problemNum.innerHTML = result[0].result);
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