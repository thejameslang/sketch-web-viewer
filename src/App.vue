
<style>
.layer:hover {
    outline: 1px solid blue;
}
</style>

<template id="dropzone">
  <div v-bind:style='{ width: "" + imageWidth + "px", height: "" + imageHeight + "px" }'>

    <div v-if="imageData "v-bind:style='{ position: 
    "absolute", backgroundImage: "url(" + imageData + ")", 
    backgroundRepeat: "no-repeat",
    backgroundSize: "contain",
    backgroundPosition: "center",
    backgroundSize: "" + imageWidth + "px " + imageHeight + "px", width: "" + imageWidth + "px", height: "" + imageHeight + "px"}'>
      
       <div v-for="(artboard, key, index) in artboards" v-bind:style='{ color: "white", 
       position: "absolute", 
       left: "" + (key * (60 + artboardWidth)) + "px", 
       top: "" + (artboard.frame.y * artboardFactor) + "px", 
       width: "" + artboardWidth + "px", 
       height: "" + (artboard.frame.height * artboardFactor) + "px" , 
       boxSizing: "border-box"}'>

          <layer v-for="child in artboard.layers" :layer="child" :artboard-width="artboardWidth" :artboard-factor="(artboardWidth / artboard.frame.width)"></layer>

      </div>
    </div>
    <div v-if="!imageData">
      
          <div class="dropzone-area" drag-over="handleDragOver" @dragenter="hovering = true" @dragleave="hovering = false" :class="{'hovered': hovering}">
              <div class="dropzone-text">
                  <span class="dropzone-title">Drop image here or click to select</span>
                  <span class="dropzone-info" v-if="help">{{ help }}</span>
              </div>
              <input type="file" @change="onFileChange">
          </div>
      </div>
  </div>
</template>

<script>
$( document ).ready(function() {
$('[rel*=popover]').popover({trigger:'hover',animation:'false',placement:'top'});
$('[rel*=popover]').click(function () {
     $('[rel*=popover]').not(this).popover('hide');
});
})

import Vue from 'vue'
import Dropzone from './components/Dropzone'
import Layer from './components/Layer'

var JSZip = require('jszip')

Vue.component('upload-image', {
  template: '#dropzone'
})

Vue.filter('reverse', function (array) {
  return array.slice().reverse()
})

export default {
  name: 'app',
  components: {
    Layer
  },
  
  props: ['help'],

  data() {
      return {
          imageData: '',
          imageWidth: undefined,
          imageHeight: undefined,
          artboardWidth: 0,
          artboardFactor: 0,
          artboards: undefined,
          error: undefined,
          hovering: false
      }
  },

  methods: {
      onFileChange(e) {
          var vm = this;
          var files = e.target.files || e.dataTransfer.files;
          if (!files.length) return;
          var file = files[0]

          var reader = new FileReader();

          reader.onload = (e) => {
              var data = e.target.result;
              JSZip.loadAsync(data).then(function (zip) {
                  zip.forEach(function (relativePath, zipEntry) {
                      if (relativePath == 'previews/preview.png') {
                          zipEntry.async('base64').then(function success(content) {
                              
                              var x = 'data:image/png;base64,' + content;
                              vm.imageData = x;

                              var i = new Image(); 

                              i.onload = function(){
                               vm.imageWidth = i.width
                               vm.imageHeight = i.height

                               if (vm.imageWidth && vm.artboards && vm.imageWidth >= 2048) {
                                vm.artboardWidth = (2048.0-(60.0*(vm.artboards.length-1)))/vm.artboards.length
                               }
                              };

                              i.src = vm.imageData; 

                          }, function error(e) {
                              console.log(e)
                              vm.error = 'Could not load Sketch preview'
                          });
                      }
                      else if (relativePath.startsWith('pages/')) {
                          zipEntry.async('string').then(function success(content) {
                              
                              var page = JSON.parse(content)
                              page.layers.forEach(function(artboard) {
                                if (artboard.layers) {
                                  artboard.reversedLayers = artboard.layers.slice().reverse()
                                  console.log(artboard.layers[0])
                                  console.log(artboard.reversedLayers[0])
                                  artboard.reversedLayers.forEach(function(layer) {
                                    console.log(layer.name)
                                  })
                                  artboard.layers.forEach(function(layer) {
                                    console.log(layer.name)
                                  })
                                }
                              })
                              vm.artboards = page.layers

                              if (vm.imageWidth && vm.artboards && vm.imageWidth >= 2048.0) {
                                vm.artboardWidth = (2048.0-(60*(vm.artboards.length-1)))/vm.artboards.length 
                              }

                          }, function error(e) {
                              console.log(e)
                              vm.error = 'Could not load page'
                          });
                      }
                    });
                  }, function (e) {
                    console.log(e)
                  });
          };
          reader.readAsArrayBuffer(file);
      }
      
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.dropzone-area {
    margin: 50px auto;
    width: 80%;
    height: 200px;
    position: relative;
    border: 2px dashed #CBCBCB;
    &.hovered {
        border: 2px dashed #2E94C4;
        .dropzone-title {
          color: #1975A0;
        }

    }
}

.dropzone-area input {
    position: absolute;
    cursor: pointer;
    top: 0px;
    right: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
}

.dropzone-text {
    position: absolute;
    top: 50%;
    text-align: center;
    transform: translate(0, -50%);
    width: 100%;
    span {
        display: block;
        font-family: Arial, Helvetica;
        line-height: 1.9;
    }
}

.dropzone-title {
    font-size: 13px;
    color: #787878;
    letter-spacing: 0.4px;
}
.dropzone-info {
    font-size: 13px;
    font-size: 0.8125rem;
    color: #A8A8A8;
    letter-spacing: 0.4px;
}

.dropzone-button {
    position: absolute;
    top: 10px;
    right: 10px;
    display: none;
}

.dropzone-preview {
    width: 80%;
    position: relative;
    &:hover .dropzone-button {
        display: block;
    }
    img {
      display: block;
      height: auto;
      max-width: 100%;
    }
    
}
</style>
