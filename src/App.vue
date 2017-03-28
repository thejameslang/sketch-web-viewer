

<template id="dropzone">
  <div>
    <div v-if="image">
      <img :src="image" />
    </div>
    <div v-if="!image">
      
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
import Vue from 'vue'
import Dropzone from './components/Dropzone'

var JSZip = require('jszip')

Vue.component('upload-image', {
  template: '#dropzone',
});


export default {
  name: 'app',
  components: {
    
  },
  
  props: ['help'],

  data() {
      return {
          image: '',
          hovering:false
      }
  },

  methods: {
      onFileChange(e) {
          var vm = this;
          var files = e.target.files || e.dataTransfer.files;
          if (!files.length) return;
          // this.createImage(files[0]);
          var file = files[0]

          var reader = new FileReader();

          reader.onload = (e) => {
              var data = e.target.result;
              console.log(data)    
              JSZip.loadAsync(data).then(function (zip) {
                  zip.forEach(function (relativePath, zipEntry) {
                      console.log(relativePath)
                      console.log(zipEntry)
                      if (relativePath == 'previews/preview.png') {
                        zipEntry.async('base64').then(function success(content) {
                              
                              var x = 'data:image/png;base64,' + content;
                              vm.image = x;

                          }, function error(e) {
                              // handle the error
                          });
                      }
                    });
                  }, function (e) {
                    console.log(e)
                  });
          };
          reader.readAsArrayBuffer(file);

            
      },
      createImage(file) {
          var image = new Image();
          var reader = new FileReader();
          var vm = this;

          reader.onload = (e) => {
              vm.image = e.target.result;
          };
          reader.readAsDataURL(file);
      },
      removeImage: function (e) {
          this.image = '';
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
