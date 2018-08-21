import $ from '../$';
class ListHandle {
    constructor (context) {
        this.context = context;
    }
    handleUnOrderList () {
        this._handleList('unorder');
    }

    handleOrderList () {
        this._handleList('order');
    }

    _handleList (flag) {
        if (flag === 'unorder') {
            this.context.execCommand('insertUnorderedList');
        } else {
            this.context.execCommand('insertOrderedList');
        }
        this.context.bestEditor.selection.save();
        
        var bestEditor = this.context.bestEditor;
        
        //fix ul wrapper
        var selectionElem = bestEditor.selection.getContainerElement();
        console.log(selectionElem)
        var $selectionElem = $(selectionElem);
        if (/^li$/i.test(selectionElem.tagName)) {
            $selectionElem = $selectionElem.parent();
        }
        if (!/^ol|ul$/i.test($selectionElem.elems[0].tagName)) {
            return;
        }
        var $parent = $selectionElem.parent()
        if ($parent.equal(bestEditor.$editor)) {
            return;
        }
        $selectionElem.insertAfter($parent);
        $parent.remove();
        
    }
}
export default ListHandle;