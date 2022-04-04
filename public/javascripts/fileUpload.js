/*Note that since we are using import inside of our css. The imported css actually get loaded after our main css gets loaded
and after the document gets loaded. So when when fileUpload javascript runs the css inside the book css will not be loaded yet.
So we need to make sure to account for that. The easisest way to do that is first we want check and get the CSS style for our root 
styles. rootStyles is going to be our main css. Essentially rootStyles is going to be getting all the styles from th root  element
of our document which is goint to be all the styles inside of the root tag in book css. I think it gets every root tag including the one in book css  */
/*This parseses documentElement to rootStyle once the whole document is loaded (including maain.css)  */
const  rootStyles = window.getComputedStyle(document.documentElement)

/*Checks to see if rootStyles has propertyvalue in () is not null && "" then we call the ready() function*/
/*The reason why we have to have this check here is to make sure that we are actually ready to use getPropertyValue as a result if
root styles has not been loaded yet the ready() funtion won't be called*/
if(rootStyles.getPropertyValue("--book-cover-width-large") != null 
    && rootStyles.getPropertyValue("--book-cover-width-large") !== ""){
    /*This only runs after document is loaded */
    ready()
} else {
    /*This code calls the ready function once a single file is loaded*/
    /*getElementById gets main.css file via the id selctor in /views/layout/layout.ejs. And once the main.css
    file is gotten aka loaded the ready() function is called */
    document.getElementById("main-css").addEventListener("load", ready)
}

function ready() {
    /*We dynamically get or extract values from rootStyles. Values in our book.css */
    /*The variables in *() returns as strings so we need parse it as float to convert it to a float number. */
    const coverWidth = parseFloat(rootStyles.getPropertyValue("--book-cover-width-large"))
    const coverAspectRatio = parseFloat(rootStyles.getPropertyValue("--book-cover-aspect-ratio"))
    const coverHeight = coverWidth/coverAspectRatio
    //registerPlugin method allows plugins (in layout page) to be registered with Filepond
    FilePond.registerPlugin(
        FilePondPluginImagePreview,
        FilePondPluginImageResize,
        FilePondPluginFileEncode,
    )

    //allows us to setOptions for all our filepond instances. Method of filpond object
    FilePond.setOptions({
        stylePanelAspectRatio: 1/coverAspectRatio,
        //below are properties of image-resize plugin of filepond
        imageResizeTargetWidth: coverWidth,
        imageResizeTargetHeight: coverHeight
    })

    //turns all file inputs in our entire page into filepond inputs
    FilePond.parse(document.body);
}