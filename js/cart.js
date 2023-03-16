            
(function ($) {
    //"use strict";
        var discount=0;
        var couponPrice=0;
        var disMin=0;
        var maxMin=0;
        var jwt;
        let myJsonCopy;
        $("#form-buy").hide();
        // Dropdown on mouse hover
        $(document).ready(function () {
            if (document.cookie.indexOf("token") != -1) 
            {
                jwt = document.cookie.split(";").find(row => row.startsWith('token='))?.split('=')[1];
                console.log(jwt);
                decoded = jwt_decode(jwt);
                console.log(decoded);
                console.log(decoded.userId);
            } else {
                window.location.href = "login.html";
            }   
        
            
            $.ajax({
                type:"GET",
                url:"http://localhost:8080/cart/userid/"+ decoded.userId,
                headers: {
                    "Authorization": "Bearer "+jwt
                },
                success:function (data){
                    console.log(data);
                    localStorage.setItem("cardId",data.id);
                    $("#subtotal").text(data.total);
                    $("#total-bill").text((data.total!=0)?(data.total + 10):0);
                },
                error: function (xhr, status, error){
                    console.error(error);
                    alert(error);
                }
            });
            
            $.ajax({
                type:"GET",
                url:"http://localhost:8080/products/idcart/"+localStorage.getItem("cardId"),
                success:function (data){
                    console.log(data);
                    localStorage.setItem("myCart" ,JSON.stringify(data));  
                    console.log(myJsonCopy);
                    $.each(data, function (index,value){
                        $("#row-table").append("<tr>\n" +
                            "                            <td class=\"align-middle name\"><img src=\"img/"+value.image+"\" alt=\"\" style=\"width: 50px;\">"+value.name+"</td>\n" +
                            "                            <td class=\"align-middle price\">"+value.price+"</td>\n" +
                            "                            <td class=\"align-middle\">\n" +
                            "                                <div class=\"input-group mx-auto\" style=\"width: 100px;\">\n" +
                            "                                    <div class=\"input-group-btn\">\n" +
                            "                                        <button class=\"btn quantity btn-sm btn-primary btn-minus\" >\n" +
                            "                                        <i class=\"fa fa-minus\"></i>\n" +
                            "                                        </button>\n" +
                            "                                    </div>\n" +
                            "                                    <input type=\"text\" class=\"amount form-control form-control-sm bg-secondary border-0 text-center\" value=\""+value.quantity+"\">\n" +
                            "                                    <div class=\"input-group-btn\">\n" +
                            "                                        <button class=\"btn quantity btn-sm btn-primary btn-plus\">\n" +
                            "                                            <i class=\"fa fa-plus\"></i>\n" +
                            "                                        </button>\n" +
                            "                                    </div>\n" +
                            "                                </div>\n" +
                            "                            </td>\n" +
                            "                            <td class=\"align-middle total-price\">"+value.price*value.quantity+"</td>\n" +
                            "                            <td class=\"align-middle\"><button class=\"btn btn-sm btn-danger hide_on_click\"><i class=\"fa fa-times\"></i></button></td>\n" +
                            "                        </tr>");

                    });
                },
                error: function (xhr, status, error){
                    console.error(error);
                    alert(error);
                }
            });
            $.ajax({
                type:"GET",
                url:"http://localhost:8080/users/"+decoded.userId,
                headers: {
                    "Authorization": "Bearer "+jwt
                },
                success:function (data){
                    console.log(data);
                    $("#nameUser").val(data.userName);
                    $("#phoneUser").val(data.phone);
                    $("#addressUser").val(data.address);
                    $("#emailUser").val(data.email);
                },
                error: function (xhr, status, error){
                    console.error(error);
                    alert(error);
                }
            })
            
        });


        // Back to top button


        $(document).on("click", '.quantity' , function() {
            var button = $(this);
            var oldValue = button.parent().parent().find('input').val();
            var price = parseFloat(button.parent().parent().parent().parent().find('.price').text());
            var nameProduct = button.parent().parent().parent().parent().find('.name').text();
            var totalPrice = parseFloat(button.parent().parent().parent().parent().find('.total-price').text());
            var subTotal = parseFloat($("#subtotal").text());
            if (button.hasClass('btn-plus')) {
                var newVal = parseFloat(oldValue) + 1;
                totalPrice += price;
                subTotal += price;
            } else {
                if (oldValue > 0) {
                    var newVal = parseFloat(oldValue) - 1;
                    totalPrice -= price;
                    subTotal -= price;
                } else {
                    newVal = 0;
                }
            }
            if (couponPrice!=0){
                discount=couponPrice*subTotal;
                if(subTotal>disMin){
                    discount= (discount<maxMin)?discount:maxMin;
                    totalPrice=subTotal-discount;
                }
                var dis = document.getElementById("dis-price");
                dis.innerText=discount;

            }
            button.parent().parent().parent().parent().find('.total-price').text(totalPrice);
            $("#subtotal").text(subTotal);
            if (subTotal == 0) {
                $("#total-bill").text(0);
            } else {
                $("#total-bill").text(totalPrice+10);
            }
            button.parent().parent().find('input').val(newVal);
            // put to update quantity
            myJsonCopy= JSON.parse(localStorage.getItem("myCart"));
            console.log(myJsonCopy);
                $.each(myJsonCopy, function (index,value) {
                    //console.log(value.name === nameProduct);
                    if(value.name === nameProduct){
                        var settings = {
                            "url": "http://localhost:8080/cartproduct/"+value.id,
                            "method": "PUT",
                            "timeout": 0,
                            "headers": {
                                "Content-Type": "application/json",
                                "Authorization": "Bearer "+jwt
                            },
                            "data": JSON.stringify({
                                "quantity": newVal
                            }),
                        };

                        $.ajax(settings).done(function (response) {
                            console.log(response);
                        });
                    }
                })
            });
        $(document).on("click", '.hide_on_click' , function() {
            var button = $(this);
            var sum = parseFloat(button.parent().parent().find('.total-price').text());
            var nameProduct = button.parent().parent().find('.name').text();
            var subTotal = parseFloat($("#subtotal").text());
            $("#subtotal").text(subTotal-sum);
            if (subTotal-sum == 0) {
                $("#total-bill").text(0);
            } else {
                $("#total-bill").text(subTotal - sum)
            }
            button.parent().parent().hide();
            myJsonCopy= JSON.parse(localStorage.getItem("myCart"));
            $.each(myJsonCopy, function (index,value) {
                //console.log(value.name === nameProduct);
                if(value.name === nameProduct){
                    var settings = {
                        "url": "http://localhost:8080/cartproduct/" +value.id,
                        "method": "DELETE",
                        "timeout": 0,
                        "headers": {
                            "Authorization": "Bearer "+jwt
                        },
                    };

                    $.ajax(settings).done(function (response) {
                        console.log(response);
                    });
                }
            })
        });
        $(document).on("click", '#apply-code' , function() {
            event.preventDefault();
            var url1 = "http://localhost:8080/coupon/code/"+$(".codeCoupon").val();
            $.ajax({
                type:"GET",
                url: url1,
                headers: {
                    "Authorization": "Bearer "+jwt
                },
                success:function (data){
                    console.log(data);
                    if (data!=null && data !=""){
                        //alert(data.discount);
                        disMin = data.minPrice;
                        maxMin = data.maxPrice;
                        couponPrice=data.discount;
                        var subTotal = parseFloat($("#subtotal").text());
                        discount=data.discount*subTotal;
                        if (subTotal>=disMin) {
                            var text = document.getElementById("total-bill");
                            discount= (discount<maxMin)?discount:maxMin;
                            text.innerText = subTotal-discount+10;
                            $("#cart-summary").append("<div class=\"d-flex justify-content-between\">\n" +
                                "                            <h6 class=\"font-weight-medium\">Discount</h6>\n" +
                                "                            <h6 class=\"font-weight-medium\" id=\"dis-price\">"+ discount +"</h6>\n" +
                                "                        </div>");
                            $('#apply-code').prop('disabled', true);
                            $('.codeCoupon').prop('disabled', true);
                        } else alert('Coupon không đủ điều kiện áp dụng');
                    }else alert('Coupon không tồn tại');
                },
                error: function (xhr, status, error){

                    console.error(error);
                    alert('Không tìm thấy');
                }
            })
        });
        $(document).ready(function() {
            $('#btnChangePage').click(function() {
                //window.location.href = "checkout.html/?totalPrice="+;
                var subTotal = parseFloat($("#subtotal").text());
                if($("#subtotal").text()!=""){
                    $("#form-buy").slideToggle(800);
                } else{
                    alert("Giỏ hàng rỗng");
                }
            });
            $('#place-order').click(function (){
                var settings = {
                    "url": "http://localhost:8080/api/v1/bill",
                    "method": "POST",
                    "timeout": 0,
                    "headers": {
                        "Content-Type": "application/json",
                        "headers": {
                            "Authorization": "Bearer "+jwt
                        },
                    },
                    "data": JSON.stringify({
                        "total": $("#total-bill").text(),
                        "discount": discount,
                        "note": "đóng gói cẩn thận",
                        "payment": "thanh toán khi nhận hàng",
                        "codeMomo": "none",
                        "idBillStatus": 1,
                        "customerId": decoded.userId,
                        "address": $("#addressUser").val()
                    }),
                };

                $.ajax(settings).done(function (response) {
                    alert('dat hang thanh cong');
                }).fail(function (jqXHR, textStatus, errorThrown) {
                    alert("Đã có lỗi xảy ra");
                    //console.log("AJAX request failed: " + textStatus + ", " + errorThrown);
                });
            });

        });
        $(document).on("click", '#apply-code' , function() {
            event.preventDefault();
            var url1 = "http://localhost:8080/coupon/code/"+$(".codeCoupon").val();
            
            $.ajax({
                type:"GET",
                url: url1,
                headers: {
                    "Authorization": "Bearer "+jwt
                },
                success:function (data){
                    console.log(data);

                },
                error: function (xhr, status, error){

                    console.error(error);
                    alert('Không tìm thấy');
                }
            })
        });
    })(jQuery);

