const express = require('express')
const router = express.Router() //creates the router portion of the express variable
const Book = require('../models/book')
//const Book = myModule.Book
//const coverImageBasePath = myModule.coverImageBasePath
//import our author model so that we will be able to use our author model in order to get our authors 
const Author = require('../models/author') 
//**No longer need fs and path
//If we do have an error saving the book, we want to make sure that we remove the bookcover that was saved 
//if there was one that was saved. In order to do this we intall this library built into node
// const fs = require("fs")
// const path = require ("path")//imports a library path built into node.js
//**No longer need uploadPath
//creates our upload path variable. path.join combines two different path
// the upload path is going to go from our punlic folder into the coverImageBasepath that we have created
//const uploadPath = path.join("public" + Book.coverImageBasePath )//uploads/bookCovers') 
//multer allows our route to recieve a multipart data which could include a file
//const multer = require("multer") **no longer needed due to file encode plugin of filepond 
//an array that has all the different image types that we accept
const imageMimeTypes = ['image/jpeg', 'image/jpg', 'image/jfif', 'image/pjpeg', 'image/pjp', 'image/svg', 'image/webp', 'image/avif', 'image/apng', 'image/png', 'image/gif'] //no longer to be used with multer  

const bodyParser = require('body-parser')

const urlencodedParser = bodyParser.urlencoded({extended: true, limit: "500mb", parameterLimit: 100000 })
//const urlencodedParser = bodyParser.urlencoded({ extended: true })
 

//upload helps us to configure multer in order to be used in our project
// const upload = multer({
//   //test us were the upload path is going to be inside of our project
//   //this going to be an upload path for our destination
//   dest: uploadPath,
//   //filter our files, allows us to filter which  files that our server accepts
//   //takes in a request of our file, file, and callback which calls whenever we are done with our file filter
//   fileFilter: (req, file, callback) => {  
//     //first parameter is null since we have no error since it is an error parameter
//     //second is a boolean that says true if the file is accepted or false if it is not accepted
//     callback(null, imageMimeTypes.includes(file.mimetype))
//   }
// })

/**All Books Route**/
router.get('/', async (req, res) => {
 
   
  //the purpose of this query is to check if the name is the name, and if published date after 
  //comes before beforedate
  let query = Book.find()
  //below if checks that query.title is not equal to null or ""
  if (req.query.title != null && req.query.title != '') {
    //We qant build this query from our req query parameters
    //regex is appended to our query
    //"title" is our databse model parameter. this is going to be the book.title object of our database
    //then we create a new RegularExptression which is just going to containg our title and 
    //we pass the "i" flag which just says that we don't care if they type a capital s or lowercase is
    //it is going to be treatd exactly the same 
    query = query.regex('title', new RegExp(req.query.title, 'i'))
  }
  //below if checks that query.publishedBefore is not equal to null or ""
  if (req.query.publishedBefore != null && req.query.publishedBefore != '') {
    //checks that our query is less than and equal to publishedBefore date the user type in the text area
    //syntex "lt" means less than, "lte" means less than and equal to
    //lte is appended to our query and we pass in the field in our database that we want to check
    //essentially what we are saying is that if the publish date is less than or equal to the 
    //publishedBefore date then we want to return that object(Books that fit query)
    query = query.lte('publishDate', req.query.publishedBefore)
  }
  if (req.query.publishedAfter != null && req.query.publishedAfter != '') {
    //gte is appended to our query and we pass in the field in our database that we want to check
    //essentially what we are saying is that if the publish date is grater than or equal to the 
    //publishedAfter date then we want to return that object(Books that fit query)
    query = query.gte('publishDate', req.query.publishedAfter)
  }

  try {
    //query.exec will execute the query that we find 
    const books = await query.exec()
    /**Render as this url books/index  */
    res.render('books/index', {
      books: books,
      searchOptions: req.query
    })
  } catch {
    res.redirect('/')
  }
})

/**New Book Route**/
router.get('/new', async (req, res) => {
  renderNewPage(res, new Book())
})

/**Create Book Route**/
//upload.single tells our multer that we are uploading a single file with name of cover
//multer is going to do all the work behind the scenes to create that file and
//upload it onto our server and put it in a correct folder
//We no longer need .post(..,upload.single('cover'), ..) because now we are not getting a file, we are
//a getting string due to file encode plugin of filepond 
/** router.post('/', async (req, res) => {  **/
router.post('/', urlencodedParser, async (req, res) => {

  //**We no longer need filName check, it's been taking care of by saveCover() function 
  //adds a variable to our request which is going to be called file
  //checks if the file is not equal to null then gets the filename but if it is then return null
  //const fileName = req.file != null ? req.file.filename : null
  /*
    if(req.body.title === null || req.body.title === "" ) {
      error
    }
  */

  const book = new Book({
    title: req.body.title,
    author: req.body.author,
    //warp this inside of a new date because req.body will return a string
    //wrapping this new date will convert the string into a date 
    publishDate: new Date(req.body.publishDate),
    pageCount: req.body.pageCount,
    //**We no longer need coverImgaeName, it's been taking care of by saveCover() function 
    //we need to first create the coverImage file on our file system, get the name from that
    //and then save that onto our book object
    //fileName is used to set our coverImageName
    // coverImageName: fileName,
    description: req.body.description
  })
  
  //upload the book file into our actual book model
  //saveCover is a function that takes our book object as well as the actual encoded JSON cover that is 
  //going to be in req.body.cover filename becuase we set the name of our file input to cover  
  try {
    saveCover(book, req.body.cover)
  } catch {
    renderNewPage(res, book, true)
  } 
  // console.log("book.title --> " + book.title)
  // console.log("book.author --> " + book.author)
  // console.log("book.publishDate --> " + book.publishDate)
  // console.log("book.pageCount --> " + book.pageCount)
  // //console.log("req.body.cover --> " + req.body.cover)
  // console.log("book.coverImageName --> " + book.coverImageName)
  // console.log("book.coverImageType --> " + book.coverImageType)
  // console.log("book.description --> " + book.description)

  try {
    const newBook = await book.save()
    //redirects to the book page
    //res.redirect(`books`) //I changed it to thos cuz belowas not working
    res.redirect(`books/${newBook.id}`)
  } catch {
    //** Since we don't need the removebook function if() can go
    //the line below prevents bookcover image frpm being stored if book was created wrongly or
    //does not havye all its parameter filled
    // if(book.coverImageName != null){
    //   removeBookCover(book.coverImageName)
    // } 
    //this actually catches the error that is thrown, set it to true and renders New Page
    /**renderNewPage(res, new Book, true) this is replaced below**/
    renderNewPage(res, book, true)
  }
})

/** Show Book Route **/
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
                           .populate('author')
                           .exec()
    res.render('books/show', { book: book })
  } catch {
    res.redirect('/')
  }
})

/** Edit Book Route **/
router.get('/:id/edit', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
    renderEditPage(res, book)
  } catch {
    res.redirect('/')
  }
})


/**Update Book Route**/ 
router.put('/:id', urlencodedParser, async (req, res) => {
  /**
   * I am able to fix the sum bug with create book url but I am having issues with this one
   * I am experiencing a bug hear. Whenever the cover size is bigger than bodyparser I get
   * a 'PayloadTooLargeError: request entity too large'. Attempted to fix it with a try{}catch{}
   * block but the problem is it that the error does not occur inside of this router. 
   * It occurs during parsing attempt from the web page to the router.
   * A temporal solution was to increase parameter limit and size limit of body parser and tell the user 
   * to not upload anything above limit.
   * Still inefficient. 
   */
  let book
  try {
    book = await Book.findById(req.params.id)
  } catch {
    //if we cant find book then the id has been altered somehow, got to home
    res.redirect('/')
  }
 
 
  if(req.body.title == "" || req.body.title == null ||
    req.body.author == "" || req.body.author == null ||
    req.body.publishDate == "" || req.body.publishDate == null ||
    req.body.pageCount == "" || req.body.pageCount == null ||
    req.body.cover == "" || req.body.cover == null ||
    req.body.description == "" || req.body.description == null ) {
      renderEditPage(res, book, true)
  } 

  try {
    //saves cover to book
    saveCover(book, req.body.cover)
  } catch { 
    renderEditPage(res, book, true)
  } 
  
  try {
    //saves there parameters to book
    //book = await Book.findById(req.params.id)
    book.title = req.body.title
    book.author = req.body.author
    book.publishDate = new Date(req.body.publishDate)
    book.pageCount = req.body.pageCount
    book.description = req.body.description
    /*
    if (req.body.cover != null && req.body.cover !== '') {
      saveCover(book, req.body.cover)
    }
    */
    //saves into database
    await book.save()
    res.redirect(`/books/${book.id}`)
  } catch {
    if (book != null) {
      //this is very wise, rendering may give problem since the whole page is
      //being renderd again so tell node js to redirect home cuz we assume
      //home is has already been renderd by form action calling it respective
      //route. And it safer since  home is crucial to the app and hence  
      //should have no room for error else app is trash
      renderEditPage(res, book, true)
    } else {
      res.redirect('/')
    }
  }
})

/**Delete Book Page**/ 
router.delete('/:id', async (req, res) => {
  let book
  try {
    book = await Book.findById(req.params.id)
    await book.remove()
    res.redirect('/books')
  } catch {
    if (book != null) {
      res.render('books/show', {
        book: book,
        errorMessage: 'Could not remove book'
      })
    } else {
      res.redirect('/')
    }
  }
})



//**Now that we are no loger storing our image on the server, we no longer need to worry about removing book
//covers from unable to be uploaded books
// function removeBookCover(fileName){
//   //this is going to get ride of any file that has a filename inside "/uploads/bookCovers"
//   //also takes a function which has an error parameter
//   fs.unlink(path.join(uploadPath, filename), err => {
//     //this prints to the console an error message beacuse it is not something that the user must be concerned with
//     if(err)console.error(err)
//   })
// }

//responds variable to render or redirect as need a new page as needed
//a book varaible beacuse sometimes we are going to render an existing book or new book
//haserrroMessage because sometimes we are going to have an error message from our server
//and we are going to default it to false because most of our request we hope we don't 
//have an error but if it does we set this to true 
//the function is an async function because we are async await inside of it
async function renderNewPage(res, book, hasError = false) {
  /** 
  try {
    const authors = await Author.find({})
    const params = {
      authors: authors,
      book: book
    }
    //renders erroMessage to params variable if we have an error
    if (hasError) params.errorMessage = 'Error Creating Book'
    res.render('books/new', params)
  } catch {
    res.redirect('/books')
  }
  **/
  renderFormPage(res, book, 'new', hasError)
}

async function renderEditPage(res, book, hasError = false) {
  renderFormPage(res, book, 'edit', hasError)
}

async function renderFormPage(res, book, form, hasError = false) {
  try {
    const authors = await Author.find({})
    const params = {
      authors: authors,
      book: book
    }
    if (hasError) {
      if (form === 'edit') { 
        params.errorMessage = "Error Updating Book. Please repond to all fields." 
        + " Uploaded image must not be more than 500mb in size"
        + " and must be one of the following extensions: jpeg, jpg, jfif, pjpeg, pjp, svg, webp, avif, apng, png, gif!"
      } else {
        params.errorMessage = "Error Creating Book. Please repond to all fields." 
        + " Uploaded image must not be more than 500mb in size"
        + " and must be one of the following extensions: jpeg, jpg, jfif, pjpeg, pjp, svg, webp, avif, apng, png, gif!"
      }
    
    }
    //I am not using form action in here, I am just ading an extension to the home url
    res.render(`books/${form}`, params)
  } catch {
    //Same here
    res.redirect('/books')
  }
}

//takes in a book and encoded cover
//stores our files inside of the database so that we can use it inside of Heroku
/**async was removed**/ 
function saveCover(book, coverEncoded) {
  //if it (coverEncoded) is null then don't do anything
  if (coverEncoded == null) { 
    //return;
    res.redirect(`books/new`)
  }
  //coverEncoded is a string that is actually JSON so we will parse that string  as JSON into a 
  //single JSON object called cover
  //Converts req.body.cover into a single JSON Object
  const cover = JSON.parse(coverEncoded)

  
  //ensures that cover is not null, ensures that coverEncoded includes type which is already encoded to be 
  //png
  try {
    if (cover != null && imageMimeTypes.includes(cover.type)) {
      /*console.log("cover --> " + cover )
      console.log("cover.data --> " + cover.type)
      console.log("cover.data --> " + cover.data )    */
      //converts data which is base64 encoded to a Buffer before assigning
      //second parameter is how we want to convert it from
      book.coverImage = new Buffer.from(cover.data, 'base64')
      //that way we can later extract out this buffer and convert it back into an image of the correct type
      //asigns cover.type to be book.coverImageType in our model
      book.coverImageType = cover.type
    }
      
  } catch {
    res.redirect(`books/new`)
  }

}

//export's information from this file, exports router
module.exports = router