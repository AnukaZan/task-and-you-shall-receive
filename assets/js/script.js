var taskIdCounter = 0;
var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");
var pageContentEl = document.querySelector('#page-content');

var tasksInProgressEl = document.querySelector("#tasks-in-progress");
var tasksCompletedEl = document.querySelector("#tasks-completed");

var tasks = [];


var editTask = function(taskId){
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    
    var taskName = taskSelected.querySelector("h3.task-name").textContent; //only search taskSelected

    var taskType = taskSelected.querySelector("span.task-type").textContent;

    document.querySelector("input[name='task-name']").value = taskName;
    document.querySelector("select[name='task-type']").value = taskType;

    document.querySelector("#save-task").textContent = "Save Task";
    formEl.setAttribute("data-task-id", taskId); //add taskId to data-task-id 
    //if click event is on an edit btn, put that task info in tab 
}

var completeEditTask = function(taskName, taskType, taskId){//initiated when they already have id
    // find matching task list item
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    //set new values
    taskSelected.querySelector("h3.task-name").textContent = taskName;
    taskSelected.querySelector("span.task-type").textContent = taskType;

    //loop through tasks array and task object with new content
    //basically make sure that when you edit the site, it edits the array too
    for (var i = 0; i < tasks.length; i++){
        if (tasks[i].id === parseInt(taskId)){ //does id match taskId passed into completeEditTask
            tasks[i].name = taskName; //if so, update array name with updated name
            tasks[i].type = taskType; // if so, update array type with updated type
        }
    };

    saveTasks();

    alert("Task Updated!");
    // when submit, update that existing task
    formEl.removeAttribute("data-task-id");
    document.querySelector("#save-task").textContent = "Add Task"; //change button back to add
};


var deleteTask = function(taskId){
    //find .task-item with data-task-id equal to argument
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    taskSelected.remove(); //delete task with same data-task-id as where was clicked

    var updatedTaskArr = [];

    // every task that we don't want to delete is being pushed into new array
    for (var i = 0; i<tasks.length; i++){ 
        if (tasks[i].id !== parseInt(taskId)){ 
            updatedTaskArr.push(tasks[i]); 
        }
    }

    tasks = updatedTaskArr; //reassign tasks array to be same as updatedTaskArr

    saveTasks();
};


var taskFormHandler = function(event){
    event.preventDefault(); //stops browser from reloading page upon form submission

    var taskNameInput = document.querySelector("input[name='task-name']").value;
    var taskTypeInput = document.querySelector("select[name='task-type']").value;

    // if taskNameInput is empty/false OR taskTypeInput is empty/false
    if (!taskNameInput || !taskTypeInput){
        alert("You need to fill out the task form!");
        return false;
    }

    var isEdit = formEl.hasAttribute("data-task-id");

    //has data attribute, so get task id and call function to complete edit process
    if (isEdit){
        var taskId = formEl.getAttribute("data-task-id");
        completeEditTask(taskNameInput, taskTypeInput, taskId);
    }

    //no data attribute, so create object as normal and pass to createTaskEl function
    else{
        var taskDataObj = {
            name: taskNameInput,
            type: taskTypeInput,
            status: "to do"
        };

        createTaskEl(taskDataObj);
    }

    formEl.reset();

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

    taskDataObj.id = taskIdCounter; //id = taskIdCounter

    tasks.push(taskDataObj); //push this id data to array

    saveTasks();

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


var taskButtonHandler = function(event){
    var targetEl = event.target;

    if (targetEl.matches(".edit-btn")){
        var taskId = targetEl.getAttribute("data-task-id");
        editTask(taskId);
    }

    if (targetEl.matches(".delete-btn")){ //if element selected matches .delete-btn
        // get element task id
        var taskId = targetEl.getAttribute("data-task-id");
        deleteTask(taskId);
    }
};


pageContentEl.addEventListener("click", taskButtonHandler);

var taskStatusChangeHandler = function(event){
    var taskId = event.target.getAttribute("data-task-id"); //get changed task item's id

    var statusValue = event.target.value.toLowerCase(); //get current selected option's value and convert to lowercase

    //find parent task item element based on id
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    if (statusValue === "to do"){
        tasksToDoEl.appendChild(taskSelected);
    }

    else if(statusValue === "in progress"){
        tasksInProgressEl.appendChild(taskSelected); // move to in progress
    }

    else if(statusValue === "completed"){
        tasksCompletedEl.appendChild(taskSelected);
    }

    //update tasks in tasks array
    for (var i = 0; i < tasks.length; i++){
        if (tasks[i].id === parseInt(taskId)){
            tasks[i].status = statusValue;
        }
    }
    
    saveTasks();
};

var saveTasks = function(){
    localStorage.setItem("tasks", JSON.stringify(tasks)); //save tasks array to local storage
}

var loadTasks = function(){
    var savedTasks = localStorage.getItem("tasks");
    
    if (!savedTasks){
        return false;
    }

    savedTasks = JSON.parse(savedTasks);

    for (var i = 0; i < savedTasks.length; i++){
        createTaskEl(savedTasks[i]);
    }
}

pageContentEl.addEventListener("change", taskStatusChangeHandler);

loadTasks();