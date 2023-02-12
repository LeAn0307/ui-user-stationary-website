(function ($) {
    "use strict";
    var discount=1;
    // Dropdown on mouse hover
    $(document).ready(function () {
        function toggleNavbarMethod() {
            if ($(window).width() > 992) {
                $('.navbar .dropdown').on('mouseover', function () {
                    $('.dropdown-toggle', this).trigger('click');
                }).on('mouseout', function () {
                    $('.dropdown-toggle', this).trigger('click').blur();
                });
            } else {
                $('.navbar .dropdown').off('mouseover').off('mouseout');
            }
        }
        toggleNavbarMethod();
        $(window).resize(toggleNavbarMethod);

        $.ajax({
            type:"GET",
            url:"http://localhost:8080/cart/1",
            success:function (data){
                $("#subtotal").text(data.total);
                $("#total-bill").text(data.total*discount + 10);
            },
            error: function (xhr, status, error){
                console.error(error);
                alert(error);
            }
        })


        $.ajax({
            type:"GET",
            url:"http://localhost:8080/products/idcart/1",
            success:function (data){
                $.each(data, function (index,value){
                    $("#row-table").append("<tr>\n" +
                        "                            <td class=\"align-middle\"><img src=\"img/product-1.jpg\" alt=\"\" style=\"width: 50px;\"> "+ value.name+"</td>\n" +
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
        })
    });
    
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });


    // Vendor carousel
    $('.vendor-carousel').owlCarousel({
        loop: true,
        margin: 29,
        nav: false,
        autoplay: true,
        smartSpeed: 1000,
        responsive: {
            0:{
                items:2
            },
            576:{
                items:3
            },
            768:{
                items:4
            },
            992:{
                items:5
            },
            1200:{
                items:6
            }
        }
    });


    // Related carousel
    $('.related-carousel').owlCarousel({
        loop: true,
        margin: 29,
        nav: false,
        autoplay: true,
        smartSpeed: 1000,
        responsive: {
            0:{
                items:1
            },
            576:{
                items:2
            },
            768:{
                items:3
            },
            992:{
                items:4
            }
        }
    });


    // Product Quantity

    $(document).on("click", '.quantity' , function() {
        var button = $(this);
        var oldValue = button.parent().parent().find('input').val();
        var price = parseFloat(button.parent().parent().parent().parent().find('.price').text());
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
        button.parent().parent().parent().parent().find('.total-price').text(totalPrice);
        $("#subtotal").text(subTotal);
        if (subTotal == 0) {
            $("#total-bill").text(0);
        } else {
            $("#total-bill").text(subTotal + 10)
        }
        button.parent().parent().find('input').val(newVal);
    });
    $(document).on("click", '.hide_on_click' , function() {
        var button = $(this);
        var sum = parseFloat(button.parent().parent().find('.total-price').text());
        var subTotal = parseFloat($("#subtotal").text());
        $("#subtotal").text(subTotal-sum);
        if (subTotal-sum == 0) {
            $("#total-bill").text(0);
        } else {
            $("#total-bill").text(subTotal - sum)
        }
        button.parent().parent().hide();

    });
    $(document).on("click", '.apply-code' , function() {
        var url1="http://localhost:8080/coupon/code/"+$(".codeCoupon").val();
        $.ajax({
            type:"GET",
            url:url1,
            success:function (data){
                if (data!=null){
                    //alert(data.discount);
                    discount=data.discount;
                    var subTotal = parseFloat($("#subtotal").text());
                    $("#total-bill").text(subTotal*(1-discount) + 10);
                }else alert('Coupon không tồn tại');
            },
            error: function (xhr, status, error){
                console.error(error);
                alert('Không tìm thấy');
            }
        })
    });
})(jQuery);

