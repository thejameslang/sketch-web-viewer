// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false


Vue.directive('tooltip', function(el, binding){
    $(el).attr('data-toggle', 'tooltip')
        .attr('data-title', binding.value)
        .attr('data-placement', binding.arg)
        .tooltip();
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App },
  filters: {
    reverse: function (array) {
      return array.slice().reverse()
    }
  },

  mounted: function() {
  	console.log('sadfsadfsds')
  	$('.layer').hover(
	   function(e) {
	       e.preventDefault();
	   },
	   function() { }
	);
  }
})
var plist = require('plist');



// Read data from a file (xml or binary) (synchronous) 
var data = plist.parse('YnBsaXN0MDDUAQIDBAUGlZZYJHZlcnNpb25YJG9iamVjdHNZJGFyY2hpdmVyVCR0b3ASAAGGoK8QIgcIERIZJicoKSozOj5GR0hJSk5SV1pbXWlsdHV4goWJjZFVJG51bGzUCQoLDA0ODxBYTlNTdHJpbmdfEA9OU0F0dHJpYnV0ZUluZm9cTlNBdHRyaWJ1dGVzViRjbGFzc4ACgB');
console.log( JSON.stringify(data) );