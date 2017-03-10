// Define a Node module that handles routing
module.exports.setup = (router, uploads, knex) => {

    // 1. Load libraries
    let moment = require('moment')

    // 2. Define routes



    // Get all todos
    router.get('/todos', function(request, response) {

        knex.select().table('todos').then(function(data) {
            response.json(data)
        })

    })

    // Post a new todo
    router.post('/todos', function(request, response) {

        let now = moment().format('YYYY-MM-DD HH:mm:ss')

        let todo = {
            todo: request.body.todo.trim(),
            completed: request.body.completed ? 'yes' : 'no',
            created_at: now,
            updated_at: now,
            category: request.body.category,
            due_date: request.body.due_date,
            
        }

        knex.insert(todo).table('todos').returning('*').then(function(data) {
            response.json(data[0])
        })
        router.get('/todos/:todoId/complete')
    })

    // Return the router, with new routes attached back to the Express web server that's loading these
    return router
}
