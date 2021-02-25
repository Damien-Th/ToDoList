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
        todos.push([newContenu]);
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
    const item = e.target.className;
    const attribute = e.target.parentElement.getAttribute("attribute");

    //remove the task when is checked
    if (item == className && attribute) {
        let StoreTask = e.target.parentElement;
        todos.splice(StoreTask, 1);

        //update the new array in the localstorage
        localStorage["todos"] = JSON.stringify(todos);

        StoreTask.remove();

        updateNbOfTask()

    } else if (item == className) {
        customBox.innerHTML = '<p>Not Done Yet !</p>';
        modalShow();
    }

    //change the icon from checked or not
    if (item == classNameValid) {
        let element = e.target;
        let icon = element.getAttribute("src");
        let taskChild = e.target.parentElement.childNodes[1];
        taskChild.classList.toggle("taskDone");

        if (icon == "icons/blackcheck.svg") {
            icon = "icons/greencheck.svg";
            element.setAttribute("src", icon);
            e.target.parentElement.setAttribute("attribute", "complete");
        } else {
            icon = "icons/blackcheck.svg";
            element.setAttribute("src", icon);
            e.target.parentElement.removeAttribute("attribute", "complete");
        }
    }

}

//Count the number of task
function updateNbOfTask() {
    let totalTask = todos.length;
    let nbOfTask = document.getElementById('task')
    totalTask === 0 ? nbOfTask.innerHTML = 'No Task' : nbOfTask.innerHTML = totalTask + ' Tasks';
};

/********* Boîtes personnalisées *********/
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
