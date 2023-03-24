window.onload = function(){
    console.log("AppStarted");
    startApp.init();
}

class Task {
    constructor(task, deadline) {
        this.task = task;
        this.deadline = deadline;
        this.id = Date.now(); //timestamp - unical id
    }
}

class Item {
    constructor(item, amount, shop) {
        this.item = item;
        this.amount = amount;
        this.shop = shop;
        this.id = Date.now(); //timestamp - unical id
    }
}


class TaskList {
    constructor () {
        this.tasks = [];
    }

    loadData() {
        const data = storage.getTasks();
        if (data == null || data == undefined) return;

        this.tasks = data;

        data.forEach((value, index) => 
            taskUi.addTask(value));
    }

    saveButton(e) {
        e.preventDefault();

        const taskText = document.getElementById("taskName").value;
        let deadline = document.getElementById("deadline").value;

        deadline === "" ?  deadline = "------" : deadline;
            

        console.log(taskText);
        console.log(e);
 
    if (taskText === "") return
     const task = new Task (taskText, deadline)
    this.addTask(task)
    }

    removeTaskById(taskId){
        this.tasks.forEach((el, index) => {
          if (el.id == taskId) this.tasks.splice(index, 1);  
        })
        this.saveTask();
    }

    moveTaskUp(taskId){
        let arr = this.tasks;
        for(let i=0; i < arr.length; i++){
            let el = arr[i];

            if(el.id == taskId) {
                if(i >=1) {
                    let temp = arr[i-1];
                    arr[i-1]=arr[i];
                    arr[i] = temp;
                    break;
                }
            }
        };

        this.saveTask();
        taskUi.deleteAll();
        this.loadData();
    }

    moveTaskDown(taskId){
        let arr = this.tasks;
        for(let i=0; i < arr.length; i++){
            let el = arr[i];

            if(el.id == taskId) {
                if(i < arr.length - 1) {
                    let temp = arr[i+1];
                    arr[i+1]=arr[i];
                    arr[i] = temp;
                    break;
                }
            }
        };

        this.saveTask();
        taskUi.deleteAll();
        this.loadData();
    }

    addTask(task){
        this.tasks.push(task);
        taskUi.addTask(task);
        this.saveTask();
    }

    saveTask(){
        storage.saveTasks(this.tasks);
    }
}

const taskList = new TaskList;

class TaskUi {

    clearForm(){
        document.getElementById("taskName").value = "";
        document.getElementById("deadline").value = "";
    }

    deleteTask(e){
        const taskId = e.target.getAttribute("task-id");
        e.target.parentElement.parentElement.remove();
        taskList.removeTaskById(taskId);
    }

    deleteAll(){
        const allTasks = document.querySelectorAll(".single-task");
        allTasks.forEach((el) => el.remove());
    }

    moveTaskUp(e){
        let taskId = e.target.getAttribute("task-id");
        taskList.moveTaskUp(taskId);
        
    }

    moveTaskDown(e){
        let taskId = e.target.getAttribute("task-id");
        taskList.moveTaskDown(taskId);
    }

    addTask(task){
        const taskList = document.getElementById("task-list");
        const singleTask = document.createElement("div");

        singleTask.classList.add("single-task")
        singleTask.innerHTML = `
        <p>${task.task}</p>
        <p>${task.deadline}</p>
        <div class="single-task-btn">
            <button task-id="${task.id}" class="btn del">DEL</button>
            <button task-id="${task.id}" class="btn up">▲</button>
            <button task-id="${task.id}" class="btn down">▼</button>
        </div>
        `;
        taskList.appendChild(singleTask);

        this.clearForm();

        let deleteBtn = document.querySelector(`button.del[task-id="${task.id}"]`);
        deleteBtn.addEventListener("click", (e)=>this.deleteTask(e));
        let moveUp = document.querySelector(`button.up[task-id="${task.id}"]`)
        moveUp.addEventListener("click", (e)=>this.moveTaskUp(e));
        let moveDown = document.querySelector(`button.down[task-id="${task.id}"]`)
        moveDown.addEventListener("click", (e)=>this.moveTaskDown(e));
    }

 

}

const taskUi = new TaskUi;


class ShoppingCard {
    constructor () {
        this.items = [];
    }

    loadData() {
        const data = storage.getItems();
        if (data == null || data == undefined) return;

        this.items = data;

        data.forEach((value, index) => 
            shoppingUi.addItem(value));
    }

    saveButton(e) {
        e.preventDefault();

        const itemName = document.getElementById("itemName").value;
        let amount = document.getElementById("amount").value;
        let shopName = document.getElementById("shopName").value;
        let shopNameSelected = document.getElementById("shopName-select").value;
        console.log(shopNameSelected)

        amount === "" ?  amount = "-" : amount;
        shopName === "" ?  shopName = shopNameSelected : shopName;
            
 
    if (itemName === "") return
        const item = new Item (itemName, amount, shopName);
        this.addItem(item);
    }

    removeitemById(itemId){
        this.items.forEach((el, index) => {
          if (el.id == itemId) this.items.splice(index, 1);  
        })
        this.saveItem();
    }

    addItem(item){
        this.items.push(item);
        shoppingUi.addItem(item);
        this.saveItem();
    }

    saveItem(){
        storage.saveItems(this.items);
    }
}

const shoppingCard = new ShoppingCard;

class ShoppingUi {

    clearForm(){
        document.getElementById("itemName").value = "";
        document.getElementById("amount").value = "";
        document.getElementById("shopName").value = "";
    }

    deleteItem(e){
        const itemId = e.target.getAttribute("item-id");
        e.target.parentElement.remove();
        shoppingCard.removeitemById(itemId);
    }

    deleteAll(){
        const allItems = document.querySelectorAll(".single-item");
        allItems.forEach((el) => el.remove());
    }

    addItem(item){
        const itemList = document.getElementById("items-list");
        const singleItem = document.createElement("div");

        singleItem.classList.add("single-item")
        singleItem.innerHTML = `
        <p>${item.item}</p>
        <p>${item.amount}</p>
        <p>${item.shop}</p>
        <button item-id="${item.id}" class="btn del">DEL</button>
        `;
        itemList.appendChild(singleItem);

        this.clearForm();

        let deleteBtn = document.querySelector(`button.del[item-id="${item.id}"]`);
        deleteBtn.addEventListener("click", (e)=>this.deleteItem(e));
    }

    // currentShopsList(){
    //     let shops = [];

    // }

}

const shoppingUi = new ShoppingUi;




class StartApp {

    taskCardBtn = document.getElementById("task-card-btn");
    shoppingCardBtn = document.getElementById("shopping-card-btn");
    toDoCard = document.getElementById("to-do-card");
    shoppingCard = document.getElementById("shopping-card");
    newEntryTask = document.getElementById("new-entry-task");
    newEntryShopping = document.getElementById("new-entry-shopping");

    saveButtonTask = document.getElementById("saveButtonTask");
    closeButtonTask = document.getElementById("closeButtonTask");
    saveButtonShoping = document.getElementById("saveButtonShoping");
    closeButtonShopping = document.getElementById("closeButtonShopping");


    init() {
        taskList.loadData();
        shoppingCard.loadData();

        this.taskCardBtn.addEventListener("click", (e) => this.changeCard(e));
        this.shoppingCardBtn.addEventListener("click", (e) => this.changeCard(e));
        this.saveButtonTask.addEventListener("click", (e) => taskList.saveButton(e));
        this.saveButtonShoping.addEventListener("click", (e) => shoppingCard.saveButton(e));
        

        document.getElementById("new-entry-to-do-btn").addEventListener("click", (e) => this.newEntryCard(e));
        document.getElementById("new-entry-shopping-btn").addEventListener("click", (e) => this.newEntryCard(e));
        this.closeButtonTask.addEventListener("click", (e) => this.newEntryCard(e));
        this.closeButtonShopping.addEventListener("click", (e) => this.newEntryCard(e));


    
    }
    changeCard(e){
        if (e.target.id === "task-card-btn") {
            this.toDoCard.classList.remove("hidden");
            this.shoppingCard.classList.add("hidden");
            this.taskCardBtn.classList.remove("nav-border");
            this.shoppingCardBtn.classList.add("nav-border");
        }
        if (e.target.id === "shopping-card-btn") {
            this.shoppingCard.classList.remove("hidden");
            this.toDoCard.classList.add("hidden");
            this.shoppingCardBtn.classList.remove("nav-border");
            this.taskCardBtn.classList.add("nav-border");
        }
    }

    newEntryCard(e){
        e.preventDefault();
        console.log(e);
        if (e.target.id === "new-entry-to-do-btn") {
            this.newEntryTask.classList.remove("hidden");
        }
        if (e.target.id === "new-entry-shopping-btn") {
            this.newEntryShopping.classList.remove("hidden");
        }
        if (e.target.id === "closeButtonTask") {
            this.newEntryTask.classList.add("hidden");
        }
        if (e.target.id === "closeButtonShopping") {
            this.newEntryShopping.classList.add("hidden");
        }
    }
}

const startApp = new StartApp;

class Storage {

    getTasks() {
        let tasks = null;

        if(localStorage.getItem("tasks")!==null) {
            tasks = JSON.parse(localStorage.getItem("tasks"))
        } else {
            tasks = [];
        }
        return tasks;

    }

    saveTasks(tasks) {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    getItems() {
        let items = null;

        if(localStorage.getItem("items")!==null) {
            items = JSON.parse(localStorage.getItem("items"))
        } else {
            items = [];
        }
        return items;

    }

    saveItems(items) {
        localStorage.setItem("items", JSON.stringify(items));
    }
}

const storage = new Storage();
