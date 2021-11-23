$(document).ready(function () {
  $(document).on("swell:setup", function () {
    if(spapi.authenticated && spapi.customer.vip_tier && spapi.customer.vip_tier.name == "Elevate"){
      swellCheckitems();
    }
  });
});
function addFreeItem() { 
  jQuery.post('/cart/add.js', {
    items: [
      {
        quantity: 1,
        id: 32183758061617,
        properties: {
          '_swell_free-product' : 'added'
        }
      }
    ],
    success:function() {
      setTimeout(function() {
        location.reload();
      }, 500);
    },
    error:function() {
      console.log("can't add free gift to cart");
    }
  });
}
function swellCheckitems(){
  var isGiftToAdd = true;
  var cart = $.ajax({
    type: 'GET', 
    url: '/cart.js',
    dataType: 'json',
    success: function(){
      if(cart.responseJSON.item_count>0){
        cart.responseJSON.items.forEach(function(item){
          if(item.id == 32183758061617 && (item.properties && item.properties["_swell_free-product"])){
            if(cart.responseJSON.item_count == 1) {
               window.location='/cart/clear';
              }
            isGiftToAdd = false;
            return;
          }
        });
        if(isGiftToAdd) {
          addFreeItem();
        }
      }
    }
  });
}
