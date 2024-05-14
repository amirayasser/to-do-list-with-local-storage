var container = document.querySelector(".container");
var form = document.getElementsByTagName("form")[0];
var input = document.getElementsByTagName("input")[0];
var plus = document.querySelector(".plusBtn");
var tasksList = document.querySelector(".tasksList");
var toDay = document.getElementsByClassName("today")[0];
var clrBtn = document.querySelector(".clr");

// local storage variables
let items = JSON.parse(localStorage.getItem("taskItem")) || [];
// let data = JSON.parse(localStorage.getItem('tasks')) ? JSON.parse(localStorage.getItem('tasks')) : [];

// Initialize the task counter and load it from local storage on page load
var taskCount = 0 || localStorage.getItem("taskCount");

// loadTasks(); // get data from ls

window.onload = function () {
  input.focus();
  loadTasks();
  updateTaskCount();
};

// Show what day of the week it is today
let today = new Date();
let weekDay = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

toDay.innerHTML =
  '<i class="fa-solid fa-list-check"></i>' + ` It's ${weekDay[today.getDay()]}`;

// Initialize finished tasks and count
var finishedTasks = JSON.parse(localStorage.getItem("finTask")) || [];
var finishedTasksCount = parseInt(localStorage.getItem("finTaskCount")) || 0;

// Create the taskCountMsg element and place it after form's parent
var taskCountMsg = document.createElement("div");
taskCountMsg.className = "task-count";
container.insertBefore(taskCountMsg, form);

// Load tasks and updated task count from local storage on page load
loadTasks();
updateTaskCount();

form.addEventListener("submit", (e) => {
  // prevent refresh page after submiting
  e.preventDefault();

  if (input.value == "") {
    alertMsg();

  } else {
    createTask(input.value);
    // Save the tasks to local storage
    saveTasksToLS();

    // clear input field after adding task
    input.value = "";

    taskCount++; // Increment the task count
    updateTaskCount();
    // Save the task count to local storage
    saveTaskCountToLS();
  }
});

document.addEventListener("click", function (e) {
  // click on delete btn to remove task
  if (e.target.className == "del") {
    // add class 'rem' to the task-box which you click on its delete btn
    e.target.parentNode.classList = "task-box rem";

    setTimeout(function () {
      // Delete the task-box from the UI
      e.target.parentNode.remove();

      // Remove the task from local storage
      removeTaskFromLs(e.target.parentNode.textContent);
      console.log(e.target.parentNode);

      taskCount--; // Decrement the task count
      updateTaskCount();
      saveTaskCountToLS(); // Update and save the task count to local storage
    
    }, 1000);
  }
});

function createTask(taskText) {
  var item = document.createElement("div");
  item.className = "task-box";

  // Create a checkbox
  var checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  item.appendChild(checkbox);

  // task text is input value
  let itemTxt = document.createTextNode(taskText);
  item.appendChild(itemTxt);

  createDelBtn(item);

  tasksList.appendChild(item); // append task item into task list

  checkFin(item, checkbox);
}

function createDelBtn(item) {
  var delBtn = document.createElement("span");
  var delTxt = document.createTextNode("Delete");
  delBtn.appendChild(delTxt);
  delBtn.setAttribute("class", "del");
  item.appendChild(delBtn);
}

function updateTaskCount() {
  var finishedTasks = document.querySelectorAll(".task-box.finished");
  var finishedTasksTexts = Array.from(finishedTasks).map((task) =>
    task.innerText.trim()
  );
  var finishedTasksCount = finishedTasksTexts.length;

  // Save finished tasks and count to local storage
  finishedLS(finishedTasksTexts, finishedTasksCount);
  // loadFinLs(); // Load finished tasks from local storage

  // Update the task counter message
  taskCountMsg.innerHTML =
    "You have " +
    taskCount +
    " tasks <br> No. of finished tasks is " +
    finishedTasksCount;
}

function finishedLS(ft, ftc) {
  // Save finished tasks and count to local storage
  localStorage.setItem("finTask", JSON.stringify(Array.from(ft)));
  localStorage.setItem("finTaskCount", JSON.stringify(ftc));
}

function loadFinLs() {
  // Load finished tasks and count from local storage
  finishedTasks = JSON.parse(localStorage.getItem("finTask")) || [];
  finishedTasksCount = parseInt(localStorage.getItem("finTaskCount")) || 0;

  // Rebuild the finished tasks NodeList
  rebuildFinishedTasks();
}
// Rebuild the finished tasks NodeList
function rebuildFinishedTasks() {
  finishedTasks.forEach(function (taskText) {
    // Create task element and append it to the tasksList
    var item = document.createElement("div");
    item.className = "task-box finished";

    // Create a checkbox
    var checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = true; // Mark it as finished
    checkbox.style.display = "none"; // Hide the checkbox
    item.appendChild(checkbox);

    // Task text is input value
    let itemTxt = document.createTextNode(taskText);
    item.appendChild(itemTxt);

    createDelBtn(item);

    tasksList.appendChild(item); // Append task item into task list
  });
}

// Call updateTaskCount in the appropriate places to ensure it gets updated when tasks are marked as finished
// For example, you can call it within the checkFin function
function checkFin(item, checkbox) {
  checkbox.addEventListener("change", function () {
    item.classList.toggle("finished", checkbox.checked);
    updateTaskCount();
    // Save the state of the checkbox to local storage
    saveTasksToLS();
  });
}

function alertMsg() {
  let alert = document.createElement("div");
  let iconSpan = document.createElement("span");
  iconSpan.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i>';
  let alertTxt = document.createTextNode(
    "   Oops! Please, enter the item name"
  );
  alert.appendChild(iconSpan);
  alert.appendChild(alertTxt);
  alert.setAttribute("class", "alert");

  // locate alert msg before tasks
  container.insertBefore(alert, tasksList);

  // Remove alert msg after typing
  input.addEventListener("focus", function () {
    alert.remove();
  });
}

// local storage part:

// Save task count to local storage
function saveTaskCountToLS() {
  localStorage.setItem("taskCount", taskCount);
}

// Load task count from local storage
function loadTaskCountFromLS() {
  taskCount = parseInt(localStorage.getItem("taskCount")) || 0;
}


function saveTasksToLS() {
  localStorage.setItem("tasksList", tasksList.innerHTML);
}

function loadTasks() {
  var savedTasks = localStorage.getItem("tasksList");
  if (savedTasks) {
    tasksList.innerHTML = savedTasks;
  }
}

// remove task box from local storage
function removeTaskFromLs(remTask) {
  localStorage.removeItem(remTask);

  items = items.filter(function (task) {
    console.log(task + "Delete");
    console.log(remTask);

    if (task + "Delete" !== remTask && task !== "") {
      return task;
    }
  });

  // Filter out empty strings from the array
  items = items.filter(Boolean);

  saveTasksToLS(); // Save the updated tasks to local storage
}

// clear all data on local storage
clrBtn.onclick = function () {
  // clear on ls
  localStorage.clear();
  // clear in ui
  while (tasksList.firstChild) {
    tasksList.removeChild(tasksList.firstChild);
  }

  items = [];
  taskCount = 0;
  updateTaskCount();
  saveTaskCountToLS();
};
