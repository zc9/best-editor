import toolbarTpl from '../ui/toolbar.html';
import $ from '../core/$';
import mito from 'mito';
const DEFAULT_TOOLS =  {
    bold: {
        cmd: 'bold',
        title: '粗体',
        icon: '<i class="iconfont icon-bold"></i>'
    },
    italic: {
        cmd: 'italic',
        title: '斜体',
        icon: '<i class="iconfont icon-italic"></i>'
    },
    underline: {
        cmd: 'underline',
        title: '下划线',
        icon: '<i class="iconfont icon-underline"></i>'
    },
    strikethrough: {
        cmd: 'strikethrough',
        title: '删除线',
        icon: '<i class="iconfont icon-strikethrough"></i>'
    },

    link: {
        cmd: 'link',
        title: '插入链接',
        icon: '<i class="iconfont icon-link"></i>'
    },
    image: {
        cmd: 'image',
        title: '插入图片',
        icon: '<i class="iconfont icon-picture"></i>'
    },
    video: {
        cmd: 'video',
        title: '插入视频',
        icon: '<i class="iconfont icon-video"></i>'
    },
    unorderlist: {
        cmd: 'insertUnorderedList',
        title: '无序列表',
        icon: '<i class="iconfont icon-list-ul"></i>'
    },
    orderlist: {
        cmd: 'insertOrderedList',
        title: '有序列表',
        icon: '<i class="iconfont icon-list-ol"></i>'
    },
    h1: {
        cmd: 'formatBlock',
        value: '<H1>',
        title: '标题1',
        icon: '<span>H1</span>'
    },
    h2: {
        cmd: 'formatBlock',
        value: '<H2>',
        title: '标题2',
        icon: '<span>H2</span>'
    },
    h3: {
        cmd: 'formatBlock',
        value: '<H3>',
        title: '标题3',
        icon: '<span>H3</span>'
    },
    h4: {
        cmd: 'formatBlock',
        value: '<H4>',
        title: '标题4',
        icon: '<span>H4</span>'
    },
    alignLeft: {
        cmd: 'justifyLeft',
        title: '左对齐',
        icon: '<i class="iconfont icon-align-left"></i>'
    },
    alignCenter: {
        cmd: 'justifyCenter',
        title: '居中对齐',
        icon: '<i class="iconfont icon-align-center"></i>'
    },
    alignRight: {
        cmd: 'justifyRight',
        title: '右对齐',
        icon: '<i class="iconfont icon-align-right"></i>'
    },
    undo: {
        cmd: 'undo',
        title: '撤销',
        icon: '<i class="iconfont icon-undo"></i>'
    },
    redo: {
        cmd: 'redo',
        title: '重做',
        icon: '<i class="iconfont icon-redo"></i>'
    },
    full: {
        cmd: 'fullscreen',
        title: '全屏',
        icon: '<i class="iconfont icon-full-screen"></i>' 
    }
}
class Toolbar {
    constructor (tools = null) {
        var toolbarStr = null;
        if (tools) {
            if (typeof tools === 'string') {
                toolbarStr = tools;
            } else if (tools instanceof Array) {
                var customTools = {};
                for (var tool of tools) {
                    if (typeof tool === 'string') {
                        customTools[tool] = DEFAULT_TOOLS[tool];
                    } else if (typeof tool === 'object') {
                        for (var k in tool) {
                            customTools[tool] = tool[k];
                        }
                    }
                }
                toolbarStr = mito(toolbarTpl)({tools: customTools});
            } else if (typeof tools === 'object') {
                toolbarStr = mito(toolbarTpl)({tools: tools});
            }
        } else {
            toolbarStr = mito(toolbarTpl)({tools: DEFAULT_TOOLS});
        }
        this.$elem = $(toolbarStr);
    }
}
export default Toolbar;