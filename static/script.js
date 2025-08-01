$(document).ready(function () {
    $('.ui.dropdown').dropdown({
        clearable: true,
    });
    flatpickr('.tcyclone-modal-end-date', {
        dateFormat: 'd/m/Y',
        allowInput: true,
    });
    flatpickr('.tcyclone-modal-start-date', {
        dateFormat: 'd/m/Y',
        allowInput: true,
    });

    flatpickr('.tcyclone-modal-end-date-create', {
        dateFormat: 'd/m/Y',
        allowInput: true,
    });
    flatpickr('.tcyclone-modal-start-date-create', {
        dateFormat: 'd/m/Y',
        allowInput: true,
    });
});

$(document).ready(function () {
    let debounceTimer;

    $('.tcyclone-map-v3-dropdown-search').dropdown({
        onShow: function () {
            const dropdown = $(this);
            const input = dropdown.find('input.search');

            AddMenuSearch(input, '.tcyclone-map-v3-dropdown-search', debounceTimer);
        },
    });
});

function CheckErrorObject(name, distance_0km) {
    const parts = name.split('('); // chia thành các đoạn giữa các dấu "("
    const lastPart = parts[parts.length - 1]; // lấy đoạn cuối "700.0 - 1000.0)"

    const [min, max] = lastPart
        .replace(')', '')
        .split('-')
        .map((s) => parseFloat(s.trim()));

    return min === 0 ? distance_0km <= max : distance_0km > min && distance_0km <= max;
}

function loadManholeList(scrollRestore = null) {
    let valueV1 = $('.tcyclone-map-v1-dropdown-search').dropdown('get value');
    const root = $('.tcyclone-verified-info-content');
    let valueV3Raw = $('.tcyclone-map-v3-dropdown-search').dropdown('get value');
    // let valueV3Array = valueV3Raw.flatMap((val) => val.split(',').filter(Boolean));

    let queryString = valueV3Raw
        .split(',')
        .map((val) => `v3=${val}`)
        .join('&');

    $.ajax({
        url: `/manhole/compare-manholes?v1=${valueV1}&${queryString}`,
        method: 'GET',
        beforeSend: function () {
            $('.tcyclone-total-manhole').html(`Tổng số hố ga: ?`);
            const loader = `<div class="ui active inverted dimmer"><div class="ui text loader">Loading</div></div>`;
            root.html(loader);
        },
        success: function (data) {
            $('.tcyclone-total-manhole').html(`Tổng số hố ga: ${data.length}`);
            let html = data
                .map((d, i) => {
                    const fields = [
                        'distance_0km',
                        'position',
                        'object_name',
                        'status',
                        'form_date',
                        'to_date',
                        'manhole_type',
                        'road_edge_distance',
                        'size',
                    ];
                    const nameMapping = {
                        distance_0km: 'Khoảng cách 0km',
                        position: 'Vị trí',
                        object_name: 'Tên đường',
                        status: 'Trạng thái',
                        form_date: 'Ngày bắt đầu',
                        to_date: 'Ngày kết thúc',
                        manhole_type: 'loại hố ga',
                        road_edge_distance: 'Khoảng cách mép đường',
                        size: 'Kích thước',
                    };

                    const makeLi = (key) => {
                        if (key == 'object_name' && d.v3?.object_name != null) {
                            const errorClass = CheckErrorObject(d.v3?.object_name, d.v3?.distance_0km) ? '' : 'error';
                            return `
                                    <li class="${errorClass} ${'object_name' == key ? 'not-error' : ''}">
                                        <span class="tcyclone-label">${nameMapping[key]}</span>
                                        <span class="value">: ${d.v3?.[key] ?? 'null'} </span>
                                    </li>`;
                        }
                        const isDifferent = d.v1?.[key] !== d.v3?.[key];
                        const errorClass = isDifferent ? 'error' : '';
                        return `
                                <li class="${errorClass} ${'object_name' == key ? 'not-error' : ''}">
                                    <span class="tcyclone-label">${nameMapping[key]}</span>
                                    <span class="value">: ${d.v3?.[key] ?? 'null'} </span>
                                </li>`;
                    };

                    return `
                        <div class="tcyclone-w-100 tcyclone-d-flex tcyclone-verified-info-content-row">
                            <div class="tcyclone-w-50">
                                <div class="tcyclone-p-10">
                                    <ul class="tcyclone-info-list ui segment tcyclone-verified-info-content-row-data">
                                        <li>
                                            <span class="tcyclone-title">${d.v1?.process ?? 'null'}</span>
                                            <span class="value tcyclone-text-right">${d.v1?._source ?? 'null'}</span>
                                        </li>
                                        <div class="ui divider"></div>
                                        ${fields
                                            .map(
                                                (f) => `
                                            <li>
                                                <span class="tcyclone-label">${nameMapping[f]}</span>
                                                <span class="value">: ${d.v1?.[f] ?? 'null'}</span>
                                            </li>`,
                                            )
                                            .join('')}
                                    </ul>
                                </div>
                            </div>
                            <div class="tcyclone-w-50">
                                <div class="tcyclone-p-10">
                                    <ul class="tcyclone-info-list ui segment">
                                        <li>
                                            <span class="tcyclone-title">${d.v3?.process ?? 'null'}</span>
                                            <span class="value tcyclone-text-right">
                                                ${
                                                    d.v3?.id
                                                        ? `<button class="tcyclone-btn-update mini ui primary button" data-id=${d.v3?.id}>Cập nhật</button>`
                                                        : `<button class="tcyclone-btn-create mini ui teal button">Thêm mới</button>`
                                                }
                                            </span>
                                        </li>
                                        <div class="ui divider"></div>
                                        ${fields.map((f) => makeLi(f)).join('')}
                                    </ul>
                                </div>
                            </div>
                        </div>`;
                })
                .join('');
            root.html(html);
            // restore scroll nếu có
            if (typeof scrollRestore === 'number') {
                setTimeout(() => {
                    root.scrollTop(scrollRestore);
                }, 200);
            }
        },
        error: function (xhr, status, error) {
            console.error('❌ Lỗi:', error);
        },
    });
}
$(document).ready(function () {
    $('.tcyclone-btn-check').on('click', function () {
        loadManholeList();
    });
});

$(document).on('click', '.tcyclone-btn-update', function () {
    const id = $(this).data('id'); // Lấy giá trị data-id
    $('.tcyclone-modal-input').val('');
    $('.tcyclone-modal-dropdown').dropdown('clear');
    $.ajax({
        url: `/manhole/get-manhole-detal-v3`,
        data: {
            id: id,
        },
        method: 'GET',
        dataType: 'json',
    })
        .done(function (data) {
            $('.tcyclone-modal-description').val(data.description ?? '');
            $('.tcyclone-modal-coordinates').val(data.coordinates ?? '');
            $('.tcyclone-modal-status').dropdown('set selected', data.status_id ?? 433);
            $('.tcyclone-modal-size').val(data.size ?? '');
            $('.tcyclone-modal-manhole-type').dropdown('set selected', data.manhole_type_id ?? 380);
            $('.tcyclone-modal-positon').dropdown('set selected', data.position ?? 'CENTER');
            $('.tcyclone-modal-road-edge-distance').val(data.road_edge_distance ?? '');
            $('.tcyclone-modal-distance-to-0km').val(data.distance_0km ?? '');
            const value = data.name_object_id ?? 1;
            const text = data.object_name ?? '';

            GetDataSearchV3(text.split('(')[0], function (menuHtml) {
                const dropdown = $('.tcyclone-modal-object-name');
                const menu = dropdown.find('.menu');
                menu.empty().append(menuHtml);
                dropdown.dropdown('refresh');
                dropdown.dropdown('set selected', value);
            });
            $('.tcyclone-modal-object').dropdown('set selected', 'ROAD');
            $('.tcyclone-modal-end-date').val(data.to_date ? data.to_date : '');
            $('.tcyclone-modal-start-date').val(data.form_date ? data.form_date : '');
            $('.tcyclone-modal-name').val(data.name ?? '');
            $('.tcyclone-modal-organization-id').val(data.organization_id ?? '');
            $('.tcyclone-modal-id').val(data.id ?? '');

            $('.tcyclone-modal-update').modal('show');
        })
        .fail(function (xhr, status, error) {
            alert('Lỗi server!');
        });
});
function GetDataSearchV3(query, callback) {
    $.get(`/craw/craw-distance-v3?name=${encodeURIComponent(query)}`, function (res) {
        const html = res.map((item) => `<div class="item" data-value="${item.id}">${item.object_name}</div>`).join('');
        callback(html);
    }).fail(function (err) {
        console.error('Lỗi lấy dữ liệu dropdown:', err);
        callback('');
    });
}
$(document).on('click', '.tcyclone-btn-create', function () {
    $('.tcyclone-modal-input').val('');
    $('.tcyclone-modal-dropdown').dropdown('clear');
    const dataDiv = $(this)
        .closest('.tcyclone-verified-info-content-row')
        .find('.tcyclone-verified-info-content-row-data')
        .clone();
    $('.tcyclone-modal-create-data').html(dataDiv);

    GetDataSearchV3('', function (menuHtml) {
        const dropdown = $('.tcyclone-modal-object-name-create');
        const menu = dropdown.find('.menu');
        menu.empty().append(menuHtml);
        dropdown.dropdown('refresh');
    });
    $('.tcyclone-modal-object-create').dropdown('set selected', 'ROAD');
    $('.tcyclone-modal-create').modal('show');
});
$(document).on('click', '.tcyclone-modal-submit-create', function () {
    const container = $('.tcyclone-verified-info-content');
    const scrollTopBefore = container.scrollTop();
    let payload = {
        name_object_id: $('.tcyclone-modal-object-name-create').dropdown('get value'),
        organization_id: 1,
        form_date: $('.tcyclone-modal-start-date-create').val(),
        to_date: $('.tcyclone-modal-end-date-create').val(),
        object_type: $('.tcyclone-modal-object-create').dropdown('get value'),
        distance_0km: $('.tcyclone-modal-distance-to-0km-create').val(),
        road_edge_distance: $('.tcyclone-modal-road-edge-distance-create').val(),
        position: $('.tcyclone-modal-positon-create').dropdown('get value'),
        manhole_type_id: $('.tcyclone-modal-manhole-type-create').dropdown('get value'),
        size: $('.tcyclone-modal-size-create').val(),
        status_id: $('.tcyclone-modal-status-create').dropdown('get value'),
        coordinates: $('.tcyclone-modal-coordinates-create').val(),
        description: $('.tcyclone-modal-description-create').val(),
    };
    $.ajax({
        type: 'POST', // Specifies the request method
        url: '/manhole/create-manhole-v3', // The URL to send the request to
        contentType: 'application/json', // << quan trọng
        data: JSON.stringify(payload), // << convert object to JSON
        success: function (response) {
            loadManholeList(scrollTopBefore);
            $('.tcyclone-modal-create').modal('hide');
            $('.tcyclone-modal-input').val('');
            $('.tcyclone-modal-dropdown').dropdown('clear');
        },
        error: function (xhr, status, error) {
            if (xhr.status == 422) {
                alert('Vui lòng đầy đủ thông tin');
            } else if (xhr.status == 500) {
                alert('Lỗi phía server!');
            }
        },
    });
});

$(document).ready(function () {
    let debounceTimer;

    $('.tcyclone-modal-object-name-create').dropdown({
        onShow: function () {
            const dropdown = $(this);
            const input = dropdown.find('input.search');

            AddMenuSearch(input, '.tcyclone-modal-object-name-create', debounceTimer);
        },
    });
});

function AddMenuSearch(input, classname, debounceTimer) {
    input.off('input.myCustomSearch').on('input.myCustomSearch', function () {
        const keyword = $(this).val();

        clearTimeout(debounceTimer);

        debounceTimer = setTimeout(() => {
            // Gọi API gợi ý / tìm kiếm
            $.get(`/craw/craw-distance-v3?name=${keyword}`, function (data) {
                const $menu = $(`${classname} .menu`);
                $menu.empty(); // Xóa các item cũ

                data.forEach((item) => {
                    $menu.append(`<div class="item" data-value="${item.id}">${item.object_name}</div>`);
                });

                $(`${classname}`).dropdown('refresh'); // Làm mới lại dropdown
            });
        }, 400);
    });
}
$(document).on('click', '.tcyclone-modal-submit', function () {
    const container = $('.tcyclone-verified-info-content');
    const scrollTopBefore = container.scrollTop();
    let payload = {
        id: $('.tcyclone-modal-id').val(),
        name: $('.tcyclone-modal-name').val(),
        name_object_id: $('.tcyclone-modal-object-name').dropdown('get value'),
        organization_id: $('.tcyclone-modal-organization-id').val(),
        form_date: $('.tcyclone-modal-start-date').val(),
        to_date: $('.tcyclone-modal-end-date').val(),
        object_type: $('.tcyclone-modal-object').dropdown('get value'),
        object_name: $('.tcyclone-modal-object-name').dropdown('get value'),
        distance_0km: $('.tcyclone-modal-distance-to-0km').val(),
        road_edge_distance: $('.tcyclone-modal-road-edge-distance').val(),
        position: $('.tcyclone-modal-positon').dropdown('get value'),
        manhole_type_id: $('.tcyclone-modal-manhole-type').dropdown('get value'),
        size: $('.tcyclone-modal-size').val(),
        status_id: $('.tcyclone-modal-status').dropdown('get value'),
        coordinates: $('.tcyclone-modal-coordinates').val(),
        description: $('.tcyclone-modal-description').val(),
    };
    $.ajax({
        type: 'POST', // Specifies the request method
        url: '/manhole/update-manhole-v3', // The URL to send the request to
        contentType: 'application/json', // << quan trọng
        data: JSON.stringify(payload), // << convert object to JSON
        success: function (response) {
            loadManholeList(scrollTopBefore);
            $('.tcyclone-modal-update').modal('hide');
            $('.tcyclone-modal-input').val('');
            $('.tcyclone-modal-dropdown').dropdown('clear');
        },
        error: function (xhr, status, error) {
            if (xhr.status == 422) {
                alert('Vui lòng đầy đủ thông tin');
            } else if (xhr.status == 500) {
                alert('Lỗi phía server!');
            }
        },
    });
});
// setTimeout(()=>{ debugger;}, 500)

$(document).ready(function () {
    $('.tcyclone-map-v3-clear').on('click', function () {
        $('.tcyclone-map-v3-dropdown-search').dropdown('clear');
    });
});

$(document).ready(function () {
    let debounceTimer;

    $('.tcyclone-modal-object-name').dropdown({
        onShow: function () {
            const dropdown = $(this);
            const input = dropdown.find('input.search');

            AddMenuSearch(input, '.tcyclone-modal-object-name', debounceTimer);
        },
    });
});

$(document).ready(function () {
    $('.tcyclone-login-btn').on('click', function () {
        let payload = {
            username: $('.tcyclone-login-username').val(),
            password: $('.tcyclone-login-password').val(),
        };
        $.ajax({
            type: 'POST', // Specifies the request method
            url: '/', // The URL to send the request to
            contentType: 'application/json', // << quan trọng
            data: JSON.stringify(payload), // << convert object to JSON
            success: function (response) {
                window.location.href = '/home';
            },
            error: function (xhr, status, error) {
                if (xhr.status == 422) {
                    alert('Vui lòng đầy đủ thông tin');
                } else if (xhr.status == 500) {
                    alert('Lỗi phía server!');
                }
            },
        });
    });
});
