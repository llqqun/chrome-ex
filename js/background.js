
let version = '0.0.1'
chrome.runtime.onInstalled.addListener(() => {
    console.log('常驻后台服务')
    chrome.storage.sync.set({version});
});
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.code) {
        switch (request.code) {
            case 'CURRENT-PAGE-IMG' :
                imgDownload(request.val)
                routerHtml('/page/imgDownload.html')
                break;
        }
    }
})

function routerHtml(url) {
    chrome.tabs.query(
        {url: chrome.runtime.getURL(url)},
        function (e) {
            0 === e.length
                ? chrome.tabs.create({
                        url: chrome.runtime.getURL(url),
                    })
                :  chrome.tabs.update(e[0].id, {active: true});
        }
    );
}
function imgDownload(ele = 'img') {
    let arr = []
    $(ele).each(async (index , item) => {
        // let response = await fetch(item.src); // 内容转变成blob地址
        // let blob = await response.blob(); // 创建隐藏的可下载链接
        // let objectUrl = await window.URL.createObjectURL(blob);
        arr.push(item.src)
    })
    chrome.storage.local.set({imgArray: arr}, () => {});
}
