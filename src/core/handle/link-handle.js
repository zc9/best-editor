import $ from '../$';
import linkDialogTpl from '../../ui/link-dialog.html';

class LinkHandle {
    constructor (context) {
        this.context = context;
    }
    do () {

        this._create();
        this.bindEvent();
    }
    _create () {
        this.$elem = $(linkDialogTpl);
        $('body').append(this.$elem);
        this.selectionElem = null;
    }
    bindEvent () {
        var _this = this;
        
        var $confirm = this.$elem.find('.confirm');

        this.$elem.find('.close').bind('click', function (event) {
            _this._destroy();
        })
        this.$elem.find('.cancel').bind('click', function (event) {
            _this._destroy();
        })

        
        var $linkInput = this.$elem.find('#linkInput');
        var $linkText = this.$elem.find('#linkText');
        var $waringTxt = this.$elem.find('.waring-txt');

        var selectionElem = this.context.bestEditor.selection.getContainerElement();
        
        if (selectionElem) {
            if (/^a$/i.test(selectionElem.tagName)) {
                this.selectionElem = selectionElem;
                $linkText.val(selectionElem.innerText);
                $linkInput.val(selectionElem.href);
            } else {
                $linkText.val(this.context.bestEditor.selection.getText());
            }
        }

        $confirm.bind('click', function (event) {
            
            var link = $linkInput.val();
            var linkText = $linkText.val();
            if (!link.length) {
                $waringTxt.text('链接地址不能为空');
            } else if (!linkText.length) {
                $waringTxt.text('链接文本不能为空');
            } else {
                _this._destroy();
                _this._insertLink(link, linkText);
            }
        })
    }

    _insertLink (link, linkText) {

        if (this.selectionElem) {
            this.context.bestEditor.selection.createRangeByElement(this.selectionElem);
            this.context.bestEditor.selection.delete();
        }
        this.context.bestEditor.selection.restore();
        this.context.insertHTML(`<a href="${link}" target="_blank">${linkText}</a>`)
       
    }

    _destroy () {
        this.$elem.remove();
        this.context.bestEditor.selection.restore();
    }

}
export default LinkHandle;