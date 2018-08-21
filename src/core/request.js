class Request {

    constructor () {
        this.xmlHttp = null;
    }

    _getXMLHttpRequest () {
        return new XMLHttpRequest();
    }

    get (url) {
        return new Promise((resolve, reject) => {
            var xmlHttp = this._getXMLHttpRequest();
            this.xmlHttp = xmlHttp;
            xmlHttp.open('get', url, true);
            xmlHttp.send();
            xmlHttp.onreadystatechange = function () {
                if (xmlHttp.readyState === 4) {
                    if (xmlHttp.status === 200) {
                        resolve(JSON.parse(xmlHttp.responseText));
                    } else {
                        reject(xmlHttp.status, xmlHttp.statusText);
                    }
                }
            }
        });
    }
   
    post (url, data) {
        return new Promise((resolve, reject) => {
            var xmlHttp = this._getXMLHttpRequest();
            this.xmlHttp = xmlHttp;
            xmlHttp.open('post', url, true);
            xmlHttp.send(data);
            xmlHttp.onreadystatechange = function () {
                if (xmlHttp.readyState === 4) {
                    if (xmlHttp.status === 200) {
                        resolve(JSON.parse(xmlHttp.responseText));
                    } else {
                        reject(xmlHttp.status, xmlHttp.statusText);
                    }
                }
            }
        });
    }

    abort () {
        if (this.xmlHttp) {
            this.xmlHttp.abort();
        }
    }
}
export default Request;