tmp_customer ='{ "name": "Chan Tai Man", "contact_number": "23456789", "address_line1": "Legislative Council Complex","address_line2": "1 Legislative Council Road, Central","address_line3": "Hong Kong"}';

personal_fields = ["#customer_name", "#customer_phone", "#customer_address_line1", "#customer_address_line2", "#customer_address_line3"];

cart_items = '{ "cart_items": [ '+
                '{ "name": "Mock Neck T-Shirt", "image" : "IDD001.jpg", "price" : 122.5, "amount" : 3}, '+
                '{ "name": "V-Neck T-Shirt", "image" : "IDD002.jpg", "price" : 132.5, "amount" : 1}, ' +
                '{ "name": "Slim Fit Jeans", "image" : "IDD007.jpg", "price" : 270.0, "amount" : 2}'+
             ']}';
  


function restoreDefault() {
    var fake_customer = JSON.parse(tmp_customer);
    $("#customer_name").val(fake_customer["name"]);
    $("#customer_phone").val(fake_customer["contact_number"]);
    $("#customer_address_line1").val(fake_customer["address_line1"]);
    $("#customer_address_line2").val(fake_customer["address_line2"]);
    $("#customer_address_line3").find("option").each(function() {
        if ($(this).text() === fake_customer["address_line3"]) 
            $(this).attr("selected", true);
    });
    
    for(var field_name in personal_fields) {
        $(personal_fields[field_name]).attr("disabled", "disabled");
    }
    
}

function clearForm() {
    $("#customer_name").val("");
    $("#customer_phone").val("");
    $("#customer_address_line1").val("");
    $("#customer_address_line2").val("");
    for(var field_name in personal_fields) {
        $(personal_fields[field_name]).attr("disabled", false);
    }

}

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


function initialData() {
    items = JSON.parse(cart_items);
    items = items['cart_items'];
    console.log(items.length);
    for (var i = 0; i < items.length; i++) {
        var row = "";
        if ((i+1) % 2 == 0)
            row = '<tr class="alter">';
        else
            row = '<tr>';
        row += "<td>"+items[i]["name"]+"</td>";
        row += "<td>"+items[i]["amount"]+"</td>";
        row += '<td style="display:none">'+items[i]['price']+'</td>';
        row += '<td class="sub_total"></td>';
        row += "</tr>";
        $("#item_list tbody").append(row);
    }
}


$(document).ready(function() {
    
    $(".option").click(function() {
        var option_id = $(this).attr("id");
        $(".option").each(function() {
            var tmp = $(this).attr("id");
            if ( tmp === option_id ) {
                $(this).addClass("checked");
                $("#rb" + tmp).attr("checked", "checked");  
                if (tmp === "default") restoreDefault();
                else clearForm();
            } else { 
                $(this).removeClass("checked");
                $("#rb" + tmp).attr("checked", false);
            }
        });
    });
    
    $("#customer_address_line3").change(function() {
        var shipment_cost = $(this).val();
        $("#shipment").html(shipment_cost);
    });
    
    $("#customer_address_line3").change();
    $("#default").click();
    
    calculateSettledSubTotal();    
    
});

