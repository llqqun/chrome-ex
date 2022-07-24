$(function () {
    console.log('图片批量下载功能')
    const win = window.opener
    let defaultName = 'image'
    let imgArray = null
    chrome.storage.local.get(['imgArray'], (result) => {
        console.log(result)
        imgArray = result.imgArray
        imgArray.forEach(item => {
            let div = document.createElement('div')
            div.className = 'img-item'
           let img = document.createElement('img')
            img.src = item
            div.appendChild(img)
            $('.content').append(div)
        })
    });
    $('.download-btn').click(() => {
        imgArray.map(async (item, index) => {
            let response = await fetch(item); // 内容转变成blob地址
            let blob = await response.blob(); // 创建隐藏的可下载链接
            let objectUrl = window.URL.createObjectURL(blob);
            let type = item.substring(item.lastIndexOf('.'))
            let timeObj = setTimeout(() => {
                let a = document.createElement('a');
                a.href = objectUrl;
                a.download= defaultName + type;
                a.target = '_blank';
                a.click();
                a.remove()
                clearTimeout(timeObj)
            }, 1000 * index)
        })
    })
})

