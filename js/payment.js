/**
 * Created by hp on 7/12/2014.
 */

function payVerify() {
    var fields = ["#card_no", "#sc", "#card_holder"];
    console.log("abc");
    var error_msgs = [];

    var cardNo= $("#card_no").val();
    var Scode = $("#sc").val();
    var holder = $("#card_holder").val();

    if (cardNo.length < 1) {
        $("#card_no").addClass("error_field");
        error_msgs[error_msgs.length] = "Missing card number.";
    } else {
        $("#card_no").removeClass("error_field");
    }

    if (holder.length < 1) {
        $("#card_holder").addClass("error_field");
        error_msgs[error_msgs.length] = "Missing card holder name.";
    } else {
        $("#card_holder").removeClass("error_field");
    }

    if (Scode.length < 1) {
        $("#sc").addClass("error_field");
        error_msgs[error_msgs.length] = "Missing security code.";
    } else {
        $("#sc").removeClass("error_field");
    }

    console.log(error_msgs);
    if (error_msgs.length == 0) {
        alert("Payment Accepted\nThank you for purchasing our products\nDelivery will be processed in short");
        return true;
    } else {
        var formatted_error_msg = "";
        for (var i =0 ; i < error_msgs.length; i++) {
            formatted_error_msg += "<div>"+ (i+1) + ". " + error_msgs[i] + "</div>";
            console.log(formatted_error_msg);
        }
        $("#error1_msg").html(formatted_error_msg);
        $("#error1_msg").css("display", "inline-block");

        return false;
    }
}