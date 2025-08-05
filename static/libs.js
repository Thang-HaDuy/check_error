function useState(initialValue) {
    let value = initialValue;
    const listeners = [];

    function setState(newValue) {
        value = newValue;
        listeners.forEach((listener) => listener(value));
    }

    function subscribe(callback) {
        listeners.push(callback);
        callback(value); // gọi callback lần đầu
    }

    return [() => value, setState, subscribe];
}

function CheckErrorObject(name, distance_0km) {
    const parts = name.split('('); // chia thành các đoạn giữa các dấu "("
    const lastPart = parts[parts.length - 1]; // lấy đoạn cuối "700.0 - 1000.0)"

    const [min, max] = lastPart
        .replace(')', '')
        .split('-')
        .map((s) => parseFloat(s.trim()));

    return min === 0 ? distance_0km <= max : distance_0km > min && distance_0km <= max;
}

function GetDataSearchV3(query, callback) {
    $.get(`/craw/craw-distance-v3?name=${encodeURIComponent(query)}`, function (res) {
        const html = res.map((item) => `<div class="item" data-value="${item.id}">${item.object_name}</div>`).join('');
        callback(html);
    }).fail(function (err) {
        console.error('Lỗi lấy dữ liệu dropdown:', err);
        callback('');
    });
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
        url: `/manhole/compare-manholes?v1=${valueV1}&${queryString}&key=${getType()}`,
        method: 'GET',
        beforeSend: function () {
            $('.tcyclone-total-manhole').html(`Tổng số hố ga: ?`);
            const loader = `<div class="ui active inverted dimmer"><div class="ui text loader">Loading</div></div>`;
            root.html(loader);
        },
        success: function (data) {
            $('.tcyclone-total-manhole').html(`Tổng số lượng: ${data.length}`);
            console.log(data);
            let html = ManholeTypeHandler[getType()].render(data);
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

function AddDropdownOnShow(classname, debounceTimer) {
    $(classname).dropdown({
        onShow: function () {
            const dropdown = $(this);
            const input = dropdown.find('input.search');

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
        },
    });
}
// function RenderManhole(data) {
//     let html;
//     if (getType() == '1') {
//         html = data
//             .map((d, i) => {
//                 const fields = [
//                     'distance_0km',
//                     'position',
//                     'object_name',
//                     'status',
//                     'form_date',
//                     'to_date',
//                     'manhole_type',
//                     'road_edge_distance',
//                     'size',
//                 ];
//                 const nameMapping = {
//                     distance_0km: 'Khoảng cách 0km',
//                     position: 'Vị trí',
//                     object_name: 'Tên đường',
//                     status: 'Trạng thái',
//                     form_date: 'Ngày bắt đầu',
//                     to_date: 'Ngày kết thúc',
//                     manhole_type: 'loại hố ga',
//                     road_edge_distance: 'Khoảng cách mép đường',
//                     size: 'Kích thước',
//                 };

//                 const makeLi = (key) => {
//                     if (key == 'object_name' && d.v3?.object_name != null) {
//                         const errorClass = CheckErrorObject(d.v3?.object_name, d.v3?.distance_0km) ? '' : 'error';
//                         return `
//                                     <li class="${errorClass} ${'object_name' == key ? 'not-error' : ''}">
//                                         <span class="tcyclone-label">${nameMapping[key]}</span>
//                                         <span class="value">: ${d.v3?.[key] ?? 'null'} </span>
//                                     </li>`;
//                     }
//                     const isDifferent = d.v1?.[key] !== d.v3?.[key];
//                     const errorClass = isDifferent ? 'error' : '';
//                     return `
//                                 <li class="${errorClass} ${'object_name' == key ? 'not-error' : ''}">
//                                     <span class="tcyclone-label">${nameMapping[key]}</span>
//                                     <span class="value">: ${d.v3?.[key] ?? 'null'} </span>
//                                 </li>`;
//                 };

//                 return `
//                 <div class="tcyclone-w-100 tcyclone-d-flex tcyclone-verified-info-content-row">
//                     <div class="tcyclone-w-50">
//                         <div class="tcyclone-p-10">
//                             <ul class="tcyclone-info-list ui segment tcyclone-verified-info-content-row-data">
//                                 <li>
//                                     <span class="tcyclone-title">${d.v1?.process ?? 'null'}</span>
//                                     <span class="value tcyclone-text-right">${d.v1?._source ?? 'null'}</span>
//                                 </li>
//                                 <div class="ui divider"></div>
//                                 ${fields
//                                     .map(
//                                         (f) => `
//                                     <li>
//                                         <span class="tcyclone-label">${nameMapping[f]}</span>
//                                         <span class="value">: ${d.v1?.[f] ?? 'null'}</span>
//                                     </li>`,
//                                     )
//                                     .join('')}
//                             </ul>
//                         </div>
//                     </div>
//                     <div class="tcyclone-w-50">
//                         <div class="tcyclone-p-10">
//                             <ul class="tcyclone-info-list ui segment">
//                                 <li>
//                                     <span class="tcyclone-title">${d.v3?.process ?? 'null'}</span>
//                                     <span class="value tcyclone-text-right">
//                                         ${
//                                             d.v3?.id
//                                                 ? `<button class="tcyclone-btn-update mini ui primary button" data-id=${d.v3?.id}>Cập nhật</button>`
//                                                 : `<button class="tcyclone-btn-create mini ui teal button">Thêm mới</button>`
//                                         }
//                                     </span>
//                                 </li>
//                                 <div class="ui divider"></div>
//                                 ${fields.map((f) => makeLi(f)).join('')}
//                             </ul>
//                         </div>
//                     </div>
//                 </div>`;
//             })
//             .join('');
//     }
//     return html;
// }

// function AddDataModalUpdate(data) {
//     if (getType() == '1') {
//         $('.tcyclone-modal-description').val(data.description ?? '');
//         $('.tcyclone-modal-coordinates').val(data.coordinates ?? '');
//         $('.tcyclone-modal-status').dropdown('set selected', data.status_id ?? 433);
//         $('.tcyclone-modal-size').val(data.size ?? '');
//         $('.tcyclone-modal-manhole-type').dropdown('set selected', data.manhole_type_id ?? 380);
//         $('.tcyclone-modal-positon').dropdown('set selected', data.position ?? 'CENTER');
//         $('.tcyclone-modal-road-edge-distance').val(data.road_edge_distance ?? '');
//         $('.tcyclone-modal-distance-to-0km').val(data.distance_0km ?? '');
//         const value = data.name_object_id ?? 1;
//         const text = data.object_name ?? '';

//         GetDataSearchV3(text.split('(')[0], function (menuHtml) {
//             const dropdown = $('.tcyclone-modal-object-name');
//             const menu = dropdown.find('.menu');
//             menu.empty().append(menuHtml);
//             dropdown.dropdown('refresh');
//             dropdown.dropdown('set selected', value);
//         });
//         $('.tcyclone-modal-object').dropdown('set selected', 'ROAD');
//         $('.tcyclone-modal-end-date').val(data.to_date ? data.to_date : '');
//         $('.tcyclone-modal-start-date').val(data.form_date ? data.form_date : '');
//         $('.tcyclone-modal-name').val(data.name ?? '');
//         $('.tcyclone-modal-organization-id').val(data.organization_id ?? 1);
//         $('.tcyclone-modal-id').val(data.id ?? '');
//     }
// }

// function AddContentFormCreate() {
//     if (getType() == '1') {
//         return `
//             <div class="tcyclone-d-flex tcyclone-align-items-center tcyclone-gap-10">
//                 <div class="tcyclone-modal-create-data tcyclone-w-100"></div>
//                 <div class="ui form">
//                     <div class="tcyclone-d-flex tcyclone-flex-wrap">
//                         <div class="field tcyclone-w-50">
//                             <div class="tcyclone-px-5">
//                                 <label>Ngày bắt đầu</label>
//                                 <div class="ui input mini">
//                                     <input
//                                         type="text"
//                                         placeholder="dd/mm/yyyy"
//                                         class="tcyclone-modal-input tcyclone-modal-start-date-create"
//                                     />
//                                 </div>
//                             </div>
//                         </div>
//                         <div class="field tcyclone-w-50">
//                             <div class="tcyclone-px-5">
//                                 <label>Ngày kết thúc</label>
//                                 <div class="ui input mini">
//                                     <input
//                                         type="text"
//                                         placeholder="dd/mm/yyyy"
//                                         class="tcyclone-modal-input tcyclone-modal-end-date-create"
//                                     />
//                                 </div>
//                             </div>
//                         </div>
//                         <div class="field tcyclone-w-50">
//                             <div class="tcyclone-px-5">
//                                 <label>Loại đối tượng</label>
//                                 <div
//                                     class="tcyclone-modal-dropdown tcyclone-modal-object-create disabled tcyclone-w-100 mini ui search selection dropdown"
//                                 >
//                                     <i class="dropdown icon"></i>
//                                     <div class="default text">V3</div>
//                                     <div class="menu">
//                                         <div class="item" data-value="ROAD">Đường</div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                         <div class="field tcyclone-w-50">
//                             <div class="tcyclone-px-5">
//                                 <label>Tên đối tượng</label>
//                                 <div
//                                     class="tcyclone-modal-dropdown tcyclone-modal-object-name-create tcyclone-w-100 mini ui search selection dropdown"
//                                 >
//                                     <i class="dropdown icon"></i>
//                                     <div class="default text">V3</div>
//                                     <div class="menu"></div>
//                                 </div>
//                             </div>
//                         </div>
//                         <div class="field tcyclone-w-50">
//                             <div class="tcyclone-px-5">
//                                 <label>Dơn vị quản lý</label>
//                                 <div class="ui disabled input mini">
//                                     <input
//                                         type="text"
//                                         class="tcyclone-modal-input disabled"
//                                         placeholder="Dơn vị quản lý..."
//                                     />
//                                 </div>
//                             </div>
//                         </div>
//                         <div class="field tcyclone-w-50">
//                             <div class="tcyclone-px-5">
//                                 <label>Khoảng cách so với km0</label>
//                                 <div class="ui input mini">
//                                     <input
//                                         type="text"
//                                         class="tcyclone-modal-input tcyclone-modal-distance-to-0km-create"
//                                         placeholder="Khoảng cách so với km0..."
//                                     />
//                                 </div>
//                             </div>
//                         </div>
//                         <div class="field tcyclone-w-50">
//                             <div class="tcyclone-px-5">
//                                 <label>Khoảng cách mép đường</label>
//                                 <div class="ui input mini">
//                                     <input
//                                         type="text"
//                                         class="tcyclone-modal-input tcyclone-modal-road-edge-distance-create"
//                                         placeholder="Khoảng cách mép đường..."
//                                     />
//                                 </div>
//                             </div>
//                         </div>
//                         <div class="field tcyclone-w-50">
//                             <div class="tcyclone-px-5">
//                                 <label>Vị trí</label>
//                                 <div
//                                     class="tcyclone-modal-dropdown tcyclone-modal-positon-create tcyclone-w-100 mini ui search selection dropdown"
//                                 >
//                                     <i class="dropdown icon"></i>
//                                     <div class="default text">Vị trí</div>
//                                     <div class="menu">
//                                         <div class="item" data-value="LEFT">Trái</div>
//                                         <div class="item" data-value="RIGHT">Phải</div>
//                                         <div class="item" data-value="CENTER">Tim</div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                         <div class="field tcyclone-w-50">
//                             <div class="tcyclone-px-5">
//                                 <label>Loại hố</label>
//                                 <div
//                                     class="tcyclone-modal-dropdown tcyclone-modal-manhole-type-create tcyclone-w-100 mini ui search selection dropdown"
//                                 >
//                                     <i class="dropdown icon"></i>
//                                     <div class="default text">Loại hố</div>
//                                     <div class="menu">
//                                         <div class="item" data-value="380">Bưu điện</div>
//                                         <div class="item" data-value="379">Cứu hỏa</div>
//                                         <div class="item" data-value="378">Nước sạch</div>
//                                         <div class="item" data-value="377">Điện lực</div>
//                                         <div class="item" data-value="376">Viễn thông</div>
//                                         <div class="item" data-value="375">Thoát nước</div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                         <div class="field tcyclone-w-50">
//                             <div class="tcyclone-px-5">
//                                 <label>Kích thước</label>
//                                 <div class="ui input mini">
//                                     <input
//                                         type="text"
//                                         class="tcyclone-modal-input tcyclone-modal-size-create"
//                                         placeholder="Kích thước..."
//                                     />
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                     <div class="field">
//                         <div class="tcyclone-px-5">
//                             <label>Tình trạng</label>
//                             <div
//                                 class="tcyclone-modal-dropdown tcyclone-modal-status-create tcyclone-w-100 mini ui search selection dropdown"
//                             >
//                                 <i class="dropdown icon"></i>
//                                 <div class="default text">V3</div>
//                                 <div class="menu">
//                                     <div class="item" data-value="433">Lún</div>
//                                     <div class="item" data-value="432">Hư hỏng</div>
//                                     <div class="item" data-value="431">mất nắp</div>
//                                     <div class="item" data-value="430">Mất</div>
//                                     <div class="item" data-value="429">Tốt</div>
//                                     <div class="item" data-value="428">Cũ, hỏng</div>
//                                     <div class="item" data-value="427">Gãy hỏng</div>
//                                     <div class="item" data-value="426">Han gỉ</div>
//                                     <div class="item" data-value="425">Cũ</div>
//                                     <div class="item" data-value="424">hỏng</div>
//                                     <div class="item" data-value="423">Bình thường</div>
//                                     <div class="item" data-value="422">Không có khung+nắp</div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                     <div class="tcyclone-d-flex tcyclone-flex-wrap">
//                         <div class="field tcyclone-w-50">
//                             <div class="tcyclone-px-5">
//                                 <label>Tọa độ</label>
//                                 <textarea
//                                     class="tcyclone-modal-input tcyclone-modal-coordinates-create"
//                                     placeholder="Tọa độ"
//                                     rows="4"
//                                 ></textarea>
//                             </div>
//                         </div>
//                         <div class="field tcyclone-w-50">
//                             <div class="tcyclone-px-5">
//                                 <label>Mô tả</label>
//                                 <textarea
//                                     class="tcyclone-modal-input tcyclone-modal-description-create"
//                                     placeholder="Mô tả"
//                                     rows="4"
//                                 ></textarea>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         `;
//     }
// }

// function GetDataCreate() {
//     if (getType() == '1') {
//         return {
//             name_object_id: $('.tcyclone-modal-object-name-create').dropdown('get value'),
//             organization_id: 1,
//             form_date: $('.tcyclone-modal-start-date-create').val(),
//             to_date: $('.tcyclone-modal-end-date-create').val(),
//             object_type: $('.tcyclone-modal-object-create').dropdown('get value'),
//             distance_0km: $('.tcyclone-modal-distance-to-0km-create').val(),
//             road_edge_distance: $('.tcyclone-modal-road-edge-distance-create').val(),
//             position: $('.tcyclone-modal-positon-create').dropdown('get value'),
//             manhole_type_id: $('.tcyclone-modal-manhole-type-create').dropdown('get value'),
//             size: $('.tcyclone-modal-size-create').val(),
//             status_id: $('.tcyclone-modal-status-create').dropdown('get value'),
//             coordinates: $('.tcyclone-modal-coordinates-create').val(),
//             description: $('.tcyclone-modal-description-create').val(),
//         };
//     }
// }

// function GetDataUpdate() {
//     if (getType() == '1') {
//         return {
//             id: $('.tcyclone-modal-id').val(),
//             name: $('.tcyclone-modal-name').val(),
//             name_object_id: $('.tcyclone-modal-object-name').dropdown('get value'),
//             organization_id: $('.tcyclone-modal-organization-id').val(),
//             form_date: $('.tcyclone-modal-start-date').val(),
//             to_date: $('.tcyclone-modal-end-date').val(),
//             object_type: $('.tcyclone-modal-object').dropdown('get value'),
//             object_name: $('.tcyclone-modal-object-name').dropdown('get value'),
//             distance_0km: $('.tcyclone-modal-distance-to-0km').val(),
//             road_edge_distance: $('.tcyclone-modal-road-edge-distance').val(),
//             position: $('.tcyclone-modal-positon').dropdown('get value'),
//             manhole_type_id: $('.tcyclone-modal-manhole-type').dropdown('get value'),
//             size: $('.tcyclone-modal-size').val(),
//             status_id: $('.tcyclone-modal-status').dropdown('get value'),
//             coordinates: $('.tcyclone-modal-coordinates').val(),
//             description: $('.tcyclone-modal-description').val(),
//         };
//     }
// }

// function AddContentModalUpdate() {
//     if (getType() == '1') {
//         let html = `<div class="ui form">
//             <input type="hidden" class="tcyclone-modal-organization-id" />
//             <input type="hidden" class="tcyclone-modal-id" />
//             <div class="field">
//                 <div class="tcyclone-px-5">
//                     <label>Tên</label>
//                     <div class="ui disabled input mini">
//                         <input
//                             disabled
//                             type="text"
//                             class="tcyclone-modal-input tcyclone-modal-name"
//                             placeholder="Tên..."
//                         />
//                     </div>
//                 </div>
//             </div>
//             <div class="tcyclone-d-flex tcyclone-flex-wrap">
//                 <div class="field tcyclone-w-50">
//                     <div class="tcyclone-px-5">
//                         <label>Ngày bắt đầu</label>
//                         <div class="ui input mini">
//                             <input
//                                 type="text"
//                                 placeholder="dd/mm/yyyy"
//                                 class="tcyclone-modal-input tcyclone-modal-start-date"
//                             />
//                         </div>
//                     </div>
//                 </div>
//                 <div class="field tcyclone-w-50">
//                     <div class="tcyclone-px-5">
//                         <label>Ngày kết thúc</label>
//                         <div class="ui input mini">
//                             <input
//                                 type="text"
//                                 placeholder="dd/mm/yyyy"
//                                 class="tcyclone-modal-input tcyclone-modal-end-date"
//                             />
//                         </div>
//                     </div>
//                 </div>
//                 <div class="field tcyclone-w-50">
//                     <div class="tcyclone-px-5">
//                         <label>Loại đối tượng</label>
//                         <div
//                             class="tcyclone-modal-dropdown tcyclone-modal-object disabled tcyclone-w-100 mini ui search selection dropdown"
//                         >
//                             <i class="dropdown icon"></i>
//                             <div class="default text">V3</div>
//                             <div class="menu">
//                                 <div class="item" data-value="ROAD">Đường</div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//                 <div class="field tcyclone-w-50">
//                     <div class="tcyclone-px-5">
//                         <label>Tên đối tượng</label>
//                         <div
//                             class="tcyclone-modal-dropdown tcyclone-modal-object-name tcyclone-w-100 mini ui search selection dropdown"
//                         >
//                             <i class="dropdown icon"></i>
//                             <div class="default text">V3</div>
//                             <div class="menu"></div>
//                         </div>
//                     </div>
//                 </div>
//                 <div class="field tcyclone-w-50">
//                     <div class="tcyclone-px-5">
//                         <label>Dơn vị quản lý</label>
//                         <div class="ui disabled input mini">
//                             <input
//                                 type="text"
//                                 class="tcyclone-modal-input disabled"
//                                 placeholder="Dơn vị quản lý..."
//                             />
//                         </div>
//                     </div>
//                 </div>
//                 <div class="field tcyclone-w-50">
//                     <div class="tcyclone-px-5">
//                         <label>Khoảng cách so với km0</label>
//                         <div class="ui input mini">
//                             <input
//                                 type="text"
//                                 class="tcyclone-modal-input tcyclone-modal-distance-to-0km"
//                                 placeholder="Khoảng cách so với km0..."
//                             />
//                         </div>
//                     </div>
//                 </div>
//                 <div class="field tcyclone-w-50">
//                     <div class="tcyclone-px-5">
//                         <label>Khoảng cách mép đường</label>
//                         <div class="ui input mini">
//                             <input
//                                 type="text"
//                                 class="tcyclone-modal-input tcyclone-modal-road-edge-distance"
//                                 placeholder="Khoảng cách mép đường..."
//                             />
//                         </div>
//                     </div>
//                 </div>
//                 <div class="field tcyclone-w-50">
//                     <div class="tcyclone-px-5">
//                         <label>Vị trí</label>
//                         <div
//                             class="tcyclone-modal-dropdown tcyclone-modal-positon tcyclone-w-100 mini ui search selection dropdown"
//                         >
//                             <i class="dropdown icon"></i>
//                             <div class="default text">Vị trí</div>
//                             <div class="menu">
//                                 <div class="item" data-value="LEFT">Trái</div>
//                                 <div class="item" data-value="RIGHT">Phải</div>
//                                 <div class="item" data-value="CENTER">Tim</div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//                 <div class="field tcyclone-w-50">
//                     <div class="tcyclone-px-5">
//                         <label>Loại hố</label>
//                         <div
//                             class="tcyclone-modal-dropdown tcyclone-modal-manhole-type tcyclone-w-100 mini ui search selection dropdown"
//                         >
//                             <i class="dropdown icon"></i>
//                             <div class="default text">Loại hố</div>
//                             <div class="menu">
//                                 <div class="item" data-value="380">Bưu điện</div>
//                                 <div class="item" data-value="379">Cứu hỏa</div>
//                                 <div class="item" data-value="378">Nước sạch</div>
//                                 <div class="item" data-value="377">Điện lực</div>
//                                 <div class="item" data-value="376">Viễn thông</div>
//                                 <div class="item" data-value="375">Thoát nước</div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//                 <div class="field tcyclone-w-50">
//                     <div class="tcyclone-px-5">
//                         <label>Kích thước</label>
//                         <div class="ui input mini">
//                             <input
//                                 type="text"
//                                 class="tcyclone-modal-input tcyclone-modal-size"
//                                 placeholder="Kích thước..."
//                             />
//                         </div>
//                     </div>
//                 </div>
//             </div>
//             <div class="field">
//                 <div class="tcyclone-px-5">
//                     <label>Tình trạng</label>
//                     <div
//                         class="tcyclone-modal-dropdown tcyclone-modal-status tcyclone-w-100 mini ui search selection dropdown"
//                     >
//                         <i class="dropdown icon"></i>
//                         <div class="default text">V3</div>
//                         <div class="menu">
//                             <div class="item" data-value="433">Lún</div>
//                             <div class="item" data-value="432">Hư hỏng</div>
//                             <div class="item" data-value="431">mất nắp</div>
//                             <div class="item" data-value="430">Mất</div>
//                             <div class="item" data-value="429">Tốt</div>
//                             <div class="item" data-value="428">Cũ, hỏng</div>
//                             <div class="item" data-value="427">Gãy hỏng</div>
//                             <div class="item" data-value="426">Han gỉ</div>
//                             <div class="item" data-value="425">Cũ</div>
//                             <div class="item" data-value="424">hỏng</div>
//                             <div class="item" data-value="423">Bình thường</div>
//                             <div class="item" data-value="422">Không có khung+nắp</div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//             <div class="tcyclone-d-flex tcyclone-flex-wrap">
//                 <div class="field tcyclone-w-50">
//                     <div class="tcyclone-px-5">
//                         <label>Tọa độ</label>
//                         <textarea
//                             class="tcyclone-modal-input tcyclone-modal-coordinates"
//                             placeholder="Tọa độ"
//                             rows="4"
//                         ></textarea>
//                     </div>
//                 </div>
//                 <div class="field tcyclone-w-50">
//                     <div class="tcyclone-px-5">
//                         <label>Mô tả</label>
//                         <textarea
//                             class="tcyclone-modal-input tcyclone-modal-description"
//                             placeholder="Mô tả"
//                             rows="4"
//                         ></textarea>
//                     </div>
//                 </div>
//             </div>
//         </div>`;
//         return html;
//     }
// }
