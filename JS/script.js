'use strict';

const todoControl = document.querySelector('.todo-control');
const headerInput = document.querySelector('.header-input');
const todoList = document.querySelector('.todo-list');
const todoCompleted = document.querySelector('.todo-completed');

let todoListData = JSON.parse(localStorage.getItem('todo')) ?? [];


const getElement = function(value) {
    const elem = document.createElement('li');
    elem.classList.add('todo-item');
    elem.innerHTML = '<span class="text-todo">' + value + '</span>' +
                     '<div class="todo-buttons">' +
                        '<button class="todo-remove"></button>' +
                        '<button class="todo-complete"></button>' +
                    '</div>';
    return elem;
};

const render = function() {
    localStorage.setItem('todo', JSON.stringify(todoListData));
    todoList.textContent = '';
    todoCompleted.textContent = '';

    todoListData.forEach(function(item) {
        const li = getElement(item.value);
        li.querySelector('.todo-complete').addEventListener('click', function() {
            item.completed = !item.completed;
            render();
        });

        li.querySelector('.todo-remove').addEventListener('click', function() {
            todoListData = todoListData.filter(function(i) {return i.value !== item.value;});
            render();
        });

        if(item.completed === true) {
            todoCompleted.append(li);
        } else {
            todoList.append(li);
        }
    });

        
};

todoControl.addEventListener('submit', function (event) {
    event.preventDefault();
    if(headerInput.value !== '') {
        todoListData.unshift({value: headerInput.value, completed: false});
        headerInput.value = '' ;
        render();
    }

});

render();