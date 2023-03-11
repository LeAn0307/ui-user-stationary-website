
const loginButton = document.getElementById('loginbtn');
const inputEmail = document.getElementById('emailLogin');
const inputPass = document.getElementById('passwordLogin');
loginButton.addEventListener('click', function() {
    var emailUser = inputEmail.value;
    var pass = inputPass.value;
    $.ajax({
        type: "POST",
        url: "http://localhost:8080/accounts/login",
        contentType: "application/json",
        data: JSON.stringify({email: emailUser, accountPassword: pass}),
        success: function (result, status, xhr) {
            // if(status = 'success') {
                
                setLoginStatus(true);
                storeUser(result.id, result.userName, result.phone, result.address, result.idAccount);
                // users = localStorage.getItem('userId');
                //alert(users);
                window.location.href = "/index.html";
                
            // } else {
            //     localStorage.clear();
            // }
            console.log(result);
        },
        error: function (xhr, status, error) {
            alert("Result: " + status + " " + error + " " + xhr.status + " " + xhr.statusText)
        }
    });
});

function setLoginStatus(isLoggedIn) {
    localStorage.setItem("isLoggedIn", isLoggedIn);
}

function storeUser(id, userName, phone, address, idAccount) {
    localStorage.setItem("userId", id);
    localStorage.setItem("userName", userName);
    localStorage.setItem("phone", phone);
    localStorage.setItem("address", address);
    localStorage.setItem("idAccount", idAccount);
}

