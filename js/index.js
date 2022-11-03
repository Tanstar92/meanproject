var my_app = angular.module('my_first_app', []);
my_app.controller("my_first_controller", function($scope,$http) {
    function init(){

        console.log("Init")
        const login =  localStorage.getItem("login");
        console.log(login,$scope.isUserLogged,window.location.href)
        if(login){
            $scope.email = login.email;
            $scope.password = login.password;
            $scope.isUserLogged = true;
            if(!window.location.href.includes("index.html")){
                $scope.onLogin();
            }
        }else{
            if(!window.location.href.includes("login.html") && !window.location.href.includes("register.html")){
               // window.location = "/login.html"
            }
        }
    }


//login page is here
    $scope.email = "";
    $scope.password = "";
    $scope.isUserLogged = false;
    $scope.onLogin = () => {
        $http.post("http://localhost:3000/authenticateUser",JSON.stringify({
            "email": $scope.email,
            "password":$scope.password
        }))
            .then(function(response) {
                if(!response.data.success){
                    alert(response.data.result);
                    return;
                }
                $scope.isUserLogged = true;
                alert("Login successfully")
                localStorage.setItem("login",JSON.stringify(response.data.result));
                window.location = "/index.html"
             },function(error){
                alert("login Failed");
                console.log(error);
            });
    }
//logout function is here
    $scope.onLogout = () => {
        localStorage.removeItem("login");
        window.location = "/login.html"
    }
// this code is for registration
    $scope.onRegister = (email,password) => {
        $http.post("http://localhost:3000/createAccount",JSON.stringify({
            "email": email,
            "password":password
        }))
            .then(function(response) {
                if(!response.data.success){
                    alert(response.data.result);
                    return;
                }
                alert("Registration successful");
                $scope.isUserLogged = true;
                localStorage.setItem("login",JSON.stringify(response.data.result));
                
                window.location = "/index.html"
            },function(error){
                alert("Registration Failed");
                console.log(error);
            });
    }


    init();
});