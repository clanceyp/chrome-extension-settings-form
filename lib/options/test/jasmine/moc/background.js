//chrome.runtime.getManifest()
//chrome.extension.getBackgroundPage()
var chrome = {
    extension : {
        getBackgroundPage: function(){
            return {
                options : window.options
            }
        }
    },
    runtime : {
        getManifest : function(){
            return {
                name: "Extension name",
                version: "0.0.0"
            }
        }
    }
}