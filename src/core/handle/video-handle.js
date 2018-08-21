import $ from '../$';
import videoDialogTpl from '../../ui/video-dialog.html';

class ImageHandle {
    constructor (context) {
        this.context = context;
    }
    do () {
        this.type = 1;
        this._create();
        this.bindEvent();
    }
    _create () {
        this.$elem = $(videoDialogTpl);
        $('body').append(this.$elem);
    }
    bindEvent () {
        var _this = this;
        var $uploadBtn = this.$elem.find('.upload-btn');
        var $inputBox = this.$elem.find('.input-box');
        var $confirm = this.$elem.find('.confirm');

        this.$elem.find('.close').bind('click', function (event) {
            _this._destroy();
        })
        this.$elem.find('.cancel').bind('click', function (event) {
            _this._destroy();
        })

    
        var $linkInput = this.$elem.find('#linkInput');

        var $waringTxt = this.$elem.find('.waring-txt');

        $confirm.bind('click', function (event) {
            var link = $linkInput.val();
            if (!link.length) {
                $waringTxt.text('视频链接不能为空');
            } else {
                _this._destroy();
                _this._insertVideo(link);
            }
        })

    }

    _insertVideo (link) {
        console.log('_insertVideo');
        this.context.execCommand('insertHTML', link);
    }

    _destroy () {
        this.$elem.remove();
        this.context.bestEditor.selection.restore();
    }

}
export default ImageHandle;