window.onload = function () {
    startApp.init();
};

class BaseUi {
    constructor() {
        this.eventListeners = [];
    }

    addEventListener(selector, event, callback) {
        const element = document.querySelector(selector);
        element.addEventListener(event, callback);
        this.eventListeners.push({ element, event, callback });
    }

    removeAllEventListeners() {
        this.eventListeners.forEach(({ element, event, callback }) => {
            element.removeEventListener(event, callback);
        });
        this.eventListeners = [];
    }
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
    constructor() {
        this.tasks = [];
    }
    newEntry = document.getElementById("new-entry-task");
    newBtn = document
        .getElementById("new-entry-to-do-btn")
        .addEventListener("click", (e) => this.newEntryCard(e));
    saveBtn = document
        .getElementById("saveButtonTask")
        .addEventListener("click", (e) => this.saveButton(e));
    closeBtn = document
        .getElementById("closeButtonTask")
        .addEventListener("click", (e) => this.newEntryCard(e));

    loadData() {
        const data = storage.getTasks();
        if (data === null || data === undefined) return;
        this.tasks = data;
        data.forEach((value) => taskUi.addTask(value));
    }

    saveButton(e) {
        e.preventDefault();
        const taskText = document.getElementById("taskName").value;
        let deadline = document.getElementById("deadline").value;
        deadline === "" ? (deadline = "------") : deadline;
        if (taskText === "") return;
        const task = new Task(taskText, deadline);
        this.addTask(task);
    }

    removeTaskById(taskId) {
        this.tasks.forEach((el, index) => {
            if (el.id == taskId) this.tasks.splice(index, 1);
        });
        this.saveTask();
    }
    moveTaskUp(taskId) {
        const arr = this.tasks;
        for (let i = 0; i < arr.length; i++) {
            const el = arr[i];
            if (el.id == taskId && i >= 1) {
                const temp = arr[i - 1];
                arr[i - 1] = arr[i];
                arr[i] = temp;
                break;
            }
        }
        this.saveTask();
        taskUi.deleteAll();
        this.loadData();
    }

    moveTaskDown(taskId) {
        const arr = this.tasks;
        for (let i = 0; i < arr.length; i++) {
            let el = arr[i];
            if (el.id == taskId && i < arr.length - 1) {
                const temp = arr[i + 1];
                arr[i + 1] = arr[i];
                arr[i] = temp;
                break;
            }
        }
        this.saveTask();
        taskUi.deleteAll();
        this.loadData();
    }

    addTask(task) {
        this.tasks.push(task);
        taskUi.addTask(task);
        this.saveTask();
    }

    newEntryCard(e) {
        e.preventDefault();
        if (e.target.id === "new-entry-to-do-btn") {
            this.newEntry.classList.remove("hidden");
        }
        if (e.target.id === "closeButtonTask") {
            this.newEntry.classList.add("hidden");
        }
    }
    saveTask() {
        storage.saveTasks(this.tasks);
    }
}
const taskList = new TaskList();

class TaskUi extends BaseUi {
    constructor() {
        super();
        this.addEventListener("#task-list", "click", (e) =>
            this.handleTaskListClick(e)
        );
    }

    handleTaskListClick(e) {
        const taskId = e.target.getAttribute("task-id");
        const target = e.target;
        if (e.target.classList.contains("del")) {
            this.deleteTask(taskId, target);
        } else if (e.target.classList.contains("up")) {
            this.moveTaskUp(taskId);
        } else if (e.target.classList.contains("down")) {
            this.moveTaskDown(taskId);
        }
    }

    clearForm() {
        document.getElementById("taskName").value = "";
        document.getElementById("deadline").value = "";
    }

    deleteTask(taskId, target) {
        target.parentElement.parentElement.remove();
        taskList.removeTaskById(taskId);
    }

    deleteAll() {
        const allTasks = document.querySelectorAll(".single-task");
        allTasks.forEach((el) => el.remove());
    }

    moveTaskUp(taskId) {
        taskList.moveTaskUp(taskId);
    }

    moveTaskDown(taskId) {
        taskList.moveTaskDown(taskId);
    }

    addTask(task) {
        const taskList = document.getElementById("task-list");
        const singleTask = document.createElement("div");
        singleTask.classList.add("single-task");
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
    }
}
const taskUi = new TaskUi();

class ShoppingCard {
    constructor() {
        this.items = [];
    }

    newEntry = document.getElementById("new-entry-shopping");
    newBtn = document
        .getElementById("new-entry-shopping-btn")
        .addEventListener("click", (e) => this.newEntryCard(e));
    saveBtn = document
        .getElementById("saveButtonShoping")
        .addEventListener("click", (e) => this.saveButton(e));
    closeBtn = document
        .getElementById("closeButtonShopping")
        .addEventListener("click", (e) => this.newEntryCard(e));

    loadData() {
        const data = storage.getItems();
        if (data == null || data == undefined) return;
        this.items = data;
        data.forEach((value) => {
            shoppingUi.addItem(value);
            shoppingUi.addShop(value);
        });
    }

    saveButton(e) {
        e.preventDefault();

        const itemName = document.getElementById("itemName").value;
        let amount = document.getElementById("amount").value;
        let shopName = document.getElementById("shopName").value;
        const shopNameSelected =
            document.getElementById("shopName-select").value;
        amount === "" ? (amount = "-") : amount;
        shopName === "" ? (shopName = shopNameSelected) : shopName;
        if (itemName === "") return;
        const item = new Item(itemName, amount, shopName);
        this.addItem(item);
    }

    removeitemById(itemId) {
        this.items.forEach((el, index) => {
            if (el.id == itemId) this.items.splice(index, 1);
        });
        this.saveItem();
    }

    addItem(item) {
        this.items.push(item);
        shoppingUi.addItem(item);
        this.saveItem();
        shoppingUi.addShop(item);
    }

    newEntryCard(e) {
        e.preventDefault();
        if (e.target.id === "new-entry-shopping-btn") {
            this.newEntry.classList.remove("hidden");
        }
        if (e.target.id === "closeButtonShopping") {
            this.newEntry.classList.add("hidden");
        }
    }

    saveItem() {
        storage.saveItems(this.items);
    }
}

const shoppingCard = new ShoppingCard();

class ShoppingUi extends BaseUi {
    constructor() {
        super();
        this.addEventListener("#items-list, #shopFilterBtn", "click", (e) =>
            this.handleItemsListClick(e)
        );
    }

    handleItemsListClick(e) {
        const itemId = e.target.getAttribute("item-id");
        const target = e.target;
        if (target.classList.contains("del")) {
            this.deleteItem(itemId, target);
        } else if (target.parentElement.id == "shopFilterBtn") {
            this.shopFilterCard.classList.remove("hidden");
            moveWindow.dragElement(this.shopFilterCard);
        }
    }

    shopFilterCard = document.getElementById("shop-filter");

    setBtn = document
        .getElementById("setFilterBtn")
        .addEventListener("click", (e) => this.setShopFilter(e));
    resetBtn = document
        .getElementById("resetFilterBtn")
        .addEventListener("click", (e) => this.resetShopFilter(e));
    closeBtn = document
        .getElementById("closeFilterBtn")
        .addEventListener("click", () =>
            this.shopFilterCard.classList.add("hidden")
        );

    clearForm() {
        document.getElementById("itemName").value = "";
        document.getElementById("amount").value = "";
        document.getElementById("shopName").value = "";
    }

    deleteItem(itemId, target) {
        target.parentElement.remove();
        shoppingCard.removeitemById(itemId);
        this.removeShop();
    }

    deleteAll() {
        const allItems = document.querySelectorAll(".single-item");
        allItems.forEach((el) => el.remove());
    }

    addItem(item) {
        const itemList = document.getElementById("items-list");
        const singleItem = document.createElement("div");

        singleItem.classList.add("single-item");
        singleItem.innerHTML = `
        <p>${item.item}</p>
        <p>${item.amount}</p>
        <p>${item.shop}</p>
        <button item-id="${item.id}" class="btn del">DEL</button>
        `;
        itemList.appendChild(singleItem);
        this.clearForm();
    }

    addShop(item) {
        const shopFilter = document.getElementById("shop-list");
        const singleShop = document.createElement("div");
        let shopFlag = true;
        singleShop.id = `shop-${item.shop}`;

        for (let i = 0; i < shopFilter.children.length; i++) {
            if (singleShop.id === shopFilter.children[i].id) shopFlag = false;
        }

        if (shopFlag) {
            singleShop.innerHTML = `
            <input type="checkbox" id="${item.shop}" name="${item.shop}">
            <label for="${item.shop}">${item.shop}</label>
            `;
            shopFilter.appendChild(singleShop);
        }
    }
    removeShop() {
        let shopsInFilterCard = Array.from(
            document.getElementById("shop-list").children
        );
        shopsInFilterCard.forEach((el) => el.remove());
        shoppingCard.items.forEach((value) => {
            this.addShop(value);
        });
    }
    setShopFilter(e) {
        const data = shoppingCard.items;
        const shopList = document.querySelectorAll("#shop-list input");
        this.deleteAll();
        for (let i = 0; i < shopList.length; i++) {
            if (shopList[i].checked) {
                data.forEach((value) => {
                    if (value.shop === shopList[i].id) {
                        this.addItem(value);
                        this.addShop(value);
                    }
                });
            }
        }
    }
    resetShopFilter(e) {
        this.deleteAll();
        shoppingCard.loadData();
    }
}
const shoppingUi = new ShoppingUi();

class StartApp {
    navMenu = document.getElementById("nav-menu");
    toDoCard = document.getElementById("to-do-card");
    shoppingCard = document.getElementById("shopping-card");
    selectLanguageBtn = document.getElementById("language");

    init() {
        taskList.loadData();
        shoppingCard.loadData();
        this.selectLanguageBtn.addEventListener("click", (e) =>
            language.selectLanguage(e)
        );
        this.navMenu.addEventListener("click", (e) => this.changeCard(e));
    }
    changeCard(e) {
        const taskCardBtn = document.getElementById("task-card-btn");
        const shoppingCardBtn = document.getElementById("shopping-card-btn");
        if (e.target.id === "task-card-btn") {
            this.toDoCard.classList.remove("hidden");
            this.shoppingCard.classList.add("hidden");
            taskCardBtn.classList.remove("nav-border");
            shoppingCardBtn.classList.add("nav-border");
        }
        if (e.target.id === "shopping-card-btn") {
            this.shoppingCard.classList.remove("hidden");
            this.toDoCard.classList.add("hidden");
            shoppingCardBtn.classList.remove("nav-border");
            taskCardBtn.classList.add("nav-border");
        }
    }
}
const startApp = new StartApp();

class Storage {
    getTasks() {
        const tasks =
            localStorage.getItem("tasks") !== null
                ? JSON.parse(localStorage.getItem("tasks"))
                : [];

        return tasks;
    }
    saveTasks(tasks) {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    getItems() {
        const items =
            localStorage.getItem("items") !== null
                ? JSON.parse(localStorage.getItem("items"))
                : [];
        return items;
    }
    saveItems(items) {
        localStorage.setItem("items", JSON.stringify(items));
    }
}

const storage = new Storage();

class Language {
    actions = {
        EN: "en-lang-btn",
        PL: "pl-lang-btn",
    };
    translations = {
        en: {
            TO_DO: "TO DO",
            SHOPPING_LIST: "SHOPPING LIST",
            New_entry: "New entry",
            Task: "Task",
            Deadline: "Deadline",
            Save: "Save",
            Close: "Close",
            TASK: "TASK",
            DEADLINE: "DEADLINE",
            EDIT: "EDIT",
            Choose_shops: "Choose shops",
            Apply: "Apply",
            Reset: "Reset",
            Item: "Item",
            Amount: "Amount",
            Shop: "Shop",
            ITEM: "ITEM",
            AMOUNT: "AMOUNT",
            SHOP: "SHOP",
            DEL: "DEL",
        },
        pl: {
            TO_DO: "LISTA ZADAŃ",
            SHOPPING_LIST: "LISTA ZAKUPÓW",
            New_entry: "Nowy wpis",
            Task: "Zadanie",
            Deadline: "Termin",
            Save: "Zapisz",
            Close: "Zamknij",
            TASK: "ZADANIE",
            DEADLINE: "TERMIN",
            EDIT: "EDYCJA",
            Choose_shops: "Wybierz sklepy",
            Apply: "Zastosuj",
            Reset: "Reset",
            Item: "Przedmiot",
            Amount: "Ilość",
            Shop: "Sklep",
            ITEM: "PRZEDMIOT",
            AMOUNT: "ILOŚĆ",
            SHOP: "SKLEP",
            DEL: "USUŃ",
        },
    };

    selectLanguage(e) {
        const lang =
            this.translations[e.target.id === this.actions.EN ? "en" : "pl"];

        document.querySelectorAll("[cont]").forEach((element) => {
            const content = element.getAttribute("cont");
            element.textContent = lang[content] || content;
        });
    }
}
const language = new Language();

class MoveWindow {
    dragElement(elmnt) {
        let pos1 = 0;
        let pos2 = 0;
        let pos3 = 0;
        let pos4 = 0;
        if (document.getElementById(elmnt.id + "-header")) {
            document.getElementById(elmnt.id + "-header").onmousedown =
                dragMouseDown;
            document.getElementById(elmnt.id + "-header").ontouchstart =
                dragTouchDown;
        } else {
            elmnt.onmousedown = dragMouseDown;
            elmnt.ontouchstart = dragTouchDown;
        }

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();

            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            elmnt.style.top = elmnt.offsetTop - pos2 + "px";
            elmnt.style.left = elmnt.offsetLeft - pos1 + "px";
        }

        function dragTouchDown(e) {
            e = e || window.event;
            pos3 = e.touches[0].clientX;
            pos4 = e.touches[0].clientY;
            document.ontouchend = closeDragElement;
            document.ontouchmove = elementTouchDrag;
        }

        function elementTouchDrag(e) {
            e = e || window.event;
            pos1 = pos3 - e.touches[0].clientX;
            pos2 = pos4 - e.touches[0].clientY;
            pos3 = e.touches[0].clientX;
            pos4 = e.touches[0].clientY;
            elmnt.style.top = elmnt.offsetTop - pos2 + "px";
            elmnt.style.left = elmnt.offsetLeft - pos1 + "px";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
            document.ontouchend = null;
            document.ontouchmove = null;
        }
    }
}

const moveWindow = new MoveWindow();
