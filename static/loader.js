$(document).ready(function () {
    // Gọi API khi DOM đã sẵn sàng
    $.get('/craw/craw-distance-v1', function (datas) {
        $.each(datas, function (index, item) {
            $('.tcyclone-map-v1-dropdown-search .menu').append(
                `<div class="item" data-value="${item.id}">${item.name}</div>`,
            );
        });
        alert('Đã sẵn sàng tìm kiếm!');
    });
});

$(document).ready(function () {
    // Gọi API khi DOM đã sẵn sàng
    $.get('/craw/craw-distance-v3?name=""', function (datas) {
        $.each(datas, function (index, item) {
            $('.tcyclone-map-v3-dropdown-search .menu').append(
                `<div class="item" data-value="${item.id}">${item.name}</div>`,
            );
        });
    });
});
