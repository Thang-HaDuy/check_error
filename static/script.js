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

const [getType, setType, onTypeChange] = useState('1');

$(document).ready(function () {
    $('.tcyclone-type-dropdown-search').dropdown({
        onChange: function (value, text, $selectedItem) {
            setType(value);
            console.log(getType());
        },
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

$(document).ready(function () {
    $('.tcyclone-btn-check').on('click', function () {
        loadManholeList();
    });
});

$(document).ready(function () {
    let debounceTimer;
    $(document).on('click', '.tcyclone-btn-update', function () {
        const id = $(this).data('id'); // Lấy giá trị data-id
        // let html = AddContentModalUpdate();
        let html = ManholeTypeHandler[getType()].addContentModalUpdate();
        $('.tcyclone-modal-update').find('.content').html(html);
        UseFlatPickr();
        $.ajax({
            url: `/manhole/get-manhole-detal-v3`,
            data: {
                id: id,
                key: getType(),
            },
            method: 'GET',
            dataType: 'json',
        })
            .done(function (data) {
                ManholeTypeHandler[getType()].addDataModalUpdate(data);
                AddDropdownOnShow('.tcyclone-modal-object-name', debounceTimer);
                $('.tcyclone-modal-update').modal('show');
            })
            .fail(function (xhr, status, error) {
                alert('Lỗi server!');
            });
    });
});

$(document).ready(function () {
    let debounceTimer;

    $(document).on('click', '.tcyclone-btn-create', function () {
        let html = ManholeTypeHandler[getType()].addContentFormCreate();

        $('.tcyclone-modal-create').find('.content').html(html);
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
        AddDropdownOnShow('.tcyclone-modal-object-name-create', debounceTimer);
        $('.tcyclone-modal-object-create').dropdown('set selected', 'ROAD');
        $('.tcyclone-modal-create').modal('show');
        UseFlatPickr();
    });
});

$(document).on('click', '.tcyclone-modal-submit-create', function () {
    const container = $('.tcyclone-verified-info-content');
    const scrollTopBefore = container.scrollTop();
    let payload = ManholeTypeHandler[getType()].getDataCreate();
    $.ajax({
        type: 'POST', // Specifies the request method
        url: `/manhole/create-manhole-v3?key=${getType()}`, // The URL to send the request to
        contentType: 'application/json', // << quan trọng
        data: JSON.stringify(payload), // << convert object to JSON
        success: function (response) {
            loadManholeList(scrollTopBefore);
            $('.tcyclone-modal-create').modal('hide');
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

$(document).on('click', '.tcyclone-modal-submit', function () {
    const container = $('.tcyclone-verified-info-content');
    const scrollTopBefore = container.scrollTop();
    let payload = ManholeTypeHandler[getType()].getDataUpdate();
    console.log(payload);
    $.ajax({
        type: 'POST', // Specifies the request method
        url: `/manhole/update-manhole-v3?key=${getType()}`, // The URL to send the request to
        contentType: 'application/json', // << quan trọng
        data: JSON.stringify(payload), // << convert object to JSON
        success: function (response) {
            loadManholeList(scrollTopBefore);
            $('.tcyclone-modal-update').modal('hide');
        },
        error: function (xhr, status, error) {
            let mes = JSON.parse(xhr.responseText).detail.errorDetail;
            Swal.fire({
                title: 'Lỗi!',
                text: mes,
                icon: 'error',
                confirmButtonText: 'Đã hiểu',
            });
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
    $('.tcyclone-login-btn-v1').on('click', function () {
        let payload = {
            username: $('.tcyclone-login-username-v1').val(),
            password: $('.tcyclone-login-password-v1').val(),
        };
        $.ajax({
            type: 'POST', // Specifies the request method
            url: '/loginv1', // The URL to send the request to
            contentType: 'application/json', // << quan trọng
            data: JSON.stringify(payload), // << convert object to JSON
            success: function (response) {
                console.log(response);
                if (!response.token) {
                    alert('Lỗi phía server!');
                }
                Swal.fire({
                    title: 'Sẵn sàng!',
                    text: 'Login thành công v1!',
                    icon: 'success',
                    confirmButtonText: 'Đã hiểu',
                });
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
                Swal.fire({
                    title: 'Sẵn sàng!',
                    text: 'Login Thành Công v3!',
                    icon: 'success',
                    confirmButtonText: 'Đã hiểu',
                });
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
