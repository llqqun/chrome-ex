let javImage = document.getElementById("javImage");
let imagesPreview = document.getElementById("imagesPreview");

chrome.storage.sync.get("color", ({
    color
}) => {
    changeColor.style.backgroundColor = color;
});

javImage.addEventListener("click", async () => {
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

imagesPreview.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true
    });
    chrome.scripting.executeScript({
        target: {
            tabId: tab.id
        },
        function: () => {
            // 创建蒙层元素
            if (document.getElementById('obscuration-img')) {
                return;
            }
            // 容器
            const ele = document.createElement('div')
            ele.id = 'obscuration-img'
            ele.style.width = '100vw'
            ele.style.height = '100vh'
            ele.style.lineHeight = '100vh'
            ele.style.textAlign = 'center'
            ele.style.backgroundColor= 'rgba(0,0,0,0.7)'
            ele.style.position= 'fixed'
            ele.style.top= '0'
            ele.style['zIndex']= '9999999'
            ele.style.display = 'none'
            ele.addEventListener('click',() => {
                ele.style.display = 'none'
            })
            document.body.appendChild(ele)
            // 图片
            const imgEle = document.createElement('img')
            imgEle.src= ''
            imgEle.style.maxWidth= '100%'
            imgEle.style.maxHeight= '100%'
            imgEle.style.objectFit= 'contain'
            ele.appendChild(imgEle)
            // return;
            // 添加事件
            const imgCollection = Array.from(document.getElementsByTagName('img'))
            imgCollection.forEach(element => {
                element.onclick = null
                element.removeAttribute('onclick')
                element.addEventListener('click', ($event) => {
                    const vnode = $event.target
                    console.log(vnode.onclick)
                    ele.style.display = 'block'
                    imgEle.src = vnode.src
                })
            })
        },
    });
})

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