(function(){
    console.log('草榴自定义插件');
    const contentList = document.querySelectorAll('.tpc_content')
    Array.from(contentList).forEach(element => {
        element.className = 'cl-content'
    });
})()