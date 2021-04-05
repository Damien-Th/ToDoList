let todos, actualToDo;
// the container for the task.
const newTask = document.getElementById('taskContainer');

// Display The Current Date//
let now = new Date();
document.getElementById('current_date').innerHTML = now.toLocaleDateString();

//refresh the page
window.addEventListener("load", () => {

    checkDone = localStorage.getItem('howManyDone');
    checkDone == undefined ? document.getElementById("task-filter").value = "all" : document.getElementById("task-filter").value = localStorage.getItem("howManyDone");

    //Read the data in the local Storage
    actualToDo = localStorage.getItem('todos');
    //Tcheck if localStorage is empty if yes set an array if no read the key
    actualToDo == undefined ? todos = [] : todos = JSON.parse(localStorage["todos"]);

    //Display all the task from the localStorage.
    if (localStorage.key(todos) === "todos") {
        for (let i = 0; i < todos.length; i++) {
            newTask.insertAdjacentHTML('beforeend', todos[i]);
        }
    }
    filter()
});

//Adding New Task
let displayNewTask = () => {
    //Read the input value
    const inputTask = document.getElementById('newTask').value;

    if (inputTask.length >= 2) {
        //Display the New Task
        let contenu, newContenu;
        contenu = '<div class="theTask"><img src="icons/blackcheck.svg" class="valid-icon" alt="valided" /><div class="task">%matache%</div><img src="icons/rubbish.svg" class="delete-icon" alt="rubbish"/></div>';
        newContenu = contenu.replace('%matache%', inputTask);
        newTask.insertAdjacentHTML('beforeend', newContenu);

        //put the new task into the array todos
        todos.push(newContenu);
        localStorage["todos"] = JSON.stringify(todos);

        //clean the input
        document.getElementById('newTask').value = null;

        filter()

    } else {
        customBox.innerHTML = '<p>Minimum 2 characters</p>';
        modalShow();
    }

}

// listen on Rubbish button
const deleteOrtcheck = document.querySelector('.taskToDo');
deleteOrtcheck.addEventListener('click', deleteOrCheckTask);

//removed the task from html and the storage
function deleteOrCheckTask(e) {
    const className = 'delete-icon';
    const classNameValid = 'valid-icon';
    let element = e.target;
    const item = element.className;
    let StoreTask = e.target.parentElement;
    const attribute = StoreTask.getAttribute("attribute");
    //Get child node index
    let index = Array.prototype.indexOf.call(StoreTask.parentElement.children, StoreTask);

    //remove the task when is checked
    if (item == className && attribute) {
        todos.splice(index, 1);
        StoreTask.remove();
        //update the new array in the localstorage
        localStorage["todos"] = JSON.stringify(todos);

    } else if (item == className) {
        customBox.innerHTML = '<p>Not Done Yet !</p>';
        modalShow();
    }

    //change the icon from checked or not
    if (item == classNameValid) {
        let icon = element.getAttribute("src");
        StoreTask.childNodes[1].classList.toggle("taskDone");

        if (icon == "icons/blackcheck.svg") {
            icon = "icons/greencheck.svg";
            element.setAttribute("src", icon);
            StoreTask.setAttribute("attribute", "complete");
            todos.splice(index, 1, StoreTask.outerHTML);

        } else if (icon == "icons/greencheck.svg") {
            icon = "icons/blackcheck.svg";
            element.setAttribute("src", icon);
            StoreTask.removeAttribute("attribute", "complete");
            todos.splice(index, 1, StoreTask.outerHTML);
        }
        localStorage["todos"] = JSON.stringify(todos);
    }

    //Edit The Task
    let classTask = 'task';
    let taskValue, newTaskValue;
    if (item === classTask) {
        element.setAttribute("contenteditable", "true")
        element.focus();
        taskValue = element.textContent;

        element.addEventListener('focusout', () => {
            newTaskValue = element.textContent;
            element.removeAttribute("contenteditable", "true");
            if (newTaskValue.length >= 2) {
                todos.splice(index, 1, StoreTask.outerHTML);
                localStorage["todos"] = JSON.stringify(todos);
            } else {
                element.textContent = taskValue;
                customBox.innerHTML = '<p>Minimum 2 characters</p>';
                modalShow();
            }
        });
    }
    filter()
};

//Custom Alert Box
let modalContainer = document.createElement('div');
modalContainer.setAttribute('id', 'modal');
let customBox = document.createElement('div');
customBox.className = 'custom-box';

function modalShow() {
    customBox.innerHTML += '<button id="modal-close">OK</button>';
    modalContainer.appendChild(customBox);
    document.body.appendChild(modalContainer);

    document.getElementById('modal-close').addEventListener('click', () => {
        document.body.removeChild(modalContainer);
    });
}

function filter() {

    let howManyDone = document.getElementById("task-filter").value;

    localStorage.setItem("howManyDone", howManyDone);
    let task = document.querySelectorAll('.taskDone');

    let finished = task.length;
    let totalTask = todos.length;

    document.getElementsByName('filter')[0].options[0].innerHTML = "All " + "(" + totalTask + ")";
    document.getElementsByName('filter')[0].options[1].innerHTML = "Unfinished " + "(" + (totalTask - finished) + ")";
    document.getElementsByName('filter')[0].options[2].innerHTML = "Finished " + "(" + finished + ")";

    let taskDark = document.querySelectorAll('.task');
    for (let i = 0; i < taskDark.length; i++) {
        let finished = taskDark[i].parentNode
        let finishedTask = finished.childNodes[0];
        let icon = "icons/blackcheck.svg";
        let GreenIcon = "icons/greencheck.svg";
        if (finished.getElementsByClassName("hide")) finished.classList.remove('hide');
        if (howManyDone === "finished" && finishedTask.getAttribute("src") === icon) finished.classList.add('hide');
        if (howManyDone === "unfinished" && finishedTask.getAttribute("src") === GreenIcon) finished.classList.add('hide');
    }

}