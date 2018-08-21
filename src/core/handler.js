import $ from '../core/$';
import ListHandle from './handle/list-handle';
import ImageHandle from './handle/image-handle';
import LinkHandle from './handle/link-handle';
import VideoHandle from './handle/video-handle';
import PasteHandle from './handle/paste-handle';

class Handler {
    constructor (bestEditor) {
        this.bestEditor = bestEditor;
        var listHandle = new ListHandle(this);
        var imageHandle = new ImageHandle(this);
        var linkHandle = new LinkHandle(this);
        var videoHandle = new VideoHandle(this);
        var pasteHandle = new PasteHandle(this);
        this.handleMap = {
            'insertUnorderedList': listHandle.handleUnOrderList.bind(listHandle),
            'insertOrderedList': listHandle.handleOrderList.bind(listHandle),
            'image': imageHandle.do.bind(imageHandle),
            'link': linkHandle.do.bind(linkHandle),
            'video': videoHandle.do.bind(videoHandle),
            'paste': pasteHandle.do.bind(pasteHandle),
            'fullscreen': this.handleFullScreen.bind(this),
        }

    }

    addHandle (cmd, handle) {
        this.handleMap[cmd] = handle;
    }

    //handle full screen
    handleFullScreen (event) {
        var $elem = $(event.currentTarget);
        var $i = $elem.find('i');
        if (this.bestEditor.$container.hasClass('full-screen')) {
            this.bestEditor.$container.removeClass('full-screen');
            $i.addClass('icon-full-screen');
            $elem.attr('title', '全屏');
            $i.removeClass('icon-full-screen-exit');   
        } else {
            this.bestEditor.$container.addClass('full-screen');
            $i.removeClass('icon-full-screen');
            $i.addClass('icon-full-screen-exit');
            $elem.attr('title', '退出全屏');
        }
        this.bestEditor.$editor.elems[0].focus();
        this.bestEditor.selection.restore();
    }

    getHandle (cmd) {
        return this.handleMap[cmd];
    }

    execCommand (cmd, value = null) {
        if (value) {
            document.execCommand(cmd, false, value);
        } else {
            document.execCommand(cmd, false, null);
        }
    }

    queryCommandSupported (name) {
        return document.queryCommandSupported(name)
    }

    insertHTML (html) {
        var sel, range;
        if (window.getSelection) {
            // IE9 and non-IE
            sel = window.getSelection();
            if (sel.getRangeAt && sel.rangeCount) {
                range = sel.getRangeAt(0);
                range.deleteContents();
    
                // Range.createContextualFragment() would be useful here but is
                // only relatively recently standardized and is not supported in
                // some browsers (IE9, for one)
                var el = document.createElement('div');
                el.innerHTML = html;
                var frag = document.createDocumentFragment(), node, lastNode;
                while ( (node = el.firstChild) ) {
                    lastNode = frag.appendChild(node);
                }
                range.insertNode(frag);
                // Preserve the selection
                if (lastNode) {
                    range = range.cloneRange();
                    range.setStartAfter(lastNode);
                    range.collapse(true);
                    sel.removeAllRanges();
                    sel.addRange(range);
                }
            }
        } else if (document.selection && document.selection.type != 'Control') {
            // IE < 9
            document.selection.createRange().pasteHTML(html);
        }
    }
}
export default Handler;