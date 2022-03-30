const mongoose = require('mongoose')
const Book = require('./book')

const authorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  }
})

//pre allows us to run a method before certain actions occur
//.pre(remove, ..)allows us to run any functon we put inside  ... here before actually removing the arthor
//we use a normal function instead of an error function so that we can access the arthor by using next
//the function is going to pass in a call back were it is going to call next and essentially
//if we call this call back then that means our code is going to be ok to  forward unless we pass in error
//to this next call back
authorSchema.pre('remove', function(next) {
    //finds the book for a particular arthor
    //So when if there exist a book with author equal to this arthor's id that means we have books for this arthor
    Book.find({ author: this.id }, (err, books) => {
    //if anything gets returned then we want run the following code
      if (err) {
        //if there is error then we want to pass that error unto the next function. It going to prevent us 
        //from removing anything and it is going to happen if mongoose can connect to the databse for some reason 
      next(err)
      } else if (books.length > 0) {
        //if book is not empty which is books.length > 0 then it means for this particular arthor there books in 
        //the databse hence don't want to delete the arthur.
        //So we call the next function and we are going to pass in an error message
        //The Error prevent th code from actually removing the particular arthor if books exist
         next(new Error('This author has books still'))
      } else {
        //if there is no error and none of these books exist then we
        //tell mongoose that it is ok to continue and actually remove the arthor
        //we call next with absolutely nothing in it
        next()
      }
    })
  })

//const model = mongoose.model("Author", authorSchema)
module.exports = mongoose.model('Author', authorSchema)