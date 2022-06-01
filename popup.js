let changeColor = document.getElementById("changeImages");

chrome.storage.sync.get("color", ({
    color
}) => {
    changeColor.style.backgroundColor = color;
});

changeColor.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true
    });
    chrome.scripting.executeScript({
        target: {
            tabId: tab.id
        },
        function: addNewStyle,
    });
});


function addNewStyle(newStyle) {
    console.log(newStyle)
    newStyle = 'img {width: 100% !important; object-fit: contain;vertical-align: middle;margin: 0 !important;}'
    var styleElement = document.getElementById('styles_js');
    if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.type = 'text/css';
        styleElement.id = 'styles_js';
        document.getElementsByTagName('head')[0].appendChild(styleElement);
    }

    styleElement.appendChild(document.createTextNode(newStyle));
}