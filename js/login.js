
(function ($) {
    'use strict';
    const inputEmail = document.getElementById('emailLogin');
    const inputPass = document.getElementById('passwordLogin');
    $(document).on("click", "#loginbtn", function() {
        var emailUser = inputEmail.value;
        var pass = inputPass.value;
        $.ajax({
            type: "POST",
            url: "http://localhost:8080/accounts/login",
            contentType: "application/json",
            data: JSON.stringify({ email: emailUser, accountPassword: pass }),
            success: function (result, status, xhr) {
                document.cookie = "token=" + result + ";path=/;"
                console.log(result);
                alert('Đăng nhập thành công');
                testcookie();
                window.location.href = "index.html";
            },
            error: function (xhr, status, error) {
                alert('Đăng nhập thất bại');
                //alert("Result: " + status + " " + error + " " + xhr.status + " " + xhr.statusText)
            }
        });
    })

    function testcookie() {
        var jwt = document.cookie.split(";").find(row => row .startsWith('token=')).split('=')[1];
        const decoded = jwt_decode(jwt);
        console.log(decoded.sub);

    }
})(jQuery);