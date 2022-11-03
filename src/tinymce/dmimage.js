tinymce.PluginManager.add('dmimage', function(editor, url) {
  var imgdata = '';
  var openDialog = function (data) {
    return editor.windowManager.openUrl({
      title: 'Select image',
      url: '/tinymce/select/'+data,
      buttons: [
        {type:'custom',
         text: 'confirm',
         primary: true
        },
        {type:'cancel',
         text: 'Cancel'
        }
      ],      
      onMessage: function (api, details) {        
        imgdata = details.data;        
      },
      onAction: function(api, details){
        var width = imgdata.width;
        var height = imgdata.height;
        var image = imgdata.image;
        var dmdata = image.content_type + ';' + image.cuid+';'+ image.cid;
        var prefix = '/var/'; //todo: read from environment
        editor.insertContent( "<img data-dm-content='"+ dmdata +"' "+ (width?"width='"+width+"' ":"") + (height?"height='"+height+"'":"") +" src='"+prefix+imgdata.image.image+"'>");
        api.close();
      }
    });
  };

  editor.ui.registry.addButton('dmimage', {
    tooltip: 'Image from library',
    icon: 'image',
    onAction: function () {
      var data = 'image;;';
      var selected = tinymce.activeEditor.selection.getNode();
      if( selected.localName=='img' ){
        data = selected.dataset.dmContent+';';
        var width = selected.getAttribute('width');
        var height = selected.getAttribute('height');
        data += (width?width:'')+';';
        data += (height?height:'')+';';
      }else{
        data += ';;;';
      }
      openDialog(data);
    }
  });

  editor.ui.registry.addMenuItem('dmimage', {
    text: 'Image',
    onAction: function() {
      openDialog();
    }
  });

  return {
    getMetadata: function () {
      return  {
        name: 'dmimage',
        url: 'http://digimaker.org'
      };
    }
  };
});