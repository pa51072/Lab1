document.addEventListener("DOMContentLoaded", function () {
    if (localStorage.getItem("tasks")) {
        let tasks = JSON.parse(localStorage.getItem("tasks"));
        displayTasks(tasks);
    }
});

function addTask() {
    let taskInput = document.getElementById("taskInput");
    let dueDateInput = document.getElementById("dueDate");
    let taskText = taskInput.value;
    let dueDate = dueDateInput.value;

    if (taskText.length < 3 || taskText.length > 255) {
        alert("Tekst zadania musi mieć co najmniej 3 znaki i nie więcej niż 255 znaków.");
        return;
    }

    if (dueDate !== "" && new Date(dueDate) <= new Date()) {
        alert("Data wykonania zadania musi być pusta lub w przyszłości.");
        return;
    }

    let tasks = localStorage.getItem("tasks") ? JSON.parse(localStorage.getItem("tasks")) : [];
    tasks.push({ text: taskText, dueDate: dueDate });
    localStorage.setItem("tasks", JSON.stringify(tasks));
    displayTasks(tasks);
    taskInput.value = "";
    dueDateInput.value = "";
}

function displayTasks(tasks, searchTerm) {
    let taskList = document.getElementById("taskList");
    taskList.innerHTML = "";

    tasks.forEach(function (task, index) {
        let listItem = document.createElement("li");
        let taskText = task.text;

        let displayText = taskText;
        if (searchTerm && taskText.toLowerCase().includes(searchTerm)) {
            let startIndex = taskText.toLowerCase().indexOf(searchTerm);
            let endIndex = startIndex + searchTerm.length;

            displayText = `${taskText.substring(0, startIndex)}<span class="highlight">${taskText.substring(startIndex, endIndex)}</span>${taskText.substring(endIndex)}`;
        }

        listItem.innerHTML = `${displayText} 
                             <input type="text" id="editText${index}" class="editFields" value="${taskText}">
                             <input type="date" id="editDueDate${index}" class="editFields" value="${task.dueDate || ''}">
                             <button class="editButton" onclick="saveChanges(${index})">Edytuj</button>
                             <button id="rem" onclick="removeTask(${index})">Usuń</button>`;

        if (task.dueDate) {
            listItem.innerHTML += " - Termin wykonania: " + task.dueDate;
        }

        taskList.appendChild(listItem);
    });
}


function removeTask(index) {
    let tasks = JSON.parse(localStorage.getItem("tasks"));
    tasks.splice(index, 1);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    displayTasks(tasks);
}

function saveChanges(index) {
    let tasks = JSON.parse(localStorage.getItem("tasks"));
    let editTextElement = document.getElementById(`editText${index}`);
    let editDueDateElement = document.getElementById(`editDueDate${index}`);

    tasks[index].text = editTextElement.value;
    tasks[index].dueDate = editDueDateElement.value;

    localStorage.setItem("tasks", JSON.stringify(tasks));
    editTextElement.style.display = "none";
    editDueDateElement.style.display = "none";
    displayTasks(tasks);
}

function searchTasks() {
    let searchInput = document.getElementById("searchInput");
    let searchTerm = searchInput.value.toLowerCase();
    let tasks = localStorage.getItem("tasks") ? JSON.parse(localStorage.getItem("tasks")) : [];
    let filteredTasks = tasks.filter(function (task) {
        return task.text && task.text.toLowerCase().includes(searchTerm);
    });

    displayTasks(filteredTasks, searchTerm);
}

function handleListClick(event) {
    let target = event.target;

    if (target.tagName === 'LI') {
        let index = Array.from(target.parentElement.children).indexOf(target);
        showEditFields(index);
    }
}

function showEditFields(index) {
    let editTextElement = document.getElementById(`editText${index}`);
    let editDueDateElement = document.getElementById(`editDueDate${index}`);

    editTextElement.style.display = "inline";
    editDueDateElement.style.display = "inline";

    editTextElement.parentElement.onclick = function (event) {
        event.stopPropagation();
    };

    editTextElement.onclick = function () {
        saveChanges(index);
    };
}
