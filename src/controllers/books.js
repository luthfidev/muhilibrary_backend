const { validationResult } = require('express-validator')
const fs = require('fs')
const paging = require('../utils/pagingnation')
const bookModel = require('../models/books')

module.exports = {

    getAllBooks: async (request, response) => {
        const { page, limit, search, sort } = request.query
        const condition = {
            search,
            sort
        }
        const sliceStart = paging.getPage(page) * paging.getPerPage(limit) - paging.getPerPage(limit)
        const sliceEnd = (paging.getPage(page) * paging.getPerPage(limit))
        const totalData = await bookModel.getBooksCount(sliceStart, sliceEnd, condition)
        const totalPage = Math.ceil(totalData / paging.getPerPage(limit))
        
        const prevLink = paging.getPrevLink(paging.getPage(page), request.query)
        const nextLink = paging.getNextLink(paging.getPage(page), totalPage, request.query)

        const bookData = await bookModel.getAllBooks(sliceStart, sliceEnd, condition)
        
        const data = {
            success: true,
            message: 'List All Book',
            data: bookData,
            pageInfo: {
                page: paging.getPage(page),
                totalPage,
                perPage: paging.getPerPage(limit),
                totalData,
                nextLink: nextLink && `http://localhost:5000/users?${nextLink}`,
                prevLink: prevLink && `http://localhost:5000/users?${prevLink}`
            }
        }
        response.status(200).send(data)
    },

    createBook: async (request, response) => {
        
        if (!request.file) {
            const data = {
                success: true,
                message: `Please upload a file`
            }
            response.status(400).send(data)
        } else {
              
            const { title, description, genre_id, author_id, release_date, status_id } = request.body
            const  image  = request.file.path 
            const Error = await validationResult(request)
            if (!Error.isEmpty()) {
                const data = {
                    success: false,
                    message: Error
                }
                response.status(422).send(data)
                return
            }
            const bookData = {
                title,
                description,
                image,
                genre_id,
                author_id,
                release_date,
                status_id
            }
            const results = await bookModel.createBook(bookData)
            if (results) {
                const data = {
                    success: true,
                    message: 'create book has been success',
                    data: bookData
                }
                response.status(201).send(data)
            } else {
                const data = {
                    success: false,
                    message: 'Failed create book'
                }
                response.status(400).send(data)
            }
        }
        
    },

    updateBook: async (request, response) => {
        const { id } = request.params
        const { title, description, genre_id, author_id } = request.body
        const  image  = request.file.path 
        const CheckId = await bookModel.getBookByCondition({ id: parseInt(id) })
        if (CheckId.length > 0) {
        const Error = await validationResult(request)
            if (!Error.isEmpty()) {
                const data = {
                    success: false,
                    message: Error
                }
                response.status(422).send(data)
                return
            }
            const bookData = [
                { title, description, image, genre_id, author_id },
                { id: parseInt(id) }
            ]
            const results = await bookModel.updateBook(bookData)
            if (results) {
                const data = {
                    success: true,
                    message: 'book has been update',
                    data: bookData[0]
                }
                response.status(201).send(data)
            } else {
                const data = {
                    success: false,
                    message: 'Failed update book'
                }
                response.status(401).send(data)
            }
        } else {
            const data = {
                success: false,
                message: `book with ${id} not found`
            }
            response.status(400).send(data)
        }
    },

    deleteBook: async (request, response) => {
        const { id } = request.params
        const _id = { id: parseInt(id) }
        const checkId = await bookModel.getBookByCondition(_id)
       
        if (checkId.length > 0) {
            fs.unlinkSync(checkId[0].image) 
            const results = await bookModel.deleteBook(_id)
            if (results) {
                const data = {
                    success: true,
                    message: `Book with id ${id} is deleted `
                }
                response.status(200).send(data)
            } else {
                const data = {
                    success: false,
                    message: 'Failed delete book'
                }
                response.status(400).send(data)
            }
        } else {
            const data = {
                success: false,
                message: 'Not data for delete'
            }
            response.status(400).send(data)
        }
    }
        
}