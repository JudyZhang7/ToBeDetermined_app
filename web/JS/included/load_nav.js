$(document).ready(function() {
    $("#navbar").load("shared/menubar.html");
});
function getCode(nextPage){
    //check if code is valid
    let code = document.entry.code.value;
    window.sessionStorage.setItem("userCode", code);
    socket.emit('getUser', code);
    socket.on('codeValidation', function(validCode){
        if(validCode){
            window.location.href = nextPage;
        } else{
            alert("Invalid code. Please try again.");
        }
    });
}
