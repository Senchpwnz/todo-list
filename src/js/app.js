document.addEventListener("DOMContentLoaded", function () {

    const CREATION_INPUT = document.querySelector("#creation__input");
    const CREATION_BUTTON = document.querySelector("#creation__button");
    const TO_DO_LIST = document.querySelector("#todo__list");
    const DONE_LIST = document.querySelector("#done__list");

    let toDoStorage, doneStorage, nextId;

    if (!localStorage.getItem("toDoStorage")) {
        toDoStorage = [];
        localStorage.setItem("toDoStorage", JSON.stringify(toDoStorage));
    } else {
        toDoStorage = JSON.parse(localStorage.getItem("toDoStorage"))
    }
    if (!localStorage.getItem("doneStorage")) {
        doneStorage = [];
        localStorage.setItem("doneStorage", JSON.stringify(doneStorage));
    } else {
        doneStorage = JSON.parse(localStorage.getItem("doneStorage"))
    }
    if (!localStorage.getItem("nextId")) {
        nextId = 1;
        localStorage.setItem("nextId", nextId)
    } else {
        nextId = localStorage.getItem("nextId")
    }



    const toDoApp = {
        creationInput: CREATION_INPUT,
        creationButton: CREATION_BUTTON,
        nextId: nextId,
        todo: {
            list: TO_DO_LIST,
            storage: toDoStorage,
            sort() {
                let sorted = this.storage.sort(function (a, b) {
                    if (a.id > b.id) {
                        return 1;
                    }
                    if (a.id < b.id) {
                        return -1;
                    }
                })
                this.storage = sorted;
            }
        },
        done: {
            list: DONE_LIST,
            storage: doneStorage,
            sort() {
                let sorted = this.storage.sort(function (a, b) {
                    if (a.id > b.id) {
                        return 1;
                    }
                    if (a.id < b.id) {
                        return -1;
                    }
                })
                this.storage = sorted;
            }
        },
        loadItems() {
            let toDoItems = this.todo.storage;
            let doneItems = this.done.storage;

            toDoItems.forEach(element => {
                let id = element.id;
                let text = element.text;


                let li = document.createElement("li");
                li.classList.add("todo__item");
                li.dataset.id = id;
                li.innerHTML = `<div class="todo__icons">\n\t<div class="icon_done"></div>\n\t<div class="icon_delete"></div>\n\t<div class="icon_edit"></div>\n\t<div class="icon_update"></div>\n\t<div class="icon_cancel"></div>\n</div>\n<div class="todo__text">\n\t<input type="text" class="todo__input" autofocus>\n\t<p>${element.text}</p>\n</div>`;
                this.todo.list.prepend(li);
            });

            doneItems.forEach(element => {
                let id = element.id;
                let text = element.text;

                let li = document.createElement("li");
                li.classList.add("done__item");
                li.dataset.id = id;
                li.innerHTML = `<div class="done__icons">\n\t<div class="icon_undone"></div>\n\t<div class="icon_delete"></div>\n</div>\n<div class="done__text">${element.text}</div>`;
                this.done.list.prepend(li);
            });
            this.checkLists();
        },
        addItem() {
            let element = {
                id: this.nextId,
                text: this.creationInput.value
            };

            let li = document.createElement("li");
            li.classList.add("todo__item");
            li.dataset.id = element.id;
            li.innerHTML = `<div class="todo__icons">\n\t<div class="icon_done"></div>\n\t<div class="icon_delete"></div>\n\t<div class="icon_edit"></div>\n\t<div class="icon_update"></div>\n\t<div class="icon_cancel"></div>\n</div>\n<div class="todo__text">\n\t<input type="text" class="todo__input">\n\t<p>${element.text}</p>\n</div>`;
            this.todo.list.prepend(li);

            this.todo.storage.push(element);
            this.nextId++;
            localStorage.setItem("toDoStorage", JSON.stringify(this.todo.storage));
            localStorage.setItem("nextId", this.nextId);
            this.creationInput.value = '';
            this.checkLists();
        },
        removeItem(item) {
            let id = item.dataset.id;
            let parent = item.parentNode

            if (parent == this.todo.list) {
                let index = this.todo.storage.findIndex(el => el.id == id)
                this.todo.storage.splice(index, 1);
                localStorage.setItem("toDoStorage", JSON.stringify(this.todo.storage));
                this.todo.list.removeChild(item);
            } else if (parent == this.done.list) {
                let index = this.done.storage.findIndex(el => el.id == id)
                this.done.storage.splice(index, 1);
                localStorage.setItem("doneStorage", JSON.stringify(this.done.storage));
                this.done.list.removeChild(item);
            }
            this.checkLists();
        },
        doneItem(item) {
            let id = item.dataset.id;
            let index = this.todo.storage.findIndex(el => el.id == id);
            let element = this.todo.storage[index];

            this.todo.list.removeChild(item);
            this.todo.storage.splice(index, 1);
            localStorage.setItem("toDoStorage", JSON.stringify(this.todo.storage));

            let li = document.createElement("li");
            li.classList.add("done__item");
            li.dataset.id = element.id;
            li.innerHTML = `<div class="done__icons">\n\t<div class="icon_undone"></div>\n\t<div class="icon_delete"></div>\n</div>\n<div class="done__text">${element.text}</div>`;

            this.done.storage.push(element)

            if (this.done.storage.length == 1) {
                this.done.list.append(li);

            } else {
                this.done.sort();
                let last = this.done.storage.length - 1;
                let i = this.done.storage.findIndex(el => el.id == element.id);

                if (i == 0) {
                    this.done.list.append(li);

                } else if (i == last) {
                    this.done.list.prepend(li);

                } else {
                    let list = this.done.list.querySelectorAll("li");
                    let liBefore = list[last - i];
                    liBefore.before(li);
                }
            }
            localStorage.setItem("doneStorage", JSON.stringify(this.done.storage))
            this.checkLists();
        },
        undoItem(item) {
            let id = item.dataset.id;
            let index = this.done.storage.findIndex(el => el.id == id);
            let element = this.done.storage[index];

            this.done.list.removeChild(item);
            this.done.storage.splice(index, 1);
            localStorage.setItem("doneStorage", JSON.stringify(this.done.storage));

            let li = document.createElement("li");
            li.classList.add("todo__item");
            li.dataset.id = element.id;
            li.innerHTML = `<div class="todo__icons">\n\t<div class="icon_done"></div>\n\t<div class="icon_delete"></div>\n\t<div class="icon_edit"></div>\n\t<div class="icon_update"></div>\n\t<div class="icon_cancel"></div>\n</div>\n<div class="todo__text">\n\t<input type="text" class="todo__input">\n\t<p>${element.text}</p>\n</div>`;
            this.todo.storage.push(element);

            if (this.todo.storage.length == 1) {
                this.todo.list.append(li);

            } else {
                this.todo.sort();
                let last = this.todo.storage.length - 1;
                let i = this.todo.storage.findIndex(el => el.id == element.id);

                if (i == 0) {
                    this.todo.list.append(li);

                } else if (i == last) {
                    this.todo.list.prepend(li);

                } else {
                    let list = this.todo.list.querySelectorAll("li");
                    let liBefore = list[last - i];
                    liBefore.before(li);
                }
            }
            localStorage.setItem("toDoStorage", JSON.stringify(this.todo.storage));
            this.checkLists();
        },
        editItem(item) {
            let itemText = item.querySelector("p");
            let itemInput = item.querySelector(".todo__input");
            let iconDone = item.querySelector(".icon_done");
            let iconEdit = item.querySelector(".icon_edit");
            let iconUpdate = item.querySelector(".icon_update");
            let iconCancel = item.querySelector(".icon_cancel");

            let elementsToHide = [itemText, iconDone, iconEdit];
            let elementsToShow = [itemInput, iconUpdate, iconCancel];

            item.classList.toggle("back-color");
            itemInput.value = itemText.innerHTML

            elementsToHide.forEach(el => el.classList.toggle("hide"));
            elementsToShow.forEach(el => el.classList.toggle("show"));
            itemInput.focus();

            let itemUpdate = () => {
                let newText = itemInput.value;
                let id = item.dataset.id;
                let index = this.todo.storage.findIndex(el => el.id == id);

                this.todo.storage[index].text = newText;
                localStorage.setItem("toDoStorage", JSON.stringify(this.todo.storage));
                itemText.innerHTML = newText;

                item.classList.toggle("back-color");
                elementsToHide.forEach(el => el.classList.toggle("hide"));
                elementsToShow.forEach(el => el.classList.toggle("show"));

                removeListeners();
            }

            let itemCancelEdit = () => {
                item.classList.toggle("back-color");

                elementsToHide.forEach(el => el.classList.toggle("hide"));
                elementsToShow.forEach(el => el.classList.toggle("show"));

                removeListeners();
            }
            let keyPressed = (e) => {
                if (e.keyCode == 13) {
                    itemUpdate();
                } else if (e.keyCode == 27) {
                    itemCancelEdit();
                }
            }

            itemInput.addEventListener("keydown", keyPressed)
            iconUpdate.addEventListener("click", itemUpdate)
            iconCancel.addEventListener("click", itemCancelEdit)


            function removeListeners() {
                itemInput.removeEventListener("keydown", keyPressed);
                iconUpdate.removeEventListener("click", itemUpdate);
                iconCancel.removeEventListener("click", itemCancelEdit);
            }
        },
        checkLists() {
            let toDoLength = this.todo.list.querySelectorAll("li").length;
            let todo = document.querySelector(".todo");
            let doneLength = this.done.list.querySelectorAll("li").length;
            let done = document.querySelector(".done")

            if (toDoLength == 0) {

                todo.classList.add("hide");
            } else {

                todo.classList.remove("hide");
            }
            if (doneLength == 0) {

                done.classList.add("hide");
            } else {

                done.classList.remove("hide");
            }
        }
    };

    toDoApp.loadItems();

    CREATION_BUTTON.addEventListener("click", function () {
        toDoApp.addItem();
    });
    TO_DO_LIST.addEventListener("click", function (e) {
        if (e.target.classList.contains("icon_delete")) {
            let item = e.target.parentNode.parentNode;
            toDoApp.removeItem(item);
        }
        if (e.target.classList.contains("icon_done")) {
            let item = e.target.parentNode.parentNode;
            toDoApp.doneItem(item);
        }
        if (e.target.classList.contains("icon_edit")) {
            let item = e.target.parentNode.parentNode;
            toDoApp.editItem(item);
        }
    });
    DONE_LIST.addEventListener("click", function (e) {
        if (e.target.classList.contains("icon_delete")) {
            let item = e.target.parentNode.parentNode;
            toDoApp.removeItem(item);
        }
        if (e.target.classList.contains("icon_undone")) {
            let item = e.target.parentNode.parentNode;
            toDoApp.undoItem(item);
        }
    });



});

