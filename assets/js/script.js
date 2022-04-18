var taskIdCounter = 0;
var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");

var taskFormHandler = function(event){
    event.preventDefault(); //stops browser from reloading page upon form submission

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

    //add task id as a custom attribute
    //add data-task-id attribute with taskIdCounter value
    listItemEl.setAttribute("data-task-id", taskIdCounter); 


    //create div to hold task info and  add to list item
    var taskInfoEl = document.createElement("div");
    //give it a class name
    taskInfoEl.className = "task-info";
    //use HTML to bold task-name and add task type below it in div
    taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";

    listItemEl.appendChild(taskInfoEl); // add the taskInfoEl div to the <li>

    var taskActionsEl = createTaskActions(taskIdCounter); // store createTaskActions(taskIdCounter) so it'll ad one by one

    listItemEl.appendChild(taskActionsEl); //add buttons to list

    tasksToDoEl.appendChild(listItemEl); //add entire list item to Tasks To Do

    taskIdCounter++; //increase task counter for next unique id
};


var createTaskActions = function(taskId){
    var actionContainerEl = document.createElement("div"); // create div element
    actionContainerEl.className="task-actions"; // add it to class name task-actions

    //create edit button
    var editButtonEl = document.createElement("button");
    editButtonEl.textContent="Edit";
    editButtonEl.className = "btn edit-btn";
    editButtonEl.setAttribute("data-task-id", taskId); //data-task-id = createTaskActions(data-task-id)

    actionContainerEl.appendChild(editButtonEl);// add this to div

    // create delete button
    var deleteButtonEl = document.createElement("button");
    deleteButtonEl.textContent = "Delete";
    deleteButtonEl.className = "btn delete-btn";
    deleteButtonEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(deleteButtonEl); //add this to div

    var statusSelectEl = document.createElement("select");
    statusSelectEl.className = "select-status"; //select class = select-status
    statusSelectEl.setAttribute("name", "status-change"); // select name = status-change
    statusSelectEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(statusSelectEl); //add this to div

    var statusChoices = ["To Do", "In Progress", "Completed"];

    for (var i = 0; i < statusChoices.length; i++) {
        //create option element
        var statusOptionEl = document.createElement("option");
        statusOptionEl.textContent = statusChoices[i];
        statusOptionEl.setAttribute("value", statusChoices[i]); // option value =  statusChoices[i]

        statusSelectEl.appendChild(statusOptionEl); //add to statusSelectEl
    }

    return actionContainerEl;
}

formEl.addEventListener("submit", taskFormHandler);