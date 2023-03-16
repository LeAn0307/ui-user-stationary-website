
    var url_string = window.location.href; 
    var url = new URL(url_string);
    var id = url.searchParams.get("id");
    let baseURL ="http://127.0.0.1:8080";
    let productid=id;
    var cardId=1;
    var userId=1;
    console.log(productid);
    // fetch(baseURL+'/products/14')
    //     .then(response => response.json())
    //     .then(data => {
    //         // do something with the data
    //         document.getElementById('productName').innerHTML = JSON.stringify(data["name"]);
    //     })
    //     .catch(error => {
    //         console.error('There was a problem with the fetch operation:', error);
    //     });
    const formatter = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',

        // These options are needed to round to whole numbers if that's what you want.
        //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
        //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
    });
    $.ajax({
        url: baseURL+'/products/'+productid,
        type: 'get',
        dataType: "json",
        contentType : "application/json",
        success: function(data) {

            document.getElementById('productName').innerHTML =(data["name"]);
            document.getElementById('description').innerHTML = (data["description"].replace(/(?:\r\n|\r|\n)/g, '<br>'));
            document.getElementById('price').innerHTML = (formatter .format(data["price"]));
            document.getElementById('color').innerHTML =  (data["color"]);
            document.getElementById('imageproduct').setAttribute("src", baseURL+"/images/product/"+data["image"]);
            getCountProductOfCart(cardId)
        },
        error: function(data) {

            // Some error in ajax call
            console.log(data);
        },
    });

    function getCountProductOfCart(cardId)
    {
         $.ajax({
        url: baseURL+'/cartproduct/counterproductive/'+cardId,
        type: 'get',
        dataType: "json",
        contentType : "application/json",
        success: function(data) {

            document.getElementById('countproduct').innerText =(data);
        },
        error: function(data) {

            // Some error in ajax call
            console.log(data);
        },
    });
    
    }
    function reviewstar(rating){
        let stars = "";

        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars += '<i class="fas fa-star"></i>';
            } else if (i - rating <= 0.5) {
                stars += '<i class="fas fa-star-half-alt"></i>';
            } else {
                stars += '<i class="far fa-star"></i>';
            }
        }
        return stars;
    }
    loadReview();
    function loadReview()
    {
    $.ajax({
        url: baseURL+'/rating/product/'+productid,
        type: 'get',
        dataType: "json",
        contentType : "application/json",
        success: function(data) {
            let listreview='';

            data.map(x=>{
                console.log("aaaaaa");
                let rating =x["rateScore"];
                let reviewsta=reviewstar(rating);
                let reviews= '<div class="media mb-4">' +
                    '<img src="img/user.jpg" alt="Image" class="img-fluid mr-3 mt-1" style="width: 45px;">' +' <div class="media-body">'+
                    reviewsta +
                    '<h6>'+x["userName"] + '</h6>' +
                    '<div class="text-primary mb-2" id="rating"></div>'+
                    '<p>'+x["comment"]+'</p>' +
                    '</div>' +
                    '</div>';

                listreview=listreview+reviews;

            })
            document.getElementById("reviews").innerHTML=listreview;

            document.getElementById("sum").innerHTML='('+data.length + ' reviews'+')';
            document.getElementById("reviewcounts").innerHTML='Đánh giá( '+data.length + ')';

        },
        error: function(data) {

            // Some error in ajax call
            console.log(data);
        },
    });
}
    const form = document.querySelector('#review');

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const message = document.querySelector('#message').value;
        const productId = productid;
        const ratingScore=rating;

        // Perform validation on form fields
        if (!message ) {
            alert('Please fill out all required fields.');
            return;
        }

        // Construct the data object to send to the server
        const data = {
            comment: message,
            rateScore: ratingScore,
            userId: userId,
            productId:productid
        };

        // Send form data to server using AJAX
        const xhr = new XMLHttpRequest();
        xhr.open('POST', baseURL+'/rating');
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onload = function() {
            if (xhr.status === 200) {
               // alert('Your review has been submitted successfully!');
                swal("Thông báo! ", "Đánh giá thành công", "success");
                form.reset();
                loadReview();
                
            } else {
               // alert('Error submitting form. Please try again later.');
                swal("Thông báo! ", "Đánh giá không thành công", "error");
            }
        };
        xhr.send(JSON.stringify(data));
    });
    const stars = document.querySelectorAll('.star1');
    const ratingValue = document.querySelector('.rating-value');
    let rating = 0;

    stars.forEach((star, index) => {
        star.addEventListener('click', () => {
            rating = index + 1;
            //ratingValue.innerText = `You've rated this product ${rating} out of ${stars.length} stars.`;
            updateActiveStars();
        });
    });

    function updateActiveStars() {
        stars.forEach((star, index) => {
            console.log(index);
            if (index < rating) {
                star.classList.add('active');
            } else {
                star.classList.remove('active');
            }
        });
    }

    // Xử lý phần tăng giảm số lượng

    var elementMinus=document.querySelector('#minus');
    var elementPlus=document.querySelector('#plus');
    elementMinus.addEventListener("click", minusQuantity);
    elementPlus.addEventListener("click", plusQuantity);
    function minusQuantity() {
        var number=document.querySelector('#quantity').value;
       number=parseInt(number)-1;
        document.querySelector('#quantity').setAttribute("value",number);
    }
    function plusQuantity() {
        var number=document.querySelector('#quantity').value;
        number=parseInt(number)+1;
        document.querySelector('#quantity').setAttribute("value",number);
    }
    // Xử lý thêm vào giỏ hàng
    var elementAddToCard=document.querySelector('#addToCard');
    elementAddToCard.addEventListener("click", addToCardAction);
    function addToCardAction()
    {
        const number=document.querySelector('#quantity').value;
        const data = {
            "quantity":number,
            "productId": productid,
            "cartId": cardId
        };

        const xhr = new XMLHttpRequest();
        xhr.open('POST', baseURL+'/cartproduct');
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onload = function() {
            if (xhr.status === 200) {
                alert('Thêm sản phẩm thành công');
                getCountProductOfCart(cardId);
                
            } else {
                alert('Lỗi ');
            }
        };
        xhr.send(JSON.stringify(data));
    }
