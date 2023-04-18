window.onload = function () {
    startApp.init();
};

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
        if (data == null || data == undefined) return;

        this.tasks = data;

        data.forEach((value, index) => taskUi.addTask(value));
    }

    saveButton(e) {
        e.preventDefault();

        const taskText = document.getElementById("taskName").value;
        let deadline = document.getElementById("deadline").value;

        deadline === "" ? (deadline = "------") : deadline;

        console.log(taskText);
        console.log(e);

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
        let arr = this.tasks;
        for (let i = 0; i < arr.length; i++) {
            let el = arr[i];

            if (el.id == taskId) {
                if (i >= 1) {
                    let temp = arr[i - 1];
                    arr[i - 1] = arr[i];
                    arr[i] = temp;
                    break;
                }
            }
        }

        this.saveTask();
        taskUi.deleteAll();
        this.loadData();
    }

    moveTaskDown(taskId) {
        let arr = this.tasks;
        for (let i = 0; i < arr.length; i++) {
            let el = arr[i];

            if (el.id == taskId) {
                if (i < arr.length - 1) {
                    let temp = arr[i + 1];
                    arr[i + 1] = arr[i];
                    arr[i] = temp;
                    break;
                }
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

class TaskUi {
    clearForm() {
        document.getElementById("taskName").value = "";
        document.getElementById("deadline").value = "";
    }

    deleteTask(e) {
        const taskId = e.target.getAttribute("task-id");
        e.target.parentElement.parentElement.remove();
        taskList.removeTaskById(taskId);
    }

    deleteAll() {
        const allTasks = document.querySelectorAll(".single-task");
        allTasks.forEach((el) => el.remove());
    }

    moveTaskUp(e) {
        let taskId = e.target.getAttribute("task-id");
        taskList.moveTaskUp(taskId);
    }

    moveTaskDown(e) {
        let taskId = e.target.getAttribute("task-id");
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

        let deleteBtn = document.querySelector(
            `button.del[task-id="${task.id}"]`
        );
        deleteBtn.addEventListener("click", (e) => this.deleteTask(e));
        let moveUp = document.querySelector(`button.up[task-id="${task.id}"]`);
        moveUp.addEventListener("click", (e) => this.moveTaskUp(e));
        let moveDown = document.querySelector(
            `button.down[task-id="${task.id}"]`
        );
        moveDown.addEventListener("click", (e) => this.moveTaskDown(e));
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

        data.forEach((value, index) => {
            shoppingUi.addItem(value);
            shoppingUi.addShop(value);
        });
    }

    saveButton(e) {
        e.preventDefault();

        const itemName = document.getElementById("itemName").value;
        let amount = document.getElementById("amount").value;
        let shopName = document.getElementById("shopName").value;
        let shopNameSelected = document.getElementById("shopName-select").value;
        console.log(shopNameSelected);

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

class ShoppingUi {
    shopFilterCard = document.getElementById("shop-filter");

    shopFilterBtn = document
        .getElementById("shopFilterBtn")
        .addEventListener("click", () => {
            this.shopFilterCard.classList.remove("hidden");
            moveWindow.dragElement(this.shopFilterCard);
        });
    setBtn = document
        .getElementById("setFilterBtn")
        .addEventListener("click", (e) => shoppingUi.setShopFilter(e));
    resetBtn = document
        .getElementById("resetFilterBtn")
        .addEventListener("click", (e) => shoppingUi.resetShopFilter(e));
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

    deleteItem(e) {
        const itemId = e.target.getAttribute("item-id");
        e.target.parentElement.remove();
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

        let deleteBtn = document.querySelector(
            `button.del[item-id="${item.id}"]`
        );
        deleteBtn.addEventListener("click", (e) => this.deleteItem(e));
    }

    addShop(item) {
        let shopFilter = document.getElementById("shop-list");
        let singleShop = document.createElement("div");
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
        shoppingCard.items.forEach((value, index) => {
            this.addShop(value);
        });
    }

    setShopFilter(e) {
        let data = shoppingCard.items;
        let shopList = document.querySelectorAll("#shop-list input");

        this.deleteAll();

        for (let i = 0; i < shopList.length; i++) {
            if (shopList[i].checked) {
                data.forEach((value, index) => {
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
        let tasks = null;

        if (localStorage.getItem("tasks") !== null) {
            tasks = JSON.parse(localStorage.getItem("tasks"));
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

        if (localStorage.getItem("items") !== null) {
            items = JSON.parse(localStorage.getItem("items"));
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

class Language {
    dict = {
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
            Filter: "Filter",
            Reset: "Reset",
            Close: "Close",
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
            Filter: "Filtr",
            Reset: "Reset",
            Close: "Zamknij",
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
        let lang;
        if (e.target.id === "en-lang-btn") {
            lang = "en";
        }
        if (e.target.id === "pl-lang-btn") {
            lang = "pl";
        }

        let contentText = document.querySelectorAll("[cont]");
        let chosenDict = this.dict[lang];

        for (let i = 0; i < contentText.length; i++) {
            let content = contentText[i].getAttribute("cont");
            contentText[i].textContent = chosenDict[content];
        }
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
