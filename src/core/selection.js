class Selection {
    constructor () {
        this._curRange = null;
        this._context = window.getSelection();
    }

    save (range) {
        
        if (range) {
            this._curRange = range;
            return;
        }

        var selection = this._context;
        if (selection.rangeCount === 0) {
            return;
        }

        range = selection.getRangeAt(0);
        this._curRange = range;
    }

    getCurrentRange () {
        return this._curRange;
    }

    restore () {
        var selection = this._context;
        selection.removeAllRanges();
        selection.addRange(this._curRange);
    }

    getText () {
        var range = this._curRange;
        if (range) {
            return this._curRange.toString();
        } else {
            return '';
        }
    }

    getContainerElement (range) {
        range = range || this._curRange;
        if (range) {
            var elem = range.commonAncestorContainer;
            return elem.nodeType === 1 ? elem : elem.parentNode;
        }
        return null;
    }
    getStartElement (range) {
        range = range || this._curRange;
        if (range) {
            var elem = range.startContainer;
            return elem.nodeType === 1 ? elem : elem.parentNode;
        }
        return null;
    }
    getEndElement (range) {
        range = range || this._curRange;
        if (range) {
            var elem = range.endContainer;
            return elem.nodeType === 1 ? elem : elem.parentNode;
        }
        return null;
    }

    createRangeByElement (elem, toStart = null, isContent = false) {
        var range = document.createRange();
        if (isContent) {
            range.selectNodeContents(elem);
        } else {
            range.selectNode(elem);
        }
        if (typeof toStart === 'boolean') {
            range.collapse(toStart);
        }
        this.save(range);
    }

    delete () {
        var range = this._curRange;
        if (range) {
            range.deleteContents();
            this.save();
        }
    }
    
    selectRange (range) {
        this._context.removeAllRanges();
        this._context.addRange(range);
    }

}
export default Selection;