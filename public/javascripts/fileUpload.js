const  rootStyles = window.getComputedStyle(document.documentElement)

if(rootStyles.getPropertyValue("--book-cover-width-large") != null 
    && rootStyles.getPropertyValue("--book-cover-width-large") !== ""){
    ready()
} else {
    document.getElementById("main-css").addEventListener("load", ready)
}

function ready() {
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