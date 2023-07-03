
console.log('CSDN插件注入');

const ele = document.querySelector('#content_views')
if (ele) {
    ele.addEventListener('copy', (event) => {
        console.log('拦截复制事件');
        event.stopImmediatePropagation()
    }, { capture: true, useCapture: true })
}

