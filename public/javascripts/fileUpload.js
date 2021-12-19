//registerPlugin method allows plugins (in layout page) to be registered with Filepond
FilePond.registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginImageResize,
    FilePondPluginFileEncode,
)

//allows us to setOptions for all our filepond instances. Method of filpond object
FilePond.setOptions({
    stylePanelAspectRatio: 150 /  100,
    //below are properties of image-resize plugin of filepond
    imageResizeTargetWidth: 100,
    imageResizeTargetHeight: 150
})

//turns all file inputs in our entire page into filepond inputs
FilePond.parse(document.body);