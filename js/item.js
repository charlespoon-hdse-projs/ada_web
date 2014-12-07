 $("#img_01").elevateZoom({
     gallery: 'gallery_01',
     cursor: 'pointer',
     galleryActiveClass: 'active',
     borderSize: 0;
     
 });

 //pass the images to Fancybox
 $("#img_01").bind("click", function (e) {
     var ez = $('#img_01').data('elevateZoom');
     $.fancybox(ez.getGalleryList());
     return false;
 });