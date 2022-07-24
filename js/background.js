// 添加一个事件监听器
let version = '0.0.1'
chrome.runtime.onInstalled.addListener(() => {
    console.log('运行')
    chrome.storage.sync.set({ version });
    // 清除规则
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function(){
        // 添加规则
        // chrome.declarativeContent.onPageChanged.addRules([
        //     {
        //         id: 'demo1',
        //         conditions: [
        //             new chrome.declarativeContent.PageStateMatcher({pageUrl: {urlContains: 'baidu.com'}})
        //         ],
        //         actions: [new chrome.declarativeContent.SetIcon({imageData: ''})]
        //     }
        // ]);
    });
});
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log(request, sender, sendResponse)
    sendResponse('我是后台，我已收到你的消息：' + JSON.stringify(request));
})
