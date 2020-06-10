const router = require('express').Router()
const authorController = require('../controllers/authors')
const checkRole = require('../utils/roles')
const cekBiodata = require('../utils/cekBiodata')
const verify = require('../utils/verifyToken')
const { authorValidationRules, validate } = require('../utils/validators')


router.get('/',
    authorController.getAllAuthors)
  .post('/',
    authorController.createAuthor)
  .patch('/:id',
    authorController.updateAuthor)
  .delete('/:id',
    authorController.deleteAuthor)

module.exports = router
