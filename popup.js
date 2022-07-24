let javImage = document.getElementById("javImage");
let imagesPreview = document.getElementById("imagesPreview");
let imgDownload = document.getElementById("imgDownload");
let ipSelect = document.getElementById("ip_select")
chrome.storage.sync.get("ip", ({ip}) => {
    if (ip) {
        ipSelect.innerText = ip
    }
});

/*imgDownload.addEventListener("click", function (tab) {
 //   chrome.tabs.executeScript(null, { file: "./page/imgDownload.js" });
 let ele = document.getElementById("postmessage_2079592");
 let imgarr = Array.from(ele.querySelectorAll("img"));
 imgarr.forEach(async (item, index) => {
   if (index !== 0) {
     let response = await fetch(item.src); // 内容转变成blob地址
     let blob = await response.blob(); // 创建隐藏的可下载链接
     let objectUrl = window.URL.createObjectURL(blob);
     let a = document.createElement("a");
     let type = item.src.substring(item.src.lastIndexOf('.'))
     a.href = objectUrl;
     a.innerText = index;
     a.download = item.id + type;
     a.target = "_blank";
     a.click();
     document.body.appendChild(a);
   }
 });
});*/
$('#imgDownload').click(e => {
    // window.open(chrome.runtime.getURL('/page/imgDownload.html'));
    let selectW = '#waterfall img'
    selectW = prompt('设定图片获取范围', selectW)
    sendMessageToContentScript({ code: 1, val: selectW, msg: '图片下载'}, (response) => {
        if(response && response.code === 0) {
            window.open(chrome.runtime.getURL('/page/imgDownload.html'));
        }
    })
    // getCurrentTabId((tabId) => {
    //     if (!tabId) return false
    //     // 注入代码
    //     chrome.scripting.executeScript({
    //             target: {tabId: tabId},
    //             files: ['js/imgDownload.js']
    //         },
    //         () => {
    //             console.log('注入成功')
    //         }
    //     )
    // })
})
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
            if (callback) callback(response);
        });
    });
}

/* javImage.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });
  chrome.scripting.executeScript({
    target: {
      tabId: tab.id,
    },
    function: addNewStyle,
  });
}); */

/* imagesPreview.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });
  chrome.scripting.executeScript({
    target: {
      tabId: tab.id,
    },
    function: () => {
      // 创建蒙层元素
      if (document.getElementById("obscuration-img")) {
        return;
      }
      // 容器
      const ele = document.createElement("div");
      ele.id = "obscuration-img";
      ele.style.width = "100vw";
      ele.style.height = "100vh";
      ele.style.lineHeight = "100vh";
      ele.style.textAlign = "center";
      ele.style.backgroundColor = "rgba(0,0,0,0.7)";
      ele.style.position = "fixed";
      ele.style.top = "0";
      ele.style["zIndex"] = "9999999";
      ele.style.display = "none";
      ele.addEventListener("click", () => {
        ele.style.display = "none";
      });
      document.body.appendChild(ele);
      // 图片
      const imgEle = document.createElement("img");
      imgEle.src = "";
      imgEle.style.maxWidth = "100%";
      imgEle.style.maxHeight = "100%";
      imgEle.style.objectFit = "contain";
      ele.appendChild(imgEle);
      // return;
      // 添加事件
      const imgCollection = Array.from(document.getElementsByTagName("img"));
      imgCollection.forEach((element) => {
        element.onclick = null;
        element.removeAttribute("onclick");
        element.addEventListener("click", ($event) => {
          const vnode = $event.target;
          console.log(vnode.onclick);
          ele.style.display = "block";
          imgEle.src = vnode.src;
        });
      });
    },
  });
}); */

/* function addNewStyle(newStyle) {
  console.log(newStyle);
  newStyle =
    "img {width: 100% !important; object-fit: contain;vertical-align: middle;margin: 0 !important;}";
  var styleElement = document.getElementById("styles_js");
  if (!styleElement) {
    styleElement = document.createElement("style");
    styleElement.type = "text/css";
    styleElement.id = "styles_js";
    document.getElementsByTagName("head")[0].appendChild(styleElement);
  }

  styleElement.appendChild(document.createTextNode(newStyle));
} */

/**
 * 本地公网ip查询
 */
ipSelect.addEventListener("click", () => {
    ipSelect.innerText = '刷新中....'
    let xhr = new XMLHttpRequest();
    xhr.open("GET", 'https://2022.ip138.com/', true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            let reg = /(\d+\.){3}\d/g
            let result = ''
            xhr.responseText.replace(reg, (match) => {
                result = match
                return match
            })
            chrome.storage.sync.set({ip: result});
            ipSelect.innerText = result
        }
    }
    xhr.send();
})
