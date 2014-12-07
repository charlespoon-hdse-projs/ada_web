cart_items = '{ "cart_items": [ '+
                '{ "name": "Mock Neck T-Shirt", "image" : "IDD001.jpg", "price" : 122.5, "amount" : 3, "detail" : "Color: Red<br/>Size: XL"}, '+
                '{ "name": "V-Neck T-Shirt", "image" : "IDD002.jpg", "price" : 132.5, "amount" : 1, "detail" : "Color: Red<br/>Size: XL"}, ' +
                '{ "name": "Slim Fit Jeans", "image" : "IDD007.jpg", "price" : 270.0, "amount" : 2, "detail" : "Color: Red<br/>Size: XL"}'+
             ']}';

function initialData() {
    items = JSON.parse(cart_items);
    items = items["cart_items"];
    
    for (var i = 0; i < items.length; i++) {
        var row = "";
        if (((i+1) % 2) == 0) 
            row = '<tr class="alter">';
        else 
            row = '<tr>';
        row += '<td><div class="image_with_name"><img src="img/'+items[i]["image"] + '" width=150px height=200px/><div>'+items[i]["name"]+'</div></td>';
        row += '<td>'+items[i]["detail"]+'</td>';
        row += '<td><input type="number" value="'+items[i]["amount"] +'" min="1" max="99" class="amount"/><br/><br/><span class="item_remove">remove</span></td>';
        row += '<td>'+items[i]["price"]+'</td>';
        row += '<td class="sub_total"></td>';
        $("#item_list tbody").append(row);
    }
}


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

    initialData();
    
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