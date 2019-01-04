class D {
    constructor (selector) {
        this.length = 0;
        this.selector = null;
        if (typeof selector === 'string') {
            if (/^</gi.test(selector)) {
                var tempDiv = document.createElement('div');
                tempDiv.innerHTML = selector;
                for (var i = 0; i < tempDiv.children.length; i++) {
                    this[i] = tempDiv.children[i];
                    this.length++;
                }
            } else {
                var slice = Array.prototype.slice;
                var doms = slice.apply(document.querySelectorAll(selector));
                doms.forEach((d, i) => this[i] = d);
                this.length = doms.length;
            }
            this.selector = selector || ''; 

        } else if (selector && typeof selector === 'object') {
            if (selector instanceof D) {
                for (var i = 0; i < selector.length; i++) {
                    this[i] = selector[i];
                    this.length++;
                }
            } else if (selector && selector.length) {
                var doms = selector;
                doms.forEach((d, i) => this[i] = d);
                this.length = doms.length;
            } else {
                this[0] = selector;
                this.length++;
            }
            this.selector = selector; 
        }
    }

    attr (prop, value = null) {
        if (!value) {
            return this.length ? this[0].getAttribute(prop) : '';
        } else {
            for (var i = 0; i < this.length; i++) {
                this[i].setAttribute(prop, value);
            }
        }
        
    }

    val (val) {
        if (val) {
            for (var i = 0; i < this.length; i++) {
                this[i].value  = val;
            }
        } else {
            return this.length ? this[0].value : '';
        }
    }

    focus () {
        for (var i = 0; i < this.length; i++) {
            this[i].focus();
        }
    }

    html (htmlStr = null) {
        if (!htmlStr) {
            return this.length ? this[0].innerHTML : '';
        } else {
            for (var i = 0; i < this.length; i++) {
                this[i].innerHTML = htmlStr;
            }
        }
    }
    text (text = null) {
        if (!text) {
            return this.length ? this[0].innerText : '';
        } else {
            for (var i = 0; i < this.length; i++) {
                this[i].innerText = text;
            }
        }
    }
    height (height = null) {
        if (!height) {
            return this.length ? this[0].getBoundingClientRect().height : null;
        } else {
            for (var i = 0; i < this.length; i++) {
                this[i].style.height = height + 'px';
            }
        }
    }

    width (width = null) {
        if (!width) {
            return this.length ? this[0].getBoundingClientRect().width : null;
        } else {
            for (var i = 0; i < this.length; i++) {
                this[i].style.width = height + 'px';
            }
        }
    }
    
    find (selector) {
        for (var i = 0; i < this.length; i++) {
            var slice = Array.prototype.slice;
            var doms = slice.apply(this[i].querySelectorAll(selector));
            if (doms.length) {
                return new D(doms);
            }
        }
        return new D(null);
    }

    append (dom) {
        if (typeof dom === 'string') {
            for (var i = 0; i < this.length; i++) {
                this[i].insertAdjacentHTML('beforeend', dom);
            }
        } else if (dom instanceof D) {
            for (var i = 0; i < this.length; i++) {
                for (var j = 0; j < dom.length; j++) {
                    this[i].appendChild(dom[j]);
                }
            }
        } else {
            for (var i = 0; i < this.length; i++) {
                this[i].appendChild(dom);
            }
        }
    }

    hide () {
        for (var i = 0; i < this.length; i++) {
            this[i].style.display = 'none';
        }
    }

    show () {
        for (var i = 0; i < this.length; i++) {
            this[i].style.display = 'block';
        }
    }

    parent () {
        return this.length ? new D(this[0].parentNode) : new D(null);
    }

    insertBefore (selector) {
        var $beforeElem = new D(selector);
        if ($beforeElem.length) {
            var beforeElem = $beforeElem[0];
            var parent = beforeElem.parentNode;
            for (var i = 0; i < this.length; i++) {
                parent.insertBefore(this[i], beforeElem);
            }
        }
    }

    insertAfter (selector) {
        var $afterElem = new D(selector);
        if ($afterElem.length) {
            var afterElem = $afterElem[0];
            var parent = afterElem.parentNode;
            for (var i = 0; i < this.length; i++) {
                if (parent.lastChild === afterElem) {
                    parent.appendChild(this[i]);
                } else {
                    parent.insertBefore(this[i], afterElem.nextSibling);
                }
            }
        }
    }

    equal ($elem) {
        if (!this.length) {
            return false;
        }
        if ($elem.nodeType === 1) {
            return this[0] === $elem;
        } else {
            return this[0] === $elem[0];
        }
    }

    remove () {
        for (var i = 0; i < this.length; i++) {
            var elem = this[i];
            if (elem.remove) {
                elem.remove();
            } else {
                var parent = elem.parentElement;
                parent && parent.removeChild(elem);
            }
        }
    
    }

    bind (event, handler) {
        for (var i = 0; i < this.length; i++) {
            this[i].addEventListener(event, function (evt) {
                handler.call(evt.currentTarget, evt);
            });
        }
    }
    unbind (event, handler) {
        for (var i = 0; i < this.length; i++) {
            this[i].removeEventListener(event, handler);
        }
    }
    addClass (className) {
        for (var i = 0; i < this.length; i++) {
            var classArr = [];
            var elem = this[i];
            if (elem.className) {
                classArr = elem.className.split(' ');
            }
            var classArr1 = className.split(' ');
            classArr.push.apply(classArr, classArr1);
            elem.className = classArr.join(' ');
        }
    }

    removeClass (className) {
        for (var i = 0; i < this.length; i++) {
            var elem = this[i];
            var classArr = [];
            if (elem.className) {
                classArr = elem.className.split(' ');
            }
            classArr = classArr.filter(item => {
                item = item.trim();
                if (!item || item === className) {
                    return false;
                }
                return true;
            });
            elem.className = classArr.join(' ');
        }
    }

    hasClass (className) {
        for (var i = 0; i < this.length; i++) {
            var elem = this[i];
            var classArr = [];
            if (elem.className) {
                classArr = elem.className.split(' ');
            }
            if (classArr.indexOf(className) !== -1) {
                return true;
            }
        }
        return false;
    }
}

export default function (selector) {
    return new D(selector); 
};