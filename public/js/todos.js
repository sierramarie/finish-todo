var todosContainer = document.querySelector('#todos')
var todoItem = document.querySelector('#todoItem')
var todoCategoryInput = document.querySelector('#todoCategory')
var todoDueAtInput = document.querySelector('#todoDueAt')
var todoButton = document.querySelector('#todoButton')

// Load existing todos
getTodos()


new Pikaday({ field: todoDueAtInput })


todoItem.addEventListener('keypress', handleKeyPressOnTodoItem)
todoButton.addEventListener('click', addTodo)

// Handle event for completing or incompleting a task
todosContainer.addEventListener('click', handleClickOnCheckbox)

// due date
todoDueAtInput.value = moment().add(1, 'day').format('YYYY-MM-DD')

//start typing - no click
todoItem.focus()


// Functions ---

function handleKeyPressOnTodoItem(e) {
    if (e.key === 'Enter') {
        addTodo()
    }
}

function handleClickOnCheckbox(e) {
    // Only do something if a user clicks on a checkbox input tag
    if (e.target.type === 'checkbox') {
        toggleTodoComplete(e.target.getAttribute('data-id'), e.target.checked)
    }
}
function toggleTodoComplete(todoId, isComplete) {
    if (isComplete) { 
        fetch('/api/v1/todos' + todoId + '/complete')
    }
    else { 
        fetch('api/v1/todos/' + todoId + '/incomplete')
    }
}

function addTodo() {
    // trim input -> variables -> clear out 
    var todoTask = todoItem.value.trim()
    var todoCategory = todoCategoryInput.value.trim()
    var todoDueAt = todoDueAtInput.value.trim()
    // check 
    if (todoTask !== '' && todoCategory !== '' && todoDueAt !== '') {
        // clear fields
        todoTaskInput.value = ''
        todoDueAtInput.value = ''
        todoCategoryInput.value = ''

        var body = {
            todo: todoTask,
            due_at: todoDueAt,
            category: todoCategory,
            completed: false,
        }
        // Post new todo
        fetch('http://localhost:3000/api/v1/todos', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
            .then(getTodos)
            .then(showTodo)

    }
    else {
        alert('Category, due date, and task are required.')
        todoCategoryInput.focus()
    }

}
// Load todos array
function getTodos() {
    fetch('http://localhost:3000/api/v1/todos')
    .then(response => response.json())
    .then(loopTodos)
}
// Loop over todos 
function loopTodos(todos) {
    todosContainer.innerHTML = ''
    todos.forEach(showTodo)
}

function showTodo(todo) {
    var categoryColor;
    console.log(todo)
    switch(todo.category) { 

        case 'Work': 
        categoryColor= ''
        break;

        case 'Personal': 
        categoryColor= ''
        break;

        case 'School': 
        categoryColor= ''
        break;

        case 'Friends': 
        categoryColor= ''
        break;

        case 'Family': 
        categoryColor= ''
        break;
    }
    var todoTemplate = `
    <li class="list-group-item">
     <label><input type="checkbox" data-id="${todo.id}" />
         ${todo.todo} </label>
        <span class="badge">${todo.category.toUpperCase()}</span>
        <span class="badge">${moment(todo.due_at).format('MM/DD/YYYY')}</span>
    </li>`

    todosContainer.innerHTML += todoTemplate
}