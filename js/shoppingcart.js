function calculateTotalPrice () {
    var ttl = 0.0;
    $("#item_list").find(".sub_total").each(function(){
        ttl += parseFloat($(this).html());
        if (isNaN(ttl)) ttl = 0.0    
    });
    $("#ttl_price").html(ttl.toFixed(1));
    
    var shipment = $("#shipment").html();
    ttl += parseFloat(shipment);
    
    var discount = $("#discount_percent").html();
    if (discount !== "0")
        ttl *= (parseFloat(discount) / 100);
    
    $("#final_price").html(ttl.toFixed(1));
}

function arrangeAlterTable() {
    var counter = 0;
    $("#item_list").find("tr").each(function() {
        if (counter % 2 == 0) 
            $(this).addClass("alter");
        else 
            $(this).removeClass("alter");
        counter++;    
    });
}

$("#promotionalCodeString").click(function() {
    $(this).css("display", "none");
    $("#promotionalCodeInput").css("display", "inline-block");
});


$(document).ready(function() {

    
    
    $(".amount").bind("keyup mouseup", function() {
        var amount = $(this).val();
        var unit_price_tag = $(this).parent().next("td");
        var unit_price = unit_price_tag.html();
        
        var sub_total = parseFloat(amount) * parseFloat(unit_price);
        
        if (isNaN(sub_total)) sub_total = 0;
         
        unit_price_tag.next("td").html(sub_total.toFixed(1));    
        calculateTotalPrice();
    });
    
    $(".amount").each(function() {
        $(this).keyup();
    });
    
    $(".item_remove").click(function() {
        $(this).parent().parent().remove();
        arrangeAlterTable();
        calculateTotalPrice();  
    });
});