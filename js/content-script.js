console.log('这是牛牛content script!');
// 接收来自后台的消息
chrome.runtime.onMessage.addListener( function(request, sender, sendResponse)
{
    const response = {
        code: 0,
        msg: '成功',
        data: null
    }
    console.log(request)
    if (request && request.code === "CURRENT-PAGE-IMG") {
        response.data = imgDownload(request.val)
    }
    console.log(response)
    sendResponse(response)
    // routerHtml('/page/imgDownload.html')
});
function routerHtml(url) {
    window.open(chrome.runtime.getURL('/page/imgDownload.html'));
    // chrome.tabs.query(
    //     {url: chrome.runtime.getURL(url)},
    //     function (e) {
    //         0 === e.length
    //             ? chrome.tabs.create({
    //                 url: chrome.runtime.getURL(url),
    //             })
    //             :  chrome.tabs.update(e[0].id, {active: true});
    //     }
    // );
}
function imgDownload(ele = 'img') {
    let arr = []
    $(ele).each((index , item) => {
        // let response = await fetch(item.src); // 内容转变成blob地址
        // let blob = await response.blob(); // 创建隐藏的可下载链接
        // let objectUrl = await window.URL.createObjectURL(blob);
        arr.push(item.src)
    })
    console.log()
    chrome.storage.local.set({imgArray: arr}, () => {});
}

