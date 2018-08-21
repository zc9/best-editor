# bestEditor
### 一款简洁实用的H5富文本编辑器，拥有着现代化UI风格的界面。比现有的富文本编辑器多了一些特色功能，图片上传，支持本地和链接，拥有上传状态的预览框。文章粘贴做了内容上的优化，支持图片上传到自己的服务器并替换之。

# 快速开始
<pre><code>
<div id="editor"></div>var bestEdtitor = new BestEditor('#editor', {
            imageUpload: 'http://127.0.0.1:2000/image/upload',
            imageLinkUpload: 'http://127.0.0.1:2000/image/upload1'
        });</code></pre>
# 运行环境
### 目前测试的环境：edge、ie10、chrome。建议运行在基于webkit内核的浏览器上，拥有更好的体验。