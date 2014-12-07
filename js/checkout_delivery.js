function calculateSettledSubTotal() {
    var ttl = 0.0;
    $("#item_list").find("tbody tr").each(function() {
        var amt = $(this).find("td:nth-child(2)").html();
        var unit_price = $(this).find("td:nth-child(3)").html();
        var sub_total = parseFloat(amt) * parseFloat(unit_price);
        $(this).find("td:nth-child(4)").html(sub_total);
        ttl += sub_total;
    });
    $("#ttl_price").html(ttl);
    
    var final_price = 0.0
    var shipment = $("#shipment").html();
    var discount = parseFloat($("#discount_percent").html())/100;
    if (discount == 0) discount = 1;
    console.log(shipment);
    
    final_price = (ttl + parseFloat(shipment)) * discount;
    $("#final_price").html(final_price);
}

function verify() {
    var fields = ["#customer_name", "#customer_phone", "#customer_address_line1", "#customer_address_line2", "#customer_delivery_date", "#customer_delivery_time"];
    var error_msgs = [];
    
    var name = $("#customer_name").val();
    var phone = $("#customer_phone").val();
    var address_1 = $("#customer_address_line1").val();
    var address_2 = $("#customer_address_line1").val();
//    var address_1 = $("#customer_address_line1").val();
    
    if (name.length < 1) {
        $("#customer_name").addClass("error_field");
        error_msgs[error_msgs.length] = "Missing name of recipient.";    
    } else {
        $("#customer_name").removeClass("error_field");
    }
    
    
    if (phone.length < 1) {
        $("#customer_phone").addClass("error_field");
        error_msgs[error_msgs.length] = "Missing contact number of recipient.";    
    } else if (isNaN(phone) || phone.length != 8) {
        $("#customer_phone").addClass("error_field");
        error_msgs[error_msgs.length] = "Invalid contact number format.";    
    } else {
        $("#customer_phone").removeClass("error_field");
    }
        
    if (address_1.length < 1 || address_2.length < 1) {
        $("#customer_address_line1").addClass("error_field");
        $("#customer_address_line2").addClass("error_field");
        error_msgs[error_msgs.length] = "Missing recipient address.";    
    } else {
        $("#customer_address_line1").removeClass("error_field");
        $("#customer_address_line2").removeClass("error_field");
    }
        
    //delivery 
    var date = $("#customer_delivery_date").val();
    var time = $("#customer_delivery_time").val();
    
    if (date == null || date.length < 1) {
        $("#customer_delivery_date").addClass("error_field");
        error_msgs[error_msgs.length] = "Missing expected delivery date.";
    } else {
        $("#customer_delivery_date").removeClass("error_field");
    }
    
    if (time == null || time.length < 1) {
        $("#customer_delivery_time").addClass("error_field");
        error_msgs[error_msgs.length] = "Missing expected delivery time.";
    } else {
        $("#customer_delivery_time").removeClass("error_field");
    }
    
    console.log(error_msgs);
    if (error_msgs.length == 0) {
        return true;
    } else {
        var formatted_error_msg = "";
        for (var i =0 ; i < error_msgs.length; i++) {
            formatted_error_msg += "<div>"+ (i+1) + ". " + error_msgs[i] + "</div>";
            console.log(formatted_error_msg);
        }
        $("#error_msg").html(formatted_error_msg);
        $("#error_msg").css("display", "inline-block");
  
        return false; 
    }
}

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
    
    $("#customer_address_line3").change(function() {
        var shipment_cost = $(this).val();
        $("#shipment").html(shipment_cost);
    });
    
    $("#customer_address_line3").change();
    
    calculateSettledSubTotal();
    
});

