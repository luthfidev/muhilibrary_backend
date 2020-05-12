const router = require('express').Router()
const authorController = require('../controllers/authors')

router.get('/', authorController.getAllAuthors)
router.post('/', authorController.createAuthor)
router.patch('/:id', authorController.updateAuthor)
router.delete('/:id', authorController.deleteAuthor)

module.exports = router