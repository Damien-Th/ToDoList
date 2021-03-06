let todos, actualToDo;
// the container for the task.
const newTask = document.getElementById('taskContainer');

// Display The Current Date//
let now = new Date();
document.getElementById('current_date').innerHTML = now.toLocaleDateString();

//refresh the page
window.addEventListener("load", () => {

    //Read the data in the local Storage
    actualToDo = localStorage.getItem('todos');

    //Tcheck if localStorage is empty if yes set an array if no read the key
    actualToDo == undefined ? todos = [] : todos = JSON.parse(localStorage["todos"]);

    updateNbOfTask()

    //Display all the task from the localStorage.
    if (localStorage.key(todos) === "todos") {
        for (let i = 0; i < todos.length; i++) {
            newTask.insertAdjacentHTML('beforeend', todos[i]);
        }
    }
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

        updateNbOfTask()

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
        updateNbOfTask()
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
    }

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
    
};

//Count the number of task
function updateNbOfTask() {
    let totalTask = todos.length;
    let nbOfTask = document.getElementById('task')
    totalTask === 0 ? nbOfTask.innerHTML = 'No Task' : nbOfTask.innerHTML = totalTask + ' Tasks';
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
