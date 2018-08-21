import $ from '../core/$';
import Toolbar from '../core/toolbar';
import Handler from '../core/handler';
import Selection from '../core/selection';
import Request from '../core/request';

class BestEditor {
    constructor (container, opts = {}) {
        this.config = {};
        this.selection = new Selection();
        var $container = $(container);
        this.toolbar = new Toolbar(opts.toolbar);
        var $toolbar = this.toolbar.$elem;
        this.$toolbar = $toolbar;
        $container.append($toolbar);
        $container.addClass('best-editor-container');
        this.$container = $container;
        if (opts.imageUpload) {
            this.config.imageUpload = opts.imageUpload;
        }
        if (opts.imageLinkUpload) {
            this.config.imageLinkUpload = opts.imageLinkUpload;
        }
        //create editor
        var $editor = $('div');
        $editor.attr('contenteditable', true);
        $editor.addClass('best-editor');
        $container.append($editor);
        $editor.append('<p><br></p>');
        this.$editor = $editor;

        $editor.elems[0].focus();
        this.selection.save();
        this.selection.restore();
        
        this.handler = new Handler(this);
        
        this._saveSelectionRealTime();

        this._handleKeyDownEvent();

        this._handleKeyUpEvent();

        this._handleTabEvent();

        this._handlePasteEvent();

        this._handleCmd();
        
        
        console.log('BestEditor Created');
    }

    //handle toolbar cmd
    _handleCmd () {
        var _sel = window.getSelection();
        var _this = this;
       
        this.toolbar.$elem.find('[data-cmd]').bind('mousedown', function (event) {
            _this.selection.save();
            var cmd = $(this).attr('data-cmd');
            var cmdValue = $(this).attr('data-cmd-value');
            
            console.log('command：', cmd, cmdValue);
            var cmdHandle = _this.handler.getHandle(cmd);
            if (cmdHandle) {
                cmdHandle(event);
            } else {
                _this.handler.execCommand(cmd, cmdValue);
            }
            event.preventDefault();
        })
    }

    addHandle (cmd, handle) {
        if (cmd && handle) {
            this.handler.addHandle(cmd, handle);
        }
    }
    getHTML() {
        return this.$editor.html();
    }
    //save the editor selection in real time
    _saveSelectionRealTime () {
        var _this = this;
        function _saveSelection() {
            _this.selection.save();
        }
        this.$editor.bind('keyup', _saveSelection)
        this.$editor.bind('mousedown', function (event) {
            _this.$editor.bind('mouseleave', _saveSelection)
        })
        this.$editor.bind('mouseup', function (event) {
            _saveSelection();
            _this.$editor.unbind('mouseleave', _saveSelection);
        })

    }

   //handle the editor keyup event
    _handleKeyUpEvent () {
        var _this = this;
        this.$editor.bind('keyup', function (event) {

             //handle the editor enter key event
            if(event.keyCode === 13) {
                var selectionElem = _this.selection.getContainerElement();
                var $parentElem = $(selectionElem).parent();
                if (!$parentElem.equal(_this.$editor)) {
                    return;
                }
                
                var tagName = selectionElem.tagName.toUpperCase();
                if (tagName === 'P') {
                    return;
                } else {
                    var text = selectionElem.innerHTML.replace(/<.*?>/g, () => '');
                    var $p = $('<p><br></p>');
                    $p.insertBefore(selectionElem);
                    $p.html(text);
                    _this.selection.createRangeByElement($p.elems[0]);
                    _this.selection.restore();
                    $(selectionElem).remove();
                }
            } 
            if (event.keyCode === 8) {
                var txtHtml = _this.$editor.html().toLowerCase().trim();
                if (!txtHtml || txtHtml === '<br>') {
                    var $p = $('<p><br/></p>')
                    _this.$editor.html('');
                    _this.$editor.append($p);
                    _this.selection.createRangeByElement($p.elems[0], false, true);
                    _this.selection.restore()
                }
            }
        })
    }
    //handle the editor keydown event
    _handleKeyDownEvent () {
        var _this = this;
        this.$editor.bind('keydown', function (event) {

            //handle the editor backspace key event
            if (event.keyCode === 8) {
                if ($(this).html().trim() == '<p><br></p>') {
                    event.preventDefault();
                }
            }
            if (event.keyCode !== 13) {
                var selectionElem = _this.selection.getContainerElement();
                var $selectionElem = $(selectionElem);
                if ($selectionElem.hasClass('image-box')) {
                    event.preventDefault();
                    if (event.keyCode === 8) {
                        _this.selection.createRangeByElement(selectionElem);
                        _this.selection.delete();
                    }
                }
            }
            
        });
    }
    //handle the editor tab key event
    _handleTabEvent () {
        var _this = this;
        this.$editor.bind('keydown', function (event) {
            if (event.keyCode !== 9) {
                return;
            }
            var selectionElem = _this.selection.getContainerElement();
            if (!selectionElem) {
                return;
            }
            _this.handler.insertHTML('&nbsp;&nbsp;&nbsp;&nbsp;');
            event.preventDefault();

        });
    }
    //handle the editor paste event
    _handlePasteEvent () {
        this.$editor.bind('paste', (e) => {
            e.preventDefault();
            this.handler.getHandle('paste')(e);
        });
    }
    
}
export default BestEditor;