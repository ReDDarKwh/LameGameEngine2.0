
var logo = document.getElementById("img");
var w = logo.clientWidth / 2;
var h = logo.clientHeight / 2;



$(document).mousemove(function (e) {
    $('#img').offset({
        left: e.pageX - w,
        top: e.pageY - h
    });
});


