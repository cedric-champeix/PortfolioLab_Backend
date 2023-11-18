const app = require('express')

let router = new app.Router()

router.get('/projects', (req, res) => {

})

router.route('/project/:project_id')
    .get((req, res) => {

    })
    .post((req, res) => {

    })
    .put((req, res) => {

    })
    .delete((req, res) => {

    })

module.exports = router