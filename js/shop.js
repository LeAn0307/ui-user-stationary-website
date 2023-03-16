(function ($) {
    "use strict";
    let ft =`<div class="col-12">
                        <nav>
                          <ul class="pagination justify-content-center">`;
    // Dropdown on mouse hover
    $(document).ready(function () {



        $.ajax({
            type: "GET",
            url: "http://localhost:8080/products/count",
            success: function (data) {
                //alert(data.valueOf())
                let offset =data.valueOf()/3;
                if(data.valueOf()%3!=0){
                    offset++;
                }
                for (let i = 1; i < offset; i++) {
                    ft+=`<button class="btn btn-primary btn-ft">
                                ${i}
                                </button>`
                }
                ft+=`</ul>
                        </nav>
                    </div>`;
            },
            error: function (xhr, status, error) {
                console.error(error);
                alert(error);
            }
        })
        fetch("http://127.0.0.1:8080/products/offset/0")
            .then((response) => response.json())
            .then((data) => {
                let productList = "";
                data.forEach((product) => {
                    productList += `
    <div class="col-lg-4 col-md-6 col-sm-6 pb-1">
        <div class="product-item bg-light mb-4">
          <div class="product-img position-relative overflow-hidden">
            <img class="img-fluid w-100" src="http://127.0.0.1:8080/images/product/${product.image}" alt="">
            <div class="product-action">
              <a class="btn btn-outline-dark btn-square" href=""><i class="fa fa-shopping-cart"></i></a>
              <a class="btn btn-outline-dark btn-square" href=""><i class="far fa-heart"></i></a>
              <a class="btn btn-outline-dark btn-square" href=""><i class="fa fa-sync-alt"></i></a>
              <a class="btn btn-outline-dark btn-square" href=""><i class="fa fa-search"></i></a>
            </div>
          </div>
          <div class="text-center py-4">
            <a class="h6 text-decoration-none text-truncate" href="detail.html?id=${product.id}">${product.name}</a>
            <div class="d-flex align-items-center justify-content-center mt-2">
              <h5>${product.price}</h5><h6 class="text-muted ml-2"><del>Discount: ${product.discount}</del></h6>
            </div>
            <div class="d-flex align-items-center justify-content-center mb-1">
              <small class="fa fa-star text-primary mr-1"></small>
              <small class="fa fa-star text-primary mr-1"></small>
              <small class="fa fa-star text-primary mr-1"></small>
              <small class="fa fa-star text-primary mr-1"></small>
              <small class="fa fa-star text-primary mr-1"></small>
              <small>(${product.avgrating})</small>
            </div>
          </div>
        </div>
    </div>
      `;
                });
                productList+=ft;
                document.getElementById("product-list").innerHTML=productList;
            });

    });
    // Back to top button
    $(document).on("click", '.btn-ft' , function() {
        var button = $(this);
        //document.getElementById("product-list").innerHTML=``;

        fetch("http://127.0.0.1:8080/products/offset/"+button.text())
            .then((response) => response.json())
            .then((data) => {
                let productList = "";
                console.log(data)
                data.forEach((product) => {
                    productList += `
                <div class="col-lg-4 col-md-6 col-sm-6 pb-1">
                    <div class="product-item bg-light mb-4">
                      <div class="product-img position-relative overflow-hidden">
                        <img class="img-fluid w-100" src="http://127.0.0.1:8080/images/product/${product.image}" alt="">
                        <div class="product-action">
                          <a class="btn btn-outline-dark btn-square" href=""><i class="fa fa-shopping-cart"></i></a>
                          <a class="btn btn-outline-dark btn-square" href=""><i class="far fa-heart"></i></a>
                          <a class="btn btn-outline-dark btn-square" href=""><i class="fa fa-sync-alt"></i></a>
                          <a class="btn btn-outline-dark btn-square" href=""><i class="fa fa-search"></i></a>
                        </div>
                      </div>
                      <div class="text-center py-4">
                        <a class="h6 text-decoration-none text-truncate" href="detail.html?id=${product.id}">${product.name}</a>
                        <div class="d-flex align-items-center justify-content-center mt-2">
                          <h5>${product.price}</h5><h6 class="text-muted ml-2"><del>Discount: ${product.discount}</del></h6>
                        </div>
                        <div class="d-flex align-items-center justify-content-center mb-1">
                          <small class="fa fa-star text-primary mr-1"></small>
                          <small class="fa fa-star text-primary mr-1"></small>
                          <small class="fa fa-star text-primary mr-1"></small>
                          <small class="fa fa-star text-primary mr-1"></small>
                          <small class="fa fa-star text-primary mr-1"></small>
                          <small>(${product.avgrating})</small>
                        </div>
                      </div>
                    </div>
                </div>
                  `;
                });
                productList+=ft;
                document.getElementById("product-list").innerHTML=productList;
            });

        //alert(button.text());

    });
})(jQuery);

