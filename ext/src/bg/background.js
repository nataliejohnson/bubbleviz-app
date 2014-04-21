// if you checked "fancy-settings" in extensionizr.com, uncomment this lines

// var settings = new Store("settings", {
//     "sample_setting": "This is how you use Store.js to remember values"
// });


//example of using a message handler from the inject scripts
chrome.extension.onMessage.addListener(function(request, sender, sendResponse){
  if(request.url){
    $.getJSON("http://bubbleviz.herokuapp.com/api/anon-search", {url: request.url}, function(data){
      console.log(data);
    });
    console.log("Request: ", request);
  }
  sendResponse({hello:"back"});
});
