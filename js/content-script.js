console.log('这是content script!');
// 接收来自后台的消息
chrome.runtime.onMessage.addListener( function(request, sender, sendResponse)
{
    const response = {
        code: 0,
        msg: '成功',
        data: null
    }
    if (request && request.code === 1) {
        response.data = imgDownload(request.val)
    }
    console.log(response)
    sendResponse(response);
});

function imgDownload(ele = 'img') {
    let arr = []
    $(ele).each(async (index , item) => {
        // let response = await fetch(item.src); // 内容转变成blob地址
        // let blob = await response.blob(); // 创建隐藏的可下载链接
        // let objectUrl = await window.URL.createObjectURL(blob);
        arr.push(item.src)
    })
    // timeIndex = setInterval(() => {
    //     if (timeIndex) {
    //         if (off === $(ele).length) {
    //             chrome.storage.local.set({imgArray: arr}, () => {});
    //             clearInterval(timeIndex)
    //             timeIndex = null
    //         } else {
    //             console.log('异常')
    //         }
    //     }
    // }, 1000)
    chrome.storage.local.set({imgArray: arr}, () => {});
    return arr
}
