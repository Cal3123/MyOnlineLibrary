const express = require('express')
const router = express.Router() //creates the router portion of the express variable
const Author = require('../models/author')
const Book = require('../models/book')
 

const bodyParser = require('body-parser')
const urlencodedParser = bodyParser.urlencoded({extended: true, limit: "500mb", parameterLimit: 100000 })
//const urlencodedParser = bodyParser.urlencoded({ extended: false })


/**All Authors Route**/
router.get('/', async (req, res) => {
  let searchOptions = {}
  if (req.query.name != null && req.query.name !== '') {
    searchOptions.name = new RegExp(req.query.name, 'i')
  }
  try {
    const authors = await Author.find(searchOptions)
    res.render('authors/index', {
      authors: authors,
      searchOptions: req.query
    })
  } catch {
    res.redirect('/')
  }
})

/**New Author Route**/
router.get('/new', (req, res) => {
  res.render('authors/new', { author: new Author() })
})

/**Create Author Route**/
/** router.post('/', async (req, res) => { //not used **/
router.post("/", urlencodedParser , async ( req, res) => {
   // console.log(req.body)
  const author = new Author({
    name: req.body.name
  })
  try {
    const newAuthor = await author.save()
    res.redirect(`authors/${newAuthor.id}`)
  } catch {
    res.render('authors/new', {
      author: author,
      errorMessage: 'Error creating Author'
    })
  }
})

//For SHOWING BOOKS by arthor page our user. '/:id' signifies that after this colon there is going to be a variable 
//called id that is going to be passed along with our request
//NOTE: get('/:id',...) shold come after get('/new', ..) so that our server does not mistake the later for the former
router.get('/:id', async (req, res) => {
  try {
    const author = await Author.findById(req.params.id)
    //we want to find books by a particular author above using the arthor's id
    //limit(6).exec() executes six books by the author at a time
    const books = await Book.find({ author: author.id }).limit(6).exec()
    res.render('authors/show', {
      author: author,
      booksByAuthor: books,  
    })
  } catch {
    //render us back to th home page if we fail to get either author or books
    res.redirect('/')
  }
})

//for editing id or author
//In order to get the arthor from our database, we will use the async function
router.get('/:id/edit', async (req, res) => {
  try {
    //findById is a method built into the mongoose library 
    const author = await Author.findById(req.params.id)
    res.render('authors/edit', { author: author })
  } catch {
    res.redirect('/authors')
  }
})

//From a browser you can only make a post and get request. So we have no way from the browser to say put or delete.
//So we need to install a library thagt allows us to make this put and delete request ~ npm i method override
//It allows us to take a post form, sent that to our server with a special parameter that tell us if we a doing a put 
//or delete request and our server will be smart enough to actually call the correct router here for delete or put
//based on that specific parameter

//this is an update route. Updates arthor. put essentially tells us that this is going to be an edit route
router.put('/:id', urlencodedParser,async (req, res) => {
  let author
  try {
    //gets the id from the url. searches for it in mongoose database to find arthor
    author = await Author.findById(req.params.id)
    //changes the name to whatever new name that the user entered in view
    author.name = req.body.name
    //waits till the above functions is done then saves
    await author.save()
    //after that it redirects to show arthor
    res.redirect(`/authors/${author.id}`)
  } catch {
    //if the arthor wasn't found then it redirects it back to the homepage
    if (author == null) {
      res.redirect('/')
    } else {
      //if the arthor does exist and form some reason it could not update name then it renders 
      //the error message below at our edit page
      res.render('authors/edit', {
        author: author,
        errorMessage: 'Error updating Author'
      })
    }
  }
})

//deletes arthor. /:id is there for us to know what resources to delete
//Never use  a get method to perform delete
router.delete('/:id', async (req, res) => {
  let author
  try {
    author = await Author.findById(req.params.id)
    //the remove method is a method in mongoose db database. 
    await author.remove()
    
    //redirects you to the author page so that we can see all the available arthor page after we delete
    res.redirect('/authors')
  } catch(error) { 
    if (author == null) {
      //redirects to home page
      res.redirect('/')
    } else { 
      //renderFormPage(res, true)
      
      //if we fail removing the arthor, we will redirect back to the arthor
      res.redirect( `/authors/${author.id}`) 
      /**INitial --> res.redirect(`/authors/${author.id}`) **/ 
      //res.redirect(params, `/authors/${author.id}`)
    } 
  }
})
 
async function renderFormPage(res, hasError = false) {
   
  
  try {
    if(hasError) {
      const params = {
        errorMessage: 'This author has book books'
      }
      console.log("HERE!")
      /**This is the problem
       * Important knowlege
       * For some reason params is unable to reach errorMessage.ejs through layout.ejs 
       * Note to render means I need to pass author variable and searchoption just like
       * I did in All authors router. Redirects makes no changes, it just simply sends you to
       * tha page with that form action and that page in turn, using it's form action, calls the 
       * its respective router (IN this case All authors router) and that router repopulates, better term
       * renders, it again (the page) at the same time giving it the respective variables to do
       * that. **/
      /* problem -->res.render(`/authors` ) **/
    }
    //res.redirect(`/authors/${author.id}`, errorMessage)   
  } catch (error) {
    console.log("HHHHERE!")
    res.redirect('/authors' )
  }
} 

//exportsa information from this file, exports router
module.exports = router