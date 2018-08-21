import $ from '../$';
import imageDialogTpl from '../../ui/image-dialog.html';
import imageUploadTpl from '../../ui/image-upload.html';
import mito from 'mito';
import Request from '../../core/request';
class ImageHandle {
    constructor (context) {
        this.context = context;
    }
    do () {
        this.type = 1;
        this._create();
        this._bindEvent();
    }
    _create () {
        this.$elem = $(imageDialogTpl);
        $('body').append(this.$elem);
    }
    _bindEvent () {
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

        this.$elem.find('.switch-box').bind('click', function (event) {

            if (_this.type === 1) {
                $(this).text('或上传本地图片');
                $inputBox.elems[0].style.display = 'flex';
                $uploadBtn.hide();
                $confirm.elems[0].style.display = 'inline-block';
                _this.type = 2;
            } else {
                $inputBox.hide();
                $uploadBtn.show();
                $(this).text('或选择网络图片');
                $confirm.hide();
                _this.type = 1;
            }
        });
        var $linkInput = this.$elem.find('#linkInput');

        var $waringTxt = this.$elem.find('.waring-txt');

        $confirm.bind('click', function (event) {
            var link = $linkInput.val();
            if (!link.length) {
                $waringTxt.text('链接不能为空');
            } else {
                _this._destroy();
                _this._insertImage(2, [link], null);
            }
        });
        var fileInput = this.$elem.find('input').elems[0];

        this.$elem.find('.upload-btn').bind('click', (event) => {
            var fileInput = this.$elem.find('input').elems[0];
            fileInput.click();
            fileInput.onchange = (evt) => {
                fileInput.val = '';
                var files = evt.target.files;
                var i = 0;
                var images = [];
                var _this = this;
                function loadFile () {
                    if (i >= files.length) {
                        _this._destroy();
                        _this._insertImage(1, images, files);
                        return;
                    }
                    
                    var file = files[i++];
                    var reader  = new FileReader();
                   
                    reader.readAsDataURL(file);
                    reader.onload = () => {
                        var data = reader.result;
                        images.push(data);
                        loadFile();
                    }
                }
                loadFile();
                
            }
        });

    }

    _uploadImage (type, $imageBox, image) {
        var config = this.context.bestEditor.config;
        var $uploadErrorMsg = $imageBox.find('.upload-error-msg');
        var request = new Request();
        var _this = this;
        function _upload() {
            if (type === 1) {
                if (config.imageUpload) {
                    var formData = new FormData();
                    formData.append('file', image);
                    request.post(config.imageUpload, formData)
                        .then(function (data) {
                            if (data.code == 0) {
                                $imageBox.find('.image-upload').remove();
                                $imageBox.append(`<img src="${data.data}"><br>`);
                            }
                            
                        })
                        .catch (function (status, msg) {
                            $uploadErrorMsg.text('网络异常！');
                        })
                }   
            } else if (type === 2) {
                if (config.imageLinkUpload) {
                    request.get(config.imageLinkUpload + '?imageUrl=' + image)
                        .then(function (data) {
                            if (data.code == 0) {
                                $imageBox.find('.image-upload').remove();
                                $imageBox.append(`<img src="${data.data}"><br>`);
                            }
                            
                        })
                        .catch (function (status, msg) {
                            $uploadErrorMsg.text('网络异常！');
                        })
                }
            }
        }

        _upload();        
        //cancel upload
        $imageBox.find('.upload-btn-cancel').bind('click', function (event) {
            console.log('cancel upload!');
            $imageBox.remove();
            request.abort();
        })

        //retry upload
        $imageBox.find('.upload-btn-retry').bind('click', function (event) {
            $uploadErrorMsg.text('正在上传');
            _upload();
        })
    }

    //upload images
    _uploadImages (type, $imageBoxArr, images) {
        for (var i = 0; i < $imageBoxArr.length; i++) {
            var $imageBox = $imageBoxArr[i];
            var image;
            if (!images && type === 2) {
                image = $imageBox.find('.image-upload img').elems[0].src;
            } else {
                image = images[i];
            }
            this._uploadImage(type, $imageBox, image);
        }
    }

    //insert image tag to editor
    _insertImage (type, images, files) {
        
        var selectionElem = this.context.bestEditor.selection.getContainerElement();
        var config = this.context.bestEditor.config;
        if (/^p$/i.test(selectionElem.tagName)) {

            var curRange = this.context.bestEditor.selection.getCurrentRange();

            var text = selectionElem.innerText.trim();
            var text1 = text.substring(0, curRange.startOffset);
            var text2 = text.substr(curRange.startOffset);
            if (text1.length > 0)  {
                selectionElem.innerText = text1;
            }
           
            var afterElem = selectionElem;
            var $imageBoxArr = [];
            var $imageBox;
            for (var image of images) {
                if (type === 2 && !config.imageLinkUpload) {
                    $imageBox = $(`<div class="image-box"><img src="${image}"><br></div>`);
                    $imageBox.insertAfter(afterElem);
                    afterElem = $imageBox.elems[0];
                    this.context.bestEditor.selection.createRangeByElement($imageBox.elems[0], false, true);
                    this.context.bestEditor.selection.restore();
                } else {
                    var imageUpload = mito(imageUploadTpl)({imageUrl: image});
                    $imageBox = $(`<div class="image-box"></div>`);
                    $imageBox.append(imageUpload);
                    $imageBox.insertAfter(afterElem);
                    afterElem = $imageBox.elems[0];
                    $imageBoxArr.push($imageBox);
                }
            }
            if (text.length === 0) {
                $(selectionElem).remove();
            }
            if (text2.length > 0) {
                var $p = $(`<p>${text2}</p>`)
                $p.insertAfter($imageBox);
                this.context.bestEditor.selection.createRangeByElement($p.elems[0], false);
                this.context.bestEditor.selection.restore();
            } else {
                var $p = $('<p><br></p>');
                $p.insertAfter($imageBox);
                this.context.bestEditor.selection.createRangeByElement($p.elems[0], false);
                this.context.bestEditor.selection.restore();
            }
            if (type === 1 || config.imageLinkUpload) {
                this._uploadImages(type, $imageBoxArr, type === 1 ? files : images);
            }
        } else {
            // var $imageBoxArr = [];
            // for (var image of images) {
            //     var imageUpload = mito(imageUploadTpl)({imageUrl: image});
            //     var $imageBox = $(`<div class="image-box"></div>`);
            //     $imageBox.append(imageUpload);
            //     var range = this.context.bestEditor.selection.getCurrentRange();
            //     range.insertNode($imageBox.elems[0]);
            //     //this.context.insertHTML($imageBox.elems[0].outerHTML);
            //     $imageBoxArr.push($imageBox);
            //    // console.log($imageBox.parent().remove());
            // }
            // this._uploadImages(type, $imageBoxArr, type === 1 ? files : images);
        }
        console.log('insertImage')
    }

    _destroy () {
        this.$elem.remove();
        this.context.bestEditor.selection.restore();
    }

}
export default ImageHandle;