// Get the pproblemNum element, textarea element and save button
const problemNum = document.getElementById('problemNum');
const noteNumSelect = document.getElementById('noteNumSelect');
const input = document.getElementById('input');
const saveBtn = document.getElementById('save');

var notes;

// Get question number
function getQuestionNum(){
  let spans = document.getElementsByTagName("span");
  // match anything that has more than 1 number, then a dot + space, then more than 1 letter of anything
  let spanMatch = /\d+\. .+/;   

  for (const s in spans) {
    if (spans[s].textContent && spans[s].textContent.match(spanMatch)) {
      return spans[s].textContent.split(".")[0];
    }
  }
}

function onGotTab(tab){
  if (!tab.url.match(/https:\/\/leetcode\.com\/problems\/.*/)){
    input.value = notes[noteNumSelect.value] || "";
    problemNum.innerText = "Please go to a leetcode question to start"
    throw new Error("Not in a leetcode page!");
  }

  // Get question number from the page
  return browser.scripting.executeScript(
    {
      target: { tabId: tab.id },
      func: getQuestionNum,
    }
  );
}

// Set title to current page number and select/add it to the dropdown menu
function onGotProblemNum(foundProbNum){
  problemNum.innerText = "Question " + foundProbNum;
  if (foundProbNum in notes){
    input.value = notes[foundProbNum];
  } else {
    addToProblemNoteDropdown(foundProbNum);
  }
  noteNumSelect.value = foundProbNum;
}

// Initialize notes var, populate dropdown menu with saved notes
function onGotStoredNotes(notesData){
  notes = notesData.notes || {};
  for (const probNum of Object.keys(notes)){
    addToProblemNoteDropdown(probNum);
  }
  return browser.tabs.query({ active: true, currentWindow: true });
}

// Add probNum to the dropdown select menu
function addToProblemNoteDropdown(probNum){
  let problemNote = document.createElement('option');
  problemNote.value = probNum;
  problemNote.innerHTML = probNum;
  noteNumSelect.appendChild(problemNote);
}

function onError(error){
  console.log(`Error: ${error}`);
}

// Load saved text on page load
window.onload = () => {
  browser.storage.local.get("notes")
    .then(data => onGotStoredNotes(data), onError)
    .then(tabs => onGotTab(tabs[0]), onError)
    .then(foundProbNum => onGotProblemNum(foundProbNum[0].result), onError);
};

noteNumSelect.onchange = () => {
  input.value = notes[noteNumSelect.value] || "";
}

// Save text when button is clicked
saveBtn.onclick = () => {
  notes[noteNumSelect.value] = input.value;
  browser.storage.local.set({ notes: notes });
};