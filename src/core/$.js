class Element {
    constructor (selector) {
        const MARKS = ['div', 'ul', 'p'];
        this.elems = [];
        if (typeof selector === 'string') {
            if (/^#|^\./.test(selector)) {
                this.elems.push.apply(this.elems, document.querySelectorAll(selector));
            } else if (selector === 'body') {
                this.elems.push(document.body);
            } else if (MARKS.indexOf(selector) !== -1) {
                this.elems.push(document.createElement(selector));
            } else {
                var tempDiv = document.createElement('div');
                tempDiv.innerHTML = selector;
                for (var i = 0; i < tempDiv.children.length; i++) {
                    this.elems.push(tempDiv.children[i]);
                }
            }
        } else {
            if (selector && selector.length) {
                this.elems.push.apply(this.elems, selector);
            } else if (selector && typeof selector === 'object') {
                if (selector instanceof Element) {
                    this.elems = selector.elems;
                } else {
                    this.elems.push(selector);
                }
                
            }
        }
        
    }

    attr (prop, value = null) {
        if (!value) {
            return this.elems[0].getAttribute(prop);
        } else {
            for (var elem of this.elems) {
                elem.setAttribute(prop, value);
            }
        }
    }

    val (val) {
        if (val) {
            for (var elem of this.elems) {
                elem.value  = val;
            }
        } else {
            var elem = this.elems[0];
            return elem.value.trim();
        }
        
    }

    focus () {
        for (var elem of this.elems) {
            elem.focus();
        }
    }

    html (htmlStr = null) {
        if (!htmlStr) {
            return this.elems[0].innerHTML;
        } else {
            for (var elem of this.elems) {
                elem.innerHTML = htmlStr;
            }
        }
    }
    text (text = null) {
        if (!text) {
            return this.elems[0].innerText;
        } else {
            for (var elem of this.elems) {
                elem.innerText = text;
            }
        }
    }
    height (height = null) {
        if (!height) {
            return this.elems[0].getBoundingClientRect().height;
        } else {
            for (var elem of this.elems) {
                elem.style.height = height + 'px';
            }   
        }
    }

    width (width = null) {
        if (!height) {
            return this.elems[0].getBoundingClientRect().width;
        } else {
            for (var elem of this.elems) {
                elem.style.width = width + 'px';
            }   
        }
    }
    
    find (selector) {
        for (var elem of this.elems) {
            var o = elem.querySelectorAll(selector);
            if (o && o.length) {
                return new Element(o);
            }
        }
        return new Element(null);
    }

    append (dom) {
        if (typeof dom === 'string') {
            for (var elem of this.elems) {
                elem.insertAdjacentHTML('beforeend', dom);
            }
        } else if (dom instanceof Element) {
            for (var elem of this.elems) {
                for (var elem1 of dom.elems) {
                    elem.appendChild(elem1);
                }
            }
        } else {
            for (var elem of this.elems) {
                elem.appendChild(dom);
            }
        }
    }

    hide () {
        for (var elem of this.elems) {
            elem.style.display = 'none';
        }
    }

    show () {
        for (var elem of this.elems) {
            elem.style.display = 'block';
        }
    }

    parent () {
        var elem = null;
        if (this.elems.length > 0) {
            elem = this.elems[0].parentNode;
        }
        return new Element(elem);
    }

    insertBefore (selector) {
        var $beforeElem = new Element(selector);
        if ($beforeElem.elems.length) {
            var beforeElem = $beforeElem.elems[0];
            var parent = beforeElem.parentNode;
            for (var elem of this.elems) {
                parent.insertBefore(elem, beforeElem);
            }
        }
    }

    insertAfter (selector) {
        var $afterElem = new Element(selector);
        if ($afterElem.elems.length) {
            var afterElem = $afterElem.elems[0];
            var parent = afterElem.parentNode;
            for (var elem of this.elems) {
                if (parent.lastChild === afterElem) {
                    parent.appendChild(elem);
                } else {
                    parent.insertBefore(elem, afterElem.nextSibling);
                }
            }
        }
    }

    equal ($elem) {
        if ($elem.nodeType === 1) {
            return this.elems[0] === $elem;
        } else {
            return this.elems[0] === $elem.elems[0];
        }
    }

    remove () {
        for (var elem of this.elems) {
            if (elem.remove) {
                elem.remove();
            } else {
                var parent = elem.parentElement;
                parent && parent.removeChild(elem);
            }
        }
    
    }

    bind (event, handler) {
        for (var elem of this.elems) {
            elem.addEventListener(event, function (evt) {
                handler.call(evt.currentTarget, evt);
            });
        }
    }
    unbind (event, handler) {
        for (var elem of this.elems) {
            elem.removeEventListener(event, handler);
        }
    }
    addClass (className) {
        for (var elem of this.elems) {
            var classArr = [];
            if (elem.className) {
                classArr = elem.className.split(' ');
            }
            var classArr1 = className.split(' ');
            classArr.push.apply(classArr, classArr1);
            elem.className = classArr.join(' ');
        }
    }

    removeClass (className) {
        for (var elem of this.elems) {
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
        for (var elem of this.elems) {
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
function $(selector) {
    return new Element(selector);
}
export default $;