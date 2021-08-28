'use strict';

class Todo {
    constructor(form, input, todoList, todoCompleted) {
        this.form = document.querySelector(form);
        this.input = document.querySelector(input);
        this.todoList = document.querySelector(todoList);
        this.todoCompleted = document.querySelector(todoCompleted);
        this.todoData = new Map(JSON.parse(localStorage.getItem('todoList')));
    }

    init() {
        this.form.addEventListener('submit', this.addItem.bind(this));
        this.render();
    }

    render() {
        this.todoList.textContent = '';
        this.todoCompleted.textContent = '';
        this.todoData.forEach(this.createLi, this);
    }

    addItem(event) {
        event.preventDefault();
        if (this.input.value.trim()) {
            const newItem = {
                value: this.input.value,
                completed: false,
                key: this.generatedKey()
            };
            this.todoData.set(newItem.key, newItem);
            this.addToStorage();
            this.createLi(newItem);
        } else {
            alert('Задача не может быть пустой строкой');
        }
        this.input.value = '';
    }

    createLi(item) {
        const li = document.createElement('li');
        li.classList.add('todo-item');
        li.innerHTML = `
            <span class="text-todo">${item.value}</span>
		    <div class="todo-buttons">
                <button class="todo-edit"></button>
			    <button class="todo-remove"></button>
				<button class="todo-complete"></button>
			</div>`;
        this.handler(li, item);

        if (item.completed) {
            this.todoCompleted.prepend(li);
        } else {
            this.todoList.prepend(li);
        }
    }

    handler(li, item) {
        li.addEventListener('click', event => {
            const target = event.target;
            if (target.matches('.todo-complete')) {
                this.completedItem(item, li);
            } else if (target.matches('.todo-remove')) {
                this.removeItem(item, li);
            } else if (target.matches('.todo-edit')) {
                this.changeValue(item, li);
            }
        });
    }

    removeItem(item, li) {
        this.todoData.delete(item.key);
        this.addToStorage();
        li.remove();
    }

    completedItem(item, li) {
        item.completed = !item.completed;
        this.addToStorage();
        li.remove();
        this.createLi(item);
    }

    changeValue(item, li) {
        li.innerHTML = `
        <form>
			<input type="text" placeholder="Какие планы?">
		</form>
		    <div class="todo-buttons">
                <button class="todo-edit"></button>
			    <button class="todo-remove"></button>
				<button class="todo-complete"></button>
			</div>`;

        const form = li.querySelector('form');
        const input = form.querySelector('input');
        input.value = item.value;
        input.focus();

        const edit = event => {
            event.preventDefault();
            if (input.value.trim()) {
                item.value = input.value;
            }
            li.innerHTML = `
                <span class="text-todo">${item.value}</span>
		        <div class="todo-buttons">
                    <button class="todo-edit"></button>
			        <button class="todo-remove"></button>
				    <button class="todo-complete"></button>
			    </div>`;
        };

        form.addEventListener('submit', e => { edit(e); });
        input.addEventListener('blur', e => { edit(e); });

    }

    addToStorage() {
        localStorage.setItem('todoList', JSON.stringify([...this.todoData]));
    }

    generatedKey() {
        return  Math.random().toString(36).slice(2, 15);
    }
}

const todo = new Todo('.todo-control', '.header-input', '.todo-list', '.todo-completed');
todo.init();
