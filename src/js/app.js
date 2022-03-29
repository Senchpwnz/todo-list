import { getIndex } from "./modules/getIndex.js";
import { sortStorage } from "./modules/sortStorage.js"

document.addEventListener("DOMContentLoaded", function () {

    const creationInput = document.querySelector("#creation__input");
    const creationButton = document.querySelector("#creation__button");
    const toDoList = document.querySelector("#todo__list");
    const doneList = document.querySelector("#done__list");

    let toDoStorage, doneStorage, nextId

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
        nextId = localStorage.getItem(nextId)
    }


    const toDoApp = {
        creationInput: creationInput,
        creationButton: creationButton,
        nextId: nextId,
        todo: {
            list: toDoList,
            storage: toDoStorage,
            getItemIndex(id) {
                return getIndex(id, this.storage);
            },
            sort() {
                let arr = this.storage;
                this.storage = sortStorage(arr)
            }
        },
        done: {
            list: doneList,
            storage: doneStorage,
            getItemIndex(id) {
                return getIndex(id, this.storage);
            },
            sort() {
                let arr = this.storage;
                this.storage = sortStorage(arr)
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
                li.innerHTML = `<div class="todo__icons">\n\t<div class="icon_done"></div>\n\t<div class="icon_delete"></div>\n\t<div class="icon_edit"></div>\n\t<div class="icon_update"></div>\n\t<div class="icon_cancel"></div>\n</div>\n<div class="todo__text">\n\t<input type="text">\n\t<p>${newToDo.text}</p>\n</div>`
            });

            doneItems.forEach(element => {
                let id = element.id;
                let text = element.text;

                let li = document.createElement("li");
                li.classList.add("done__item");
                li.dataset.id = id;
                li.innerHTML = `<div class="done__icons">\n\t<div class="icon_undone"></div>\n\t<div class="icon_delete"></div>\n</div>\n<div class="done__text">learn html</div>`
            });
        },
        addItem() {
            let newToDo = {
                id: this.nextId,
                text: this.creationInput.value
            };

            let li = document.createElement("li");
            li.classList.add("todo__item");
            li.dataset.id = newToDo.id;
            li.innerHTML = `<div class="todo__icons">\n\t<div class="icon_done"></div>\n\t<div class="icon_delete"></div>\n\t<div class="icon_edit"></div>\n\t<div class="icon_update"></div>\n\t<div class="icon_cancel"></div>\n</div>\n<div class="todo__text">\n\t<input type="text">\n\t<p>${newToDo.text}</p>\n</div>`
            this.todo.list.append(li);

            this.todo.storage.push(newToDo);
            this.nextId++;
            localStorage.setItem("toDoStorage", JSON.stringify(this.todo.storage));
            localStorage.setItem("nextId", this.nextId);
            this.creationInput.value = '';
        },
        removeItem(item) {
            let itemId = item.dataset.id;
            let parent = item.parentNode
            if (parent == this.todo.list) {
                let index = this.todo.getItemIndex(itemId);
                this.todo.storage.splice(index, 1);
                localStorage.setItem("toDoStorage", JSON.stringify(this.todo.storage));
                this.todo.list.removeChild(item);
            } else if (parent == this.done.list) {
                let index = this.done.getItemIndex(itemId);
                this.done.storage.splice(index, 1);
                localStorage.setItem("toDoStorage", JSON.stringify(this.todo.storage));
                this.done.storage.removeChild(item);
            }

        }

    };


    creationButton.addEventListener("click", function () {
        toDoApp.addItem();
    });
    toDoList.addEventListener("click", function (e) {
        if (e.target.classList.contains("icon_delete")) {
            let itemToRemove = e.target.parentNode.parentNode;
            toDoApp.removeItem(itemToRemove)
        }
    });


});

