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
                //alert(error);
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


})(jQuery);

