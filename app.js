//npm init/ npm init -y   npm i express mongoose  npm i --save-dev dotenv nodemon  npm i express ejs express-ejs-layouts

//nodemon automatically refresh our server
//.env has environmental variables which we can pull from
//you want .gitignore to ignore .env since it contains sensitive information
// also .gitignore to ignore node_moles since it can easily be creatd by running npm install 
//whenever you download the code from git

//checks if we are running in the production environment or locally on our computer
//tells our applicatio to look into .env if are not running in the production environment
if(process.env.NODE_ENV != "production"){
    require("dotenv").config()
}

const express = require("express")
const server = express()
const methodOverride = require('method-override') //allows us to use delete and put request in our routes
const expressLayouts = require("express-ejs-layouts")
const indexRouter = require("./routes/index") //import the route 'index' that we created
const authorRouter = require("./routes/authors") 
const bookRouter = require("./routes/books") 
const mongoose = require("mongoose") 
 
const bodyParser = require("body-parser")

//use _method becsause this unlikely to be a name of an input on your form. Beacuse this is going to send as if it was 
//an input on  your form of _method and this were you going to put either the put or delete in your form.
//We will see that when we start creating our edit and delete form
server.use(methodOverride("_method"))

//process.env.DATAASE_URL , makes mongoo dependent on a url which is going to come from our environment variables
//useNewUrlParser: true , options for how we want set up mongoDB inside of our application
mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true})
const db = mongoose.connection //db variable is created so that we can log if we are / are not connected to our database.
db.on("error", error => console.error (error)) //prints out error if we run into an error while connecting to database
db.once("open", () => console.log("Connected to Mongoose")) //runs only one time when we open up our database for the first time

server.set("view engine", "ejs") //sets ejs as our view engine
//'__dirname' I think it means look into folder current directory a url extension
//the default file/folder that ejs looks for to render pages is named "views" so you are telling it to find in a different folder 
//that uou have also named views
//Here you could have named it differently also
server.set("views", __dirname + "/views") //sets where our views will be coming from 'currentdirectory/views'
//sets where our layout file is going to be. The idea of the layout file is that 
//every single file is going to be put in this layout file so we don't have to 
//duplicate all of the beginning html and ending html of our project such as the header and the footer
//The default file that ejs looks for inside of views to render every other page is named "layout"
//so you ae telling it to find it in a different folder that you have alos named  layout
//Here you could have named it differently
server.set("layout", "layouts/layout")
server.use(expressLayouts) //tells the express applcation that we are going to use expressLayouts
server.use(express.static("public")) //tells express where our public files such as style shit,js of our images is going to be

/**HERE is a critical part to understanding web development.
 * After the creating the various Router variables ()
 */
server.use("/", indexRouter) //creates a root "/" and tells indexRouter to handle that root, server uses it
server.use("/authors", authorRouter)
server.use("/books", bookRouter)

//server.use(bodyParser.json({ limit: "100mb"}))
//server.use(express.urlencoded({extended: true, limit: "500mb", parameterLimit: 100000 }))
server.use(bodyParser.urlencoded({extended: true, limit: "500mb", parameterLimit: 100000 }))

//sets up our server to listen on the port that we want it to
//server.listen takes a single function that we will if there is an error potentially
//as soon as our server start listening it will call this function, it will either pass an error or nothing if it was successful
//process.env.PORT pulls from the environment variable for when we deploy or on our deafault 3000 for development
server.listen(process.env.PORT || 3000, function(error) {
    //delete this later
    if(error){
        console.log('Something went wrong', error) //pass error to th clog thread statment so that when check our log we can see the error that happen
    } else {
        console.log('Server is listening on port' + 3000)
    }
})