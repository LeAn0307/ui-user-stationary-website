
const collapse = document.getElementById('collapseExample');
function checkLoginFunc() {
    const loginbtn = document.getElementById('loginBtn');
    if(localStorage.getItem('isLoggedIn')) {
        loginbtn.innerText = 'Hello ' + localStorage.getItem('userName');
        loginbtn.setAttribute("data-toggle", "collapse");
    } else {
        loginbtn.innerText = 'Đăng nhập';
        loginbtn.setAttribute("data-toggle", "");
    }
}

function Login() {
    if(!localStorage.getItem('isLoggedIn')) {
        window.location.href = "/login.html";
    }
}

function LogOut() {
    localStorage.clear();
    window.location.href = "/login.html";
}