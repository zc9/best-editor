import imageUploadTpl from '../../ui/image-upload.html';
import mito from 'mito';
import $ from '../$';
import ImageHandle from './image-handle';

class PasteHandle {
    constructor (context) {
        this.inlineTags = ['label', 'i', 'em', 'span', 'strike', 'u', 'a', 'input', 'font', 'br', 'strong', 'select', 'textarea', 'b'];
        this.context = context;
        this.imageHandle = new ImageHandle(context);
    }
    getPasteText (e) {
        var clipboardData = e.clipboardData || (e.originalEvent && e.originalEvent.clipboardData);
        var pasteText;
        if (clipboardData == null) {
            pasteText = window.clipboardData && window.clipboardData.getData('text');
        } else {
            pasteText = clipboardData.getData('text/plain');
        }
        return pasteText;
    }

    getPasteHTML (e, filterStyle, ignoreImg) {
        var clipboardData = e.clipboardData || (e.originalEvent && e.originalEvent.clipboardData);
        var pasteHTML, pasteText;
        if (clipboardData == null) {
            pasteText  = window.clipboardData && window.clipboardData.getData('text');
        } else {
            pasteHTML = clipboardData.getData('text/html');
            pasteText = clipboardData.getData('text/plain')
        }

        if (!pasteHTML && pasteText) {
            this.contentType = 1;
            pasteHTML = '<p>' + this._replaceHtmlSymbol(pasteText) + '</p>';
            return pasteHTML;
        }
        if (!pasteHTML) {
            return;
        }

        pasteHTML = pasteHTML.replace(/<(meta|script|link).+?>/igm, '');
        pasteHTML = pasteHTML.replace(/<!--.*?-->/mg, '')
        pasteHTML = pasteHTML.replace(/\s?data-.+?=('|").+?('|")/igm, '');
        pasteHTML = pasteHTML.replace(/<\/?(body|html)>/igm, '');
        

        if (ignoreImg) {
            pasteHTML = pasteHTML.replace(/<img.+?>/igm, '');
        }
        if (filterStyle) {
            pasteHTML = pasteHTML.replace(/\s?(class|style)=('|").*?('|")/igm, '');
        } else {
            pasteHTML = pasteHTML.replace(/\s?class=('|").*?('|")/igm, '');
        }
        pasteHTML = this._optimizeHTML(pasteHTML);
        return pasteHTML;
    }
    do (e) {
 
        var selectionElem = this.context.bestEditor.selection.getContainerElement();
        var text = selectionElem.innerText.trim();
        var html = this.getPasteHTML(e, true, false);
        
        if (this.contentType === 1) {
            this.context.insertHTML(html);
            return;
        }
        if (text.length === 0) {
            $(selectionElem).remove();
        }
        this.context.insertHTML(html);
        
        if (this.context.bestEditor.config.imageLinkUpload) {
            var $imageBoxs = this.context.bestEditor.$editor.find('.image-box');
            var $imageBoxsArr = [];
            if ($imageBoxs.elems.length > 0) {
                for (var imageBox of $imageBoxs.elems) {
                    $imageBoxsArr.push($(imageBox));
                }
            }
            if ($imageBoxsArr.length > 0) {
                this.imageHandle._uploadImages(2, $imageBoxsArr);
            }
        }
        
    }
    _hasBlockTag (elem) {
        for (var i = 0; i < elem.children.length; i++) {
            var child = elem.children[i];
            var nodeName = child.nodeName.toLowerCase();
            if (this.inlineTags.indexOf(nodeName) === -1) {
                return true;
            }
        }
        return false;
    }
	_getElementStr (elem) {
		var strArr = [];
		for (var i = 0; i < elem.childNodes.length; i++) {
			var node = elem.childNodes[i];
			if (node.nodeType === 3) {
				var text = node.nodeValue.trim();
				if (text.length > 0) {
					strArr.push(text);
				}
				
			} else if (node.nodeType === 1) {
                var nodeName = node.nodeName.toLowerCase();
                if (this.inlineTags.indexOf(nodeName) !== -1 && !this._hasBlockTag(node)) {
					if (node.innerText.length > 0) {
						strArr.push(node.outerHTML);
					}
                }
			}
		}
		if (strArr.length > 0) {
            var nodeName = elem.nodeName.toLowerCase();
            if (nodeName === 'div') {
                nodeName = 'p';
            }
			return '<' + nodeName + '>' + strArr.join('') + '</' + nodeName + '>';
		}
		return '';
    }
	
	_optimizeDom (elem) {
		var strArr = [];
		var str = this._getElementStr(elem);
		if (str.length > 0) {
			strArr.push(str);
		}
		for (var i = 0; i < elem.children.length; i++) {
			var child = elem.children[i];
			var nodeName = child.nodeName.toLowerCase();
            if (this.inlineTags.indexOf(nodeName) === -1 || this._hasBlockTag(child)) {
				if (nodeName === 'img') {
                    if (!this.context.bestEditor.config.imageLinkUpload) {
                        strArr.push(`<div class="image-box"><img src="${child.src}"><br></div>`);
                    } else {
                        var imageUpload = mito(imageUploadTpl)({imageUrl: child.src});
                        strArr.push(`<div class="image-box">${imageUpload}</div>`);
                    }
				} else {
					str = this._optimizeDom(child);
					if (str.length > 0) {
						strArr.push(str);
					}
				}
			}
		}
		return strArr.join('');
	}
	
	
	_optimizeHTML (html) {
		var divElem = document.createElement('div');
		divElem.innerHTML = html;
		return this._optimizeDom(divElem);
	}
    
    _replaceHtmlSymbol (html) {
        return html.replace(/</gm, '&lt;')
                .replace(/>/gm, '&gt;')
                .replace(/"/gm, '&quot;')
                .replace(/(\r\n|\r|\n)/g, '<br>');
    }
}
export default PasteHandle;