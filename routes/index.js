const express = require("express")
const router = express.Router() //creates the router portion of the express variable

router.get("/", (req, res) =>{
    //sends a response
    res.render("index")
})

//exportsa information from this file, exports router
module.exports = router