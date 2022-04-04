const express = require('express')
const router = express.Router() //creates the router portion of the express variable
//references our book model and we need to get it from our models folder
const Book = require('../models/book')

router.get('/', async (req, res) => {
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
  /**Since you have told the server that it should use 'views' folder as it's default destination to render
   * It is already in views. You do not need to add ejs to the index file in the views folder that you are
   * referring to. So it sends books to that file which it in turn passes it to the partial
   * formfields.
   */
  res.render('index', { books: books })
})

//exports information from this file, exports router
module.exports = router