<template id="layer">

	<div class="layer" v-bind:style='{
		position: "absolute",
		left: "" + (layer.frame.x * artboardFactor) + "px",
		top: "" + (layer.frame.y * artboardFactor) + "px",
		width: "" + (layer.frame.width * artboardFactor) + "px",
		height: "" + (layer.frame.height * artboardFactor) + "px" ,
		visibility: "" + (layer.isVisible ? "visibile" : "hidden"),
		boxSizing: "border-box"}'
		:data-name="layer.name"
		:data-id="layer.do_objectID"
		v-tooltip:top="layer.name  +', \ntop: ' + layer.frame.y + ', left: ' + layer.frame.x + ', width: ' + layer.frame.width + ', height: ' + layer.frame.height"
		v-on:mouseover="mouseover($event)">

		<layer v-if="layer.isVisible" v-for="child in layer.layers" :layer="child" :artboard-width="artboardWidth" :artboard-factor="artboardFactor"></layer>

	</div>

</template>
<script>
export default {
	name: 'layer',
	props: ['layer', 'artboardWidth', 'artboardFactor'],
	methods: {
    mouseover: function (e) {
      e.stopPropagation()
    }
  },
	computed: {
	    reversed: function () {
	    	if (this.layer.layers) {
	    		return this.layer.layers.slice().reverse()
	    	}
	    	else {
	    		return []
	    	}
	      //return this.layer.layers.reverse()
	    }
	  }
}
</script>
