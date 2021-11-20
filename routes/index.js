const express = require("express")
const router = express.Router() //creates the router portion of the express variable
//references our book model and we need to get it from our models folder
const Book = require("../models/book")

router.get("/", async (req, res) =>{
    let books
    try {
        // syntex "desc" sort books in descending order
        //.limit(10) only shows the first 10 sorted book in descending order
        //.exec() executes the line of code  
      books = await Book.find().sort({ createdAt: 'desc' }).limit(10).exec()
    } catch {
        //if we get and error in doing this then we just want to render our books to an empty array
      books = []
    }
    //sends a reponse
    //we need to pass in the books here first, so we pass in the object "books" 
    //with the books varaiable here first
    //inside of our books varaible we want to actually order our books by recently adding
    res.render('index', { books: books })
})

//exportsa information from this file, exports router
module.exports = router