$(() => {
    let defaultName = 'image'
    let imgArray = []
    let boxCheck = {
        ele: $('#check-box'),
        drag: false,
        origin: {
            x: 0,
            y: 0
        },
        end: {
            x: 0,
            y: 0
        }
    }
    chrome.storage.local.get(['imgArray'], (result) => {
        if (result.imgArray && result.imgArray.length) {
            result.imgArray.forEach((item, index) => {
                let obj = {
                    index: index,
                    src: item,
                    select: true
                }
                let div = document.createElement('div')
                div.className = 'img-item'
                div.dataset.index = index
                let img = document.createElement('img')
                img.src = item
                div.appendChild(img)
                $(div).click(itemClick)
                $('.content').append(div)
                imgArray.push(obj)
            })
        }

    });

    $('.download-btn').click(() => {
        imgArray.map(async (item, index) => {
            if (item.select) {
                let response = await fetch(item.src); // 内容转变成blob地址
                let blob = await response.blob(); // 创建隐藏的可下载链接
                let objectUrl = window.URL.createObjectURL(blob);
                let type = item.src.substring(item.src.lastIndexOf('.'))
                let timeObj = setTimeout(() => {
                    let a = document.createElement('a');
                    a.href = objectUrl;
                    a.download = defaultName + type;
                    a.target = '_blank';
                    a.click();
                    a.remove()
                    clearTimeout(timeObj)
                }, 1000 * index)
            }
        })
    })
    function itemClick () {
        let index = $(this).data().index
        if ($(this).hasClass('cancel')) {
            $(this).removeClass('cancel')
            imgArray[index].select = true
        } else {
            $(this).addClass('cancel')
            imgArray[index].select = false
        }
    }
    $('.all-btn').click(() => {
        $('.img-item').removeClass('cancel')
        imgArray.forEach(item => {
            item.select = true
        })
    })
    $('.opposite-btn').click(() => {
        $('.img-item').each(function(index, content) {
            itemClick.apply(content)
        })
    })
    $('.content').mousedown((e) => {
        boxCheck.drag = true
        boxCheck.origin.x = e.offsetX
        boxCheck.origin.y = e.offsetY
        boxCheck.ele.css('top', e.offsetY + 'px')
        boxCheck.ele.css('left', e.offsetX + 'px')
        boxCheck.ele.css('display', 'block')
    })
})
