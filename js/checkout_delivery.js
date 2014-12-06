$(document).ready(function() {
    $(".option").click(function() {
        var option_id = $(this).attr("id");
        console.log(option_id);
        $(".option").each(function() {
            var tmp = $(this).attr("id");
            if ( tmp === option_id ) {
                $(this).addClass("checked");
                
            } else { 
                $(this).removeClass("checked");
            }
        });
    });
});