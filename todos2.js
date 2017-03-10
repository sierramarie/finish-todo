var todosContainer = document.querySelector('#todos')
var todoItem = document.querySelector('#todoitem')
var todoButton = document.querySelector('#todoButton')
var selectBox = document.querySelector("#selectbox")
var date = document.querySelector("#duedate")

getTodos()

new Pikaday({ field: date })

todoItem.addEventListener('keypress', handleKeyPressOnTodoItem)
todoButton.addEventListener('click', addTodo)
todosContainer.addEventListener('click', handleClickOnCheckbox)

date.value = moment().add(1, 'day').format('YYYY-MM-DD')
selectBox.focus()

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
        fetch('/api/v1/todos/' + todoId +  '/complete')
    }
    else {
        fetch('/api/v1/todos/' + todoId +  '/incomplete')
    }
}
function addTodo() {
    var todoTask = todoItem.value.trim()
    var selectCategory = selectBox.value.trim()
    var chooseDueDate = date.value.trim()
 if (todoTask !== '' &&  selectCategory !== '' && chooseDueDate !== '') {

       // Clear out or reset fields
        todoItem.value = ''
        selectBox.value = ''
        date.value = ''
    var body = {
        todo: todoTask,
        category: selectCategory,
        due_date: chooseDueDate,
        completed: false
    }

   fetch('http://localhost:3000/api/v1/todos', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })
    .then(response => response.json())
    .then(showTodo)
  }
      else {
        alert('Category, due date, and task are required.')
        selectBox.focus()
    }

}

function getTodos() {
    fetch('http://localhost:3000/api/v1/todos')
    .then(response => response.json())
    .then(loopTodos)
   
}

function loopTodos(todos) {
    todosContainer.innerHTML = ''
    todos.forEach(showTodo)
    
}

function showTodo(todo) {
    var categoryColor;
    console.log(todo)
    switch(todo.category){
        
        case 'Work':
        categoryColor = 'label-success';
        break;

       case 'Personal':
        categoryColor = 'label-danger';
        break;

       case 'School':
        categoryColor = 'label-primary';
        break;

       case 'Friends':
        categoryColor = 'label-warning';
        break;

       case 'Family':
        categoryColor = 'label-info';
        break;
        

           
          
        
    }
    var todoTemplate= `
   <li class="list-group-item">
    <div class="checkbox" id="check"><label> <input type="checkbox" data-id="${todo.id}" />${todo.todo}</label>
    <span class=" float label label">${moment(todo.due_date).format('MM/DD/YYYY')}</span>
  
    <span class="float label ${categoryColor}">${todo.category.toUpperCase()}</span></div>
   </li>`
   todosContainer.innerHTML = todoTemplate + todosContainer.innerHTML


}