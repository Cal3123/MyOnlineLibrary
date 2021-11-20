const mongoose = require("mongoose")

//here is the upload path inside of our project where all of our coverImages is going to be stored
//we want to store that inside of our uploads/bookCovers folder which is going to be inside of our public folder
const coverImageBasePath = "uploads\bookCovers"
//to actually return the path inside our file structure we will need this
const path = require("path")

const bookSchema = new mongoose.Schema({
    //book has a title, description, a date, and pagecount counts the number of books created
    //book also auttomayically stores the Date it was created
    title:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    publishDate:{
        type: Date,
        required: true
    },
    pageCount:{
        type: Number,
        required: true
    },  
    createdAt:{
        type: Date,
        required: true,
        default: Date.now
    },
    //the image itself will be stored on the server in the file system. 
    //This is to store the name of the image as string in database
    coverImageName: {
        type: String,
        required : true
    },
    //every book has an author so we create an author type for every book object
    author: {
        //this references/links book to the author created in models  
        //this tells mongoose that book references another object(author) inside of our collection
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        //tells mongoose what we are referencing, the author collection in our database
        ref: "Author"
    }
})

//this is a vrirtual property named "coverImagePath" that derives it's value from the book variables and
//has at get function attached to it, using a nprmal function instead of an error function because we need
//have access to the 'this' property which is going to link to the actual book itself
bookSchema.virtual('coverImagePath').get(function() {
    //checks if this book actually has a cover Image applied to it
    //then if it has, then we waant actually return the path inside our file structure
    if (this.coverImageName != null) {
      return path.join('/', coverImageBasePath, this.coverImageName)
    }
  })
// we want to export the varaiable coverImageBasePath down here, not as a default, but as a name variable 
//and set it it to coverImageBasePath
module.exports.coverImageBasePath = coverImageBasePath

module.exports = mongoose.model("Book", bookSchema)