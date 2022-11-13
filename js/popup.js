
// 监听来自content-script的消息
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.log('收到来自content-script的消息：');
    console.log(request, sender, sendResponse);
    sendResponse('我是popup，我已收到你的消息：' + JSON.stringify(request));
});

// 获取当前选项卡的id
function getCurrentTabId(callback) {
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        if (callback) callback(tabs.length ? tabs[0].id : null);
    });
}

// 向content-script主动发送消息
function sendMessageToContentScript(message, callback) {
    getCurrentTabId((tabId) => {
        chrome.tabs.sendMessage(tabId, message, function (response) {
            console.log(response)
            if (callback) callback(response);
        });
    });
}

$(() => {
    chrome.storage.sync.get("ip", ({ip}) => {
        if (ip) {
            $("#ip_select").text('公网IP:' + ip)
        }
    });
    // UI 初始化
    $(".btn").button();
    // 公网IP
    $("#ip_select").click(function () {
        this.innerText = '刷新中....'
        let xhr = new XMLHttpRequest();
        xhr.open("GET", 'https://2022.ip138.com/', true);
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                let reg = /(\d+\.){3}\d/g
                let result = ''
                xhr.responseText.replace(reg, (match) => {
                    result = match
                    return match
                })
                chrome.storage.sync.set({ip: result});
                this.innerText = '公网IP:' + result
            }
        }
        xhr.send();
    })
    // 图片批量下载
    $('#imgDownload').click(e => {
        let selectW = '#waterfall img'
        selectW = prompt('设定图片获取范围', selectW)
        if (selectW) {
            sendMessageToContentScript({ code: 'CURRENT-PAGE-IMG', val: selectW, msg: '图片下载'}, (res) => {
                console.log(res)
                window.open(chrome.runtime.getURL('/page/imgDownload.html'));
            })
            // chrome.runtime.sendMessage({ code: 'CURRENT-PAGE-IMG', val: selectW, msg: '图片下载'});
        }
    })
})
