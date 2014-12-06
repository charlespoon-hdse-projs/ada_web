function calculateSubTotal (unitPrice, amount) {
    if (!isNaN(unitPrice) && !isNaN(amount))
        document.write((amount * unitPrice).toFixed(1));
}


$("#promotionalCodeString").click(function() {
    $(this).css("display", "none");
    $("#promotionalCodeInput").css("display", "inline-block");
});