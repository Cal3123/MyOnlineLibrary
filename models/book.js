const mongoose = require('mongoose')
//** No longer need coverImageBasePath
//here is the upload path inside of our project where all of our coverImages is going to be stored
//we want to store that inside of our uploads/bookCovers folder which is going to be inside of our public folder
//const coverImageBasePath = "uploads\bookCovers"
//** No longer need to do this function
//to actually return the path inside our file structure we will need this
//const path = require("path")

const bookSchema = new mongoose.Schema({
    //book has a title, description, a date, and pagecount counts the number of books created
    //book also auttomayically stores the Date it was created
    title: {
        type: String,
        required: true
      },
      description: {
        type: String
      },
      publishDate: {
        type: Date,
        required: true
      },
      pageCount: {
        type: Number,
        required: true
      },
      createdAt: {
        type: Date,
        required: true,
        default: Date.now
      },
    //the image itself will be stored on the server in the file system. 
    //This is to store the cover image itself as a buffer representing our entire image
    coverImage: {
        type: Buffer,
        required: true
    },
    //In order to render the coverImage we need to know what type image it is
    coverImageType: {
        type: String,
        required: true
    },
    //every book has an author so we create an author type for every book object
    author: {
        //this references/links book to the author created in models  
        //this tells mongoose that book references another object(author) inside of our collection
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        //tells mongoose what we are referencing, the author collection in our database
        ref: 'Author'
    }
})

//**We don't need this anymore becuase coverImageName is now stored differently
//this is a vrirtual property named "coverImagePath" that derives it's value from the book variables and
//has at get function attached to it, using a nprmal function instead of an error function because we need
//have access to the 'this' property which is going to link to the actual book itself
// bookSchema.virtual('coverImagePath').get(function() {
//     //checks if this book actually has a cover Image applied to it
//     //then if it has, then we waant actually return the path inside our file structure
//     if (this.coverImageName != null) {
//       return path.join('/', coverImageBasePath, this.coverImageName)
//     }
//   })

//converts our coverImage (~cover.data) and coverImageType(~cover.type) into an actaul usable source(image) 
//to display
bookSchema.virtual('coverImagePath').get(function() {
    if (this.coverImage != null && this.coverImageType != null) {
        //returns the source of our image object
        //we goig to use a temple string literal here so that we can actually use variables inside of it
        //and something in html that we can use is called a data object . This data object that we can use
        //as a source for images allows us to take buffer data essentially and use that as that as the 
        //actual source for our image.
        //data:${datatype};charset= tell it the charset; how it is encoded,${puts the actual data inside of here 
        //as base 64 encoded }`
        //this returns the proper string for our image source in order to display the image from our buffer and type
        return `data:${this.coverImageType};charset=utf-8;base64,${this.coverImage.toString('base64')}`
    }
  })

//** No longer need to export coverImageBasePath
// we want to export the varaiable coverImageBasePath down here, not as a default, but as a name variable 
//and set it it to coverImageBasePath
//module.exports.coverImageBasePath = coverImageBasePath

module.exports = mongoose.model('Book', bookSchema)