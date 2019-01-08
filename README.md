# 概述

一款简洁实用的web富文本编辑器，拥有着现代化UI风格的界面。比现有的富文本编辑器多了一些特色功能。图片上传，支持本地和链接，且拥有图片上传状态预览框。文章粘贴做了格式优化，并支持图片上传到自己的服务器。

[![](https://raw.githubusercontent.com/zc9/best-editor/master/demo/ui1.jpg)](https://raw.githubusercontent.com/zc9/best-editor/master/demo/ui1.jpg)

# 文档
- 说明文档参考 [Wiki](https://github.com/zc9/best-editor/wiki)  
# 下载安装
- 直接下载：[https://github.com/zc9/best-editor/releases](https://github.com/zc9/best-editor/releases)
- `npm`下载：`npm install --save best-editor` 

# 配置项
1. 配置项在创建BestEditor对象时第二个参数给定，类型：object。
2. imageUpload：本地图片上传接口。 post方式。 数据类型：multipart/form-data。  服务器接收字段：file。 返回：json对象 {code: 0, data:图片链接}
3. 图片链接上传接口。get方式。 服务器接受imageUrl字段。 返回：json对象 {code: 0, data:图片链接}
4. toolbar：工具栏配置。数据类型：数组。（bold: 粗体，italic: 斜体，underline: 下划线，strikethrough: 删除线，link: 链接，image: 图片，video: 视频，unorderlist: 无序列表，orderlist: 有序列表，h1: 标题1，h2: 标题2，h3: 标题3，h4: 标题4，alignLeft: 左对齐，alignCenter: 居中对齐，alignRight: 右对齐，undo: 撤销，redo: 重做，full: 全屏）

# 运行环境

目前测试的环境：edge、ie10、chrome。建议运行在基于webkit内核的浏览器上，拥有更好的体验。
