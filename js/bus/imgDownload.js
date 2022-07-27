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
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
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
                $('.content').append(div)
                imgArray.push(obj)
            })
            $('.img-item').click(itemClick)
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
        boxCheck.origin.x = e.clientX
        boxCheck.origin.y = e.clientY
        boxCheck.ele.css('top', e.clientY + 'px')
        boxCheck.ele.css('left', e.clientX + 'px')
        boxCheck.ele.css('display', 'block')
    })
    $('.content').mousemove((e) => {
        if (!boxCheck.drag) return;
        if (e.clientX < boxCheck.origin.x) {
            boxCheck.ele.css('left', e.clientX + 'px')
            boxCheck.ele.css('width', (boxCheck.origin.x - e.clientX) + 'px')
            boxCheck.end.left = e.clientX
            boxCheck.end.right = boxCheck.origin.x
        } else {
            boxCheck.end.right = e.clientX
            boxCheck.end.left = boxCheck.origin.x
            boxCheck.ele.css('width', (e.clientX - boxCheck.origin.x) + 'px')
        }
        if (e.clientY < boxCheck.origin.y) {
            boxCheck.ele.css('top', e.clientY + 'px')
            boxCheck.ele.css('height', (boxCheck.origin.y - e.clientY) + 'px')
            boxCheck.end.top = e.clientY
            boxCheck.end.bottom = boxCheck.origin.y
        } else {
            boxCheck.end.bottom = e.clientY
            boxCheck.end.top = boxCheck.origin.y
            boxCheck.ele.css('height', (e.clientY - boxCheck.origin.y) + 'px')
        }
    })
    $('.content').mouseup(cancelDrag)
    $('.content').mouseleave(cancelDrag)
    let gainCheck = () => {
        if (!boxCheck.drag) return false;
        $('.img-item').each(function () {
            let off = false
            let obj = this.getBoundingClientRect()
            let x_vertical = {
                x1: obj.left,
                x2: obj.left + obj.width
            }
            let y_crosswise = {
                y1: obj. top,
                y2: obj. top + obj.height
            }
            for(let val in x_vertical) {
                if (boxCheck.end.left <= x_vertical[val] && x_vertical[val] < boxCheck.end.right) {
                    if (boxCheck.end.top <= y_crosswise.y1 && y_crosswise.y1 < boxCheck.end.bottom) {
                        off = true
                    }
                    if (boxCheck.end.top <= y_crosswise.y2 && y_crosswise.y2 < boxCheck.end.bottom) {
                        off = true
                    }
                }
            }
            if (off) {
                itemClick.apply(this)
            }
        })
    }
    function cancelDrag() {
        gainCheck()
        boxCheck.drag = false
        boxCheck.origin.x = 0
        boxCheck.origin.y = 0
        boxCheck.end.top = 0
        boxCheck.end.right = 0
        boxCheck.end.left = 0
        boxCheck.end.bottom = 0
        boxCheck.ele.css('display', 'none')
        boxCheck.ele.css('top', '0px')
        boxCheck.ele.css('left', '0px')
        boxCheck.ele.css('width', '0px')
        boxCheck.ele.css('height', '0px')
    }
})
