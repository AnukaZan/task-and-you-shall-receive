var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");

var taskFormHandler = function(event){
    event.preventDefault(); //cancels event if its cancellable

    var taskNameInput = document.querySelector("input[name='task-name']").value;
    var taskTypeInput = document.querySelector("select[name='task-type']").value;

    // if taskNameInput is empty/false OR taskTypeInput is empty/false
    if (!taskNameInput || !taskTypeInput){
        alert("You need to fill out the task form!");
        return false;
    }
    
    var taskDataObj = {
        name: taskNameInput,
        type: taskTypeInput
    };

    formEl.reset();

    createTaskEl(taskDataObj);
};

var createTaskEl = function(taskDataObj){
    //create list item
    var listItemEl = document.createElement("li");
    listItemEl.className = "task-item";

    //create div to hold task info and  add to list item
    var taskInfoEl = document.createElement("div");
    //give it a class name
    taskInfoEl.className = "task-info";
    //use HTML to bold task-name and add task type below it in div
    taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";

    listItemEl.appendChild(taskInfoEl); // add the taskInfoEl div to the <li>

    tasksToDoEl.appendChild(listItemEl); //add entire list item to tasksToDoEl
}

formEl.addEventListener("submit", taskFormHandler);