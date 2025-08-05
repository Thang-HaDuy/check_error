const ManholeTypeHandler = {
    1: {
        render: function (data) {
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

            return html;
        },

        addDataModalUpdate: function (data) {
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
            $('.tcyclone-modal-organization-id').val(data.organization_id ?? 1);
            $('.tcyclone-modal-id').val(data.id ?? '');
        },

        addContentFormCreate: function () {
            return `
                <div class="tcyclone-d-flex tcyclone-align-items-center tcyclone-gap-10">
                    <div class="tcyclone-modal-create-data tcyclone-w-100"></div>
                    <div class="ui form">
                        <div class="tcyclone-d-flex tcyclone-flex-wrap">
                            <div class="field tcyclone-w-50">
                                <div class="tcyclone-px-5">
                                    <label>Ngày bắt đầu</label>
                                    <div class="ui input mini">
                                        <input
                                            type="text"
                                            placeholder="dd/mm/yyyy"
                                            class="tcyclone-modal-input tcyclone-modal-start-date-create"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div class="field tcyclone-w-50">
                                <div class="tcyclone-px-5">
                                    <label>Ngày kết thúc</label>
                                    <div class="ui input mini">
                                        <input
                                            type="text"
                                            placeholder="dd/mm/yyyy"
                                            class="tcyclone-modal-input tcyclone-modal-end-date-create"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div class="field tcyclone-w-50">
                                <div class="tcyclone-px-5">
                                    <label>Loại đối tượng</label>
                                    <div
                                        class="tcyclone-modal-dropdown tcyclone-modal-object-create disabled tcyclone-w-100 mini ui search selection dropdown"
                                    >
                                        <i class="dropdown icon"></i>
                                        <div class="default text">V3</div>
                                        <div class="menu">
                                            <div class="item" data-value="ROAD">Đường</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="field tcyclone-w-50">
                                <div class="tcyclone-px-5">
                                    <label>Tên đối tượng</label>
                                    <div
                                        class="tcyclone-modal-dropdown tcyclone-modal-object-name-create tcyclone-w-100 mini ui search selection dropdown"
                                    >
                                        <i class="dropdown icon"></i>
                                        <div class="default text">V3</div>
                                        <div class="menu"></div>
                                    </div>
                                </div>
                            </div>
                            <div class="field tcyclone-w-50">
                                <div class="tcyclone-px-5">
                                    <label>Dơn vị quản lý</label>
                                    <div class="ui disabled input mini">
                                        <input
                                            type="text"
                                            class="tcyclone-modal-input disabled"
                                            placeholder="Dơn vị quản lý..."
                                        />
                                    </div>
                                </div>
                            </div>
                            <div class="field tcyclone-w-50">
                                <div class="tcyclone-px-5">
                                    <label>Khoảng cách so với km0</label>
                                    <div class="ui input mini">
                                        <input
                                            type="text"
                                            class="tcyclone-modal-input tcyclone-modal-distance-to-0km-create"
                                            placeholder="Khoảng cách so với km0..."
                                        />
                                    </div>
                                </div>
                            </div>
                            <div class="field tcyclone-w-50">
                                <div class="tcyclone-px-5">
                                    <label>Khoảng cách mép đường</label>
                                    <div class="ui input mini">
                                        <input
                                            type="text"
                                            class="tcyclone-modal-input tcyclone-modal-road-edge-distance-create"
                                            placeholder="Khoảng cách mép đường..."
                                        />
                                    </div>
                                </div>
                            </div>
                            <div class="field tcyclone-w-50">
                                <div class="tcyclone-px-5">
                                    <label>Vị trí</label>
                                    <div
                                        class="tcyclone-modal-dropdown tcyclone-modal-positon-create tcyclone-w-100 mini ui search selection dropdown"
                                    >
                                        <i class="dropdown icon"></i>
                                        <div class="default text">Vị trí</div>
                                        <div class="menu">
                                            <div class="item" data-value="LEFT">Trái</div>
                                            <div class="item" data-value="RIGHT">Phải</div>
                                            <div class="item" data-value="CENTER">Tim</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="field tcyclone-w-50">
                                <div class="tcyclone-px-5">
                                    <label>Loại hố</label>
                                    <div
                                        class="tcyclone-modal-dropdown tcyclone-modal-manhole-type-create tcyclone-w-100 mini ui search selection dropdown"
                                    >
                                        <i class="dropdown icon"></i>
                                        <div class="default text">Loại hố</div>
                                        <div class="menu">
                                            <div class="item" data-value="380">Bưu điện</div>
                                            <div class="item" data-value="379">Cứu hỏa</div>
                                            <div class="item" data-value="378">Nước sạch</div>
                                            <div class="item" data-value="377">Điện lực</div>
                                            <div class="item" data-value="376">Viễn thông</div>
                                            <div class="item" data-value="375">Thoát nước</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="field tcyclone-w-50">
                                <div class="tcyclone-px-5">
                                    <label>Kích thước</label>
                                    <div class="ui input mini">
                                        <input
                                            type="text"
                                            class="tcyclone-modal-input tcyclone-modal-size-create"
                                            placeholder="Kích thước..."
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="field">
                            <div class="tcyclone-px-5">
                                <label>Tình trạng</label>
                                <div
                                    class="tcyclone-modal-dropdown tcyclone-modal-status-create tcyclone-w-100 mini ui search selection dropdown"
                                >
                                    <i class="dropdown icon"></i>
                                    <div class="default text">V3</div>
                                    <div class="menu">
                                        <div class="item" data-value="433">Lún</div>
                                        <div class="item" data-value="432">Hư hỏng</div>
                                        <div class="item" data-value="431">mất nắp</div>
                                        <div class="item" data-value="430">Mất</div>
                                        <div class="item" data-value="429">Tốt</div>
                                        <div class="item" data-value="428">Cũ, hỏng</div>
                                        <div class="item" data-value="427">Gãy hỏng</div>
                                        <div class="item" data-value="426">Han gỉ</div>
                                        <div class="item" data-value="425">Cũ</div>
                                        <div class="item" data-value="424">hỏng</div>
                                        <div class="item" data-value="423">Bình thường</div>
                                        <div class="item" data-value="422">Không có khung+nắp</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="tcyclone-d-flex tcyclone-flex-wrap">
                            <div class="field tcyclone-w-50">
                                <div class="tcyclone-px-5">
                                    <label>Tọa độ</label>
                                    <textarea
                                        class="tcyclone-modal-input tcyclone-modal-coordinates-create"
                                        placeholder="Tọa độ"
                                        rows="4"
                                    ></textarea>
                                </div>
                            </div>
                            <div class="field tcyclone-w-50">
                                <div class="tcyclone-px-5">
                                    <label>Mô tả</label>
                                    <textarea
                                        class="tcyclone-modal-input tcyclone-modal-description-create"
                                        placeholder="Mô tả"
                                        rows="4"
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        },

        addContentModalUpdate: function () {
            return `
                <div class="ui form">
                    <input type="hidden" class="tcyclone-modal-organization-id" />
                    <input type="hidden" class="tcyclone-modal-id" />
                    <div class="field">
                        <div class="tcyclone-px-5">
                            <label>Tên</label>
                            <div class="ui disabled input mini">
                                <input
                                    disabled
                                    type="text"
                                    class="tcyclone-modal-input tcyclone-modal-name"
                                    placeholder="Tên..."
                                />
                            </div>
                        </div>
                    </div>
                    <div class="tcyclone-d-flex tcyclone-flex-wrap">
                        <div class="field tcyclone-w-50">
                            <div class="tcyclone-px-5">
                                <label>Ngày bắt đầu</label>
                                <div class="ui input mini">
                                    <input
                                        type="text"
                                        placeholder="dd/mm/yyyy"
                                        class="tcyclone-modal-input tcyclone-modal-start-date"
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="field tcyclone-w-50">
                            <div class="tcyclone-px-5">
                                <label>Ngày kết thúc</label>
                                <div class="ui input mini">
                                    <input
                                        type="text"
                                        placeholder="dd/mm/yyyy"
                                        class="tcyclone-modal-input tcyclone-modal-end-date"
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="field tcyclone-w-50">
                            <div class="tcyclone-px-5">
                                <label>Loại đối tượng</label>
                                <div
                                    class="tcyclone-modal-dropdown tcyclone-modal-object disabled tcyclone-w-100 mini ui search selection dropdown"
                                >
                                    <i class="dropdown icon"></i>
                                    <div class="default text">V3</div>
                                    <div class="menu">
                                        <div class="item" data-value="ROAD">Đường</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="field tcyclone-w-50">
                            <div class="tcyclone-px-5">
                                <label>Tên đối tượng</label>
                                <div
                                    class="tcyclone-modal-dropdown tcyclone-modal-object-name tcyclone-w-100 mini ui search selection dropdown"
                                >
                                    <i class="dropdown icon"></i>
                                    <div class="default text">V3</div>
                                    <div class="menu"></div>
                                </div>
                            </div>
                        </div>
                        <div class="field tcyclone-w-50">
                            <div class="tcyclone-px-5">
                                <label>Dơn vị quản lý</label>
                                <div class="ui disabled input mini">
                                    <input
                                        type="text"
                                        class="tcyclone-modal-input disabled"
                                        placeholder="Dơn vị quản lý..."
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="field tcyclone-w-50">
                            <div class="tcyclone-px-5">
                                <label>Khoảng cách so với km0</label>
                                <div class="ui input mini">
                                    <input
                                        type="text"
                                        class="tcyclone-modal-input tcyclone-modal-distance-to-0km"
                                        placeholder="Khoảng cách so với km0..."
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="field tcyclone-w-50">
                            <div class="tcyclone-px-5">
                                <label>Khoảng cách mép đường</label>
                                <div class="ui input mini">
                                    <input
                                        type="text"
                                        class="tcyclone-modal-input tcyclone-modal-road-edge-distance"
                                        placeholder="Khoảng cách mép đường..."
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="field tcyclone-w-50">
                            <div class="tcyclone-px-5">
                                <label>Vị trí</label>
                                <div
                                    class="tcyclone-modal-dropdown tcyclone-modal-positon tcyclone-w-100 mini ui search selection dropdown"
                                >
                                    <i class="dropdown icon"></i>
                                    <div class="default text">Vị trí</div>
                                    <div class="menu">
                                        <div class="item" data-value="LEFT">Trái</div>
                                        <div class="item" data-value="RIGHT">Phải</div>
                                        <div class="item" data-value="CENTER">Tim</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="field tcyclone-w-50">
                            <div class="tcyclone-px-5">
                                <label>Loại hố</label>
                                <div
                                    class="tcyclone-modal-dropdown tcyclone-modal-manhole-type tcyclone-w-100 mini ui search selection dropdown"
                                >
                                    <i class="dropdown icon"></i>
                                    <div class="default text">Loại hố</div>
                                    <div class="menu">
                                        <div class="item" data-value="380">Bưu điện</div>
                                        <div class="item" data-value="379">Cứu hỏa</div>
                                        <div class="item" data-value="378">Nước sạch</div>
                                        <div class="item" data-value="377">Điện lực</div>
                                        <div class="item" data-value="376">Viễn thông</div>
                                        <div class="item" data-value="375">Thoát nước</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="field tcyclone-w-50">
                            <div class="tcyclone-px-5">
                                <label>Kích thước</label>
                                <div class="ui input mini">
                                    <input
                                        type="text"
                                        class="tcyclone-modal-input tcyclone-modal-size"
                                        placeholder="Kích thước..."
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="field">
                        <div class="tcyclone-px-5">
                            <label>Tình trạng</label>
                            <div
                                class="tcyclone-modal-dropdown tcyclone-modal-status tcyclone-w-100 mini ui search selection dropdown"
                            >
                                <i class="dropdown icon"></i>
                                <div class="default text">V3</div>
                                <div class="menu">
                                    <div class="item" data-value="433">Lún</div>
                                    <div class="item" data-value="432">Hư hỏng</div>
                                    <div class="item" data-value="431">mất nắp</div>
                                    <div class="item" data-value="430">Mất</div>
                                    <div class="item" data-value="429">Tốt</div>
                                    <div class="item" data-value="428">Cũ, hỏng</div>
                                    <div class="item" data-value="427">Gãy hỏng</div>
                                    <div class="item" data-value="426">Han gỉ</div>
                                    <div class="item" data-value="425">Cũ</div>
                                    <div class="item" data-value="424">hỏng</div>
                                    <div class="item" data-value="423">Bình thường</div>
                                    <div class="item" data-value="422">Không có khung+nắp</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="tcyclone-d-flex tcyclone-flex-wrap">
                        <div class="field tcyclone-w-50">
                            <div class="tcyclone-px-5">
                                <label>Tọa độ</label>
                                <textarea
                                    class="tcyclone-modal-input tcyclone-modal-coordinates"
                                    placeholder="Tọa độ"
                                    rows="4"
                                ></textarea>
                            </div>
                        </div>
                        <div class="field tcyclone-w-50">
                            <div class="tcyclone-px-5">
                                <label>Mô tả</label>
                                <textarea
                                    class="tcyclone-modal-input tcyclone-modal-description"
                                    placeholder="Mô tả"
                                    rows="4"
                                ></textarea>
                            </div>
                        </div>
                    </div>
                </div>`;
        },

        getDataCreate: function () {
            return {
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
        },

        getDataUpdate: function () {
            return {
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
        },
    },
    2: {
        render: function (data) {
            let html = data
                .map((d, i) => {
                    const fields = [
                        'distance_0km',
                        'position',
                        'object_name',
                        'status',
                        'form_date',
                        'to_date',
                        'type',
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
                        type: 'loại kè',
                        road_edge_distance: 'Khoảng cách mép đường',
                        size: 'Chiều dài',
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
                                                        : `<h4 class="ui header">Không hỗ trợ thêm mới</h4>`
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

            return html;
        },

        addDataModalUpdate: function (data) {
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
            $('.tcyclone-modal-organization-id').val(data.organization_id ?? 1);
            $('.tcyclone-modal-id').val(data.id ?? '');
        },

        addContentFormCreate: function () {
            return `
                <div class="tcyclone-d-flex tcyclone-align-items-center tcyclone-gap-10">
                    <div class="tcyclone-modal-create-data tcyclone-w-100"></div>
                    <div class="ui form">
                        <div class="tcyclone-d-flex tcyclone-flex-wrap">
                            <div class="field tcyclone-w-50">
                                <div class="tcyclone-px-5">
                                    <label>Ngày bắt đầu</label>
                                    <div class="ui input mini">
                                        <input
                                            type="text"
                                            placeholder="dd/mm/yyyy"
                                            class="tcyclone-modal-input tcyclone-modal-start-date-create"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div class="field tcyclone-w-50">
                                <div class="tcyclone-px-5">
                                    <label>Ngày kết thúc</label>
                                    <div class="ui input mini">
                                        <input
                                            type="text"
                                            placeholder="dd/mm/yyyy"
                                            class="tcyclone-modal-input tcyclone-modal-end-date-create"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div class="field tcyclone-w-50">
                                <div class="tcyclone-px-5">
                                    <label>Loại đối tượng</label>
                                    <div
                                        class="tcyclone-modal-dropdown tcyclone-modal-object-create disabled tcyclone-w-100 mini ui search selection dropdown"
                                    >
                                        <i class="dropdown icon"></i>
                                        <div class="default text">V3</div>
                                        <div class="menu">
                                            <div class="item" data-value="ROAD">Đường</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="field tcyclone-w-50">
                                <div class="tcyclone-px-5">
                                    <label>Tên đối tượng</label>
                                    <div
                                        class="tcyclone-modal-dropdown tcyclone-modal-object-name-create tcyclone-w-100 mini ui search selection dropdown"
                                    >
                                        <i class="dropdown icon"></i>
                                        <div class="default text">V3</div>
                                        <div class="menu"></div>
                                    </div>
                                </div>
                            </div>
                            <div class="field tcyclone-w-50">
                                <div class="tcyclone-px-5">
                                    <label>Dơn vị quản lý</label>
                                    <div class="ui disabled input mini">
                                        <input
                                            type="text"
                                            class="tcyclone-modal-input disabled"
                                            placeholder="Dơn vị quản lý..."
                                        />
                                    </div>
                                </div>
                            </div>
                            <div class="field tcyclone-w-50">
                                <div class="tcyclone-px-5">
                                    <label>Khoảng cách so với km0</label>
                                    <div class="ui input mini">
                                        <input
                                            type="text"
                                            class="tcyclone-modal-input tcyclone-modal-distance-to-0km-create"
                                            placeholder="Khoảng cách so với km0..."
                                        />
                                    </div>
                                </div>
                            </div>
                            <div class="field tcyclone-w-50">
                                <div class="tcyclone-px-5">
                                    <label>Khoảng cách mép đường</label>
                                    <div class="ui input mini">
                                        <input
                                            type="text"
                                            class="tcyclone-modal-input tcyclone-modal-road-edge-distance-create"
                                            placeholder="Khoảng cách mép đường..."
                                        />
                                    </div>
                                </div>
                            </div>
                            <div class="field tcyclone-w-50">
                                <div class="tcyclone-px-5">
                                    <label>Vị trí</label>
                                    <div
                                        class="tcyclone-modal-dropdown tcyclone-modal-positon-create tcyclone-w-100 mini ui search selection dropdown"
                                    >
                                        <i class="dropdown icon"></i>
                                        <div class="default text">Vị trí</div>
                                        <div class="menu">
                                            <div class="item" data-value="LEFT">Trái</div>
                                            <div class="item" data-value="RIGHT">Phải</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="field tcyclone-w-50">
                                <div class="tcyclone-px-5">
                                    <label>Loại kè</label>
                                    <div
                                        class="tcyclone-modal-dropdown tcyclone-modal-manhole-type-create tcyclone-w-100 mini ui search selection dropdown"
                                    >
                                        <i class="dropdown icon"></i>
                                        <div class="default text">Loại kè</div>
                                        <div class="menu">
                                            <div class="item" data-value="171">Bê tông cốt thép</div>
                                            <div class="item" data-value="172">Kè đá hộc</div>
                                            <div class="item" data-value="323">Bê tông xi măng</div>
                                            <div class="item" data-value="324">Gạch xây</div>
                                            <div class="item" data-value="325">Đá xây</div>
                                            <div class="item" data-value="326">Ốp mái đá hộc</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="field tcyclone-w-50">
                                <div class="tcyclone-px-5">
                                    <label>Kích thước</label>
                                    <div class="ui input mini">
                                        <input
                                            type="text"
                                            class="tcyclone-modal-input tcyclone-modal-size-create"
                                            placeholder="Kích thước..."
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="field">
                            <div class="tcyclone-px-5">
                                <label>Tình trạng</label>
                                <div
                                    class="tcyclone-modal-dropdown tcyclone-modal-status-create tcyclone-w-100 mini ui search selection dropdown"
                                >
                                    <i class="dropdown icon"></i>
                                    <div class="default text">V3</div>
                                    <div class="menu">
                                        <div class="item" data-value="436">Tốt</div>
                                        <div class="item" data-value="435">Bình thường</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="tcyclone-d-flex tcyclone-flex-wrap">
                            <div class="field tcyclone-w-50">
                                <div class="tcyclone-px-5">
                                    <label>Tọa độ</label>
                                    <textarea
                                        class="tcyclone-modal-input tcyclone-modal-coordinates-create"
                                        placeholder="Tọa độ"
                                        rows="4"
                                    ></textarea>
                                </div>
                            </div>
                            <div class="field tcyclone-w-50">
                                <div class="tcyclone-px-5">
                                    <label>Mô tả</label>
                                    <textarea
                                        class="tcyclone-modal-input tcyclone-modal-description-create"
                                        placeholder="Mô tả"
                                        rows="4"
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        },

        addContentModalUpdate: function () {
            return `
                <div class="ui form">
                    <input type="hidden" class="tcyclone-modal-organization-id" />
                    <input type="hidden" class="tcyclone-modal-id" />
                    <div class="field">
                        <div class="tcyclone-px-5">
                            <label>Tên</label>
                            <div class="ui disabled input mini">
                                <input
                                    disabled
                                    type="text"
                                    class="tcyclone-modal-input tcyclone-modal-name"
                                    placeholder="Tên..."
                                />
                            </div>
                        </div>
                    </div>
                    <div class="tcyclone-d-flex tcyclone-flex-wrap">
                        <div class="field tcyclone-w-50">
                            <div class="tcyclone-px-5">
                                <label>Ngày bắt đầu</label>
                                <div class="ui input mini">
                                    <input
                                        type="text"
                                        placeholder="dd/mm/yyyy"
                                        class="tcyclone-modal-input tcyclone-modal-start-date"
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="field tcyclone-w-50">
                            <div class="tcyclone-px-5">
                                <label>Ngày kết thúc</label>
                                <div class="ui input mini">
                                    <input
                                        type="text"
                                        placeholder="dd/mm/yyyy"
                                        class="tcyclone-modal-input tcyclone-modal-end-date"
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="field tcyclone-w-50">
                            <div class="tcyclone-px-5">
                                <label>Loại đối tượng</label>
                                <div
                                    class="tcyclone-modal-dropdown tcyclone-modal-object disabled tcyclone-w-100 mini ui search selection dropdown"
                                >
                                    <i class="dropdown icon"></i>
                                    <div class="default text">V3</div>
                                    <div class="menu">
                                        <div class="item" data-value="ROAD">Đường</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="field tcyclone-w-50">
                            <div class="tcyclone-px-5">
                                <label>Tên đối tượng</label>
                                <div
                                    class="tcyclone-modal-dropdown tcyclone-modal-object-name tcyclone-w-100 mini ui search selection dropdown"
                                >
                                    <i class="dropdown icon"></i>
                                    <div class="default text">V3</div>
                                    <div class="menu"></div>
                                </div>
                            </div>
                        </div>
                        <div class="field tcyclone-w-50">
                            <div class="tcyclone-px-5">
                                <label>Dơn vị quản lý</label>
                                <div class="ui disabled input mini">
                                    <input
                                        type="text"
                                        class="tcyclone-modal-input disabled"
                                        placeholder="Dơn vị quản lý..."
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="field tcyclone-w-50">
                            <div class="tcyclone-px-5">
                                <label>Khoảng cách so với km0</label>
                                <div class="ui input mini">
                                    <input
                                        type="text"
                                        class="tcyclone-modal-input tcyclone-modal-distance-to-0km"
                                        placeholder="Khoảng cách so với km0..."
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="field tcyclone-w-50">
                            <div class="tcyclone-px-5">
                                <label>Khoảng cách mép đường</label>
                                <div class="ui input mini">
                                    <input
                                        type="text"
                                        class="tcyclone-modal-input tcyclone-modal-road-edge-distance"
                                        placeholder="Khoảng cách mép đường..."
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="field tcyclone-w-50">
                            <div class="tcyclone-px-5">
                                <label>Vị trí</label>
                                <div
                                    class="tcyclone-modal-dropdown tcyclone-modal-positon tcyclone-w-100 mini ui search selection dropdown"
                                >
                                    <i class="dropdown icon"></i>
                                    <div class="default text">Vị trí</div>
                                    <div class="menu">
                                        <div class="item" data-value="LEFT">Trái</div>
                                        <div class="item" data-value="RIGHT">Phải</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="field tcyclone-w-50">
                            <div class="tcyclone-px-5">
                                <label>Loại kè</label>
                                <div
                                    class="tcyclone-modal-dropdown tcyclone-modal-manhole-type tcyclone-w-100 mini ui search selection dropdown"
                                >
                                    <i class="dropdown icon"></i>
                                    <div class="default text">Loại kè</div>
                                    <div class="menu">
                                        <div class="item" data-value="171">Bê tông cốt thép</div>
                                        <div class="item" data-value="172">Kè đá hộc</div>
                                        <div class="item" data-value="323">Bê tông xi măng</div>
                                        <div class="item" data-value="324">Gạch xây</div>
                                        <div class="item" data-value="325">Đá xây</div>
                                        <div class="item" data-value="326">Ốp mái đá hộc</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="field tcyclone-w-50">
                            <div class="tcyclone-px-5">
                                <label>Kích thước</label>
                                <div class="ui input mini">
                                    <input
                                        type="text"
                                        class="tcyclone-modal-input tcyclone-modal-size"
                                        placeholder="Kích thước..."
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="field">
                        <div class="tcyclone-px-5">
                            <label>Tình trạng</label>
                            <div
                                class="tcyclone-modal-dropdown tcyclone-modal-status tcyclone-w-100 mini ui search selection dropdown"
                            >
                                <i class="dropdown icon"></i>
                                <div class="default text">V3</div>
                                <div class="menu">
                                    <div class="item" data-value="436">Tốt</div>
                                    <div class="item" data-value="435">Bình thường</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="tcyclone-d-flex tcyclone-flex-wrap">
                        <div class="field tcyclone-w-50">
                            <div class="tcyclone-px-5">
                                <label>Tọa độ</label>
                                <textarea
                                    class="tcyclone-modal-input tcyclone-modal-coordinates"
                                    placeholder="Tọa độ"
                                    rows="4"
                                ></textarea>
                            </div>
                        </div>
                        <div class="field tcyclone-w-50">
                            <div class="tcyclone-px-5">
                                <label>Mô tả</label>
                                <textarea
                                    class="tcyclone-modal-input tcyclone-modal-description"
                                    placeholder="Mô tả"
                                    rows="4"
                                ></textarea>
                            </div>
                        </div>
                    </div>
                </div>`;
        },

        getDataCreate: function () {
            return {
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
        },

        getDataUpdate: function () {
            return {
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
        },
    },
    3: {
        render: function (data) {
            let html = data
                .map((d, i) => {
                    const fields = [
                        'distance_0km',
                        'position',
                        'object_name',
                        'status',
                        'form_date',
                        'to_date',
                        'type',
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
                        type: 'loại hộ lan',
                        road_edge_distance: 'Khoảng cách mép đường',
                        size: 'Chiều dài',
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
                                                        : `<h4 class="ui header">Không hỗ trợ thêm mới</h4>`
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

            return html;
        },

        addDataModalUpdate: function (data) {
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
            $('.tcyclone-modal-organization-id').val(data.organization_id ?? 1);
            $('.tcyclone-modal-id').val(data.id ?? '');
        },

        addContentFormCreate: function () {
            return `
                <div class="tcyclone-d-flex tcyclone-align-items-center tcyclone-gap-10">
                    <div class="tcyclone-modal-create-data tcyclone-w-100"></div>
                    <div class="ui form">
                        <div class="tcyclone-d-flex tcyclone-flex-wrap">
                            <div class="field tcyclone-w-50">
                                <div class="tcyclone-px-5">
                                    <label>Ngày bắt đầu</label>
                                    <div class="ui input mini">
                                        <input
                                            type="text"
                                            placeholder="dd/mm/yyyy"
                                            class="tcyclone-modal-input tcyclone-modal-start-date-create"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div class="field tcyclone-w-50">
                                <div class="tcyclone-px-5">
                                    <label>Ngày kết thúc</label>
                                    <div class="ui input mini">
                                        <input
                                            type="text"
                                            placeholder="dd/mm/yyyy"
                                            class="tcyclone-modal-input tcyclone-modal-end-date-create"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div class="field tcyclone-w-50">
                                <div class="tcyclone-px-5">
                                    <label>Loại đối tượng</label>
                                    <div
                                        class="tcyclone-modal-dropdown tcyclone-modal-object-create disabled tcyclone-w-100 mini ui search selection dropdown"
                                    >
                                        <i class="dropdown icon"></i>
                                        <div class="default text">V3</div>
                                        <div class="menu">
                                            <div class="item" data-value="ROAD">Đường</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="field tcyclone-w-50">
                                <div class="tcyclone-px-5">
                                    <label>Tên đối tượng</label>
                                    <div
                                        class="tcyclone-modal-dropdown tcyclone-modal-object-name-create tcyclone-w-100 mini ui search selection dropdown"
                                    >
                                        <i class="dropdown icon"></i>
                                        <div class="default text">V3</div>
                                        <div class="menu"></div>
                                    </div>
                                </div>
                            </div>
                            <div class="field tcyclone-w-50">
                                <div class="tcyclone-px-5">
                                    <label>Dơn vị quản lý</label>
                                    <div class="ui disabled input mini">
                                        <input
                                            type="text"
                                            class="tcyclone-modal-input disabled"
                                            placeholder="Dơn vị quản lý..."
                                        />
                                    </div>
                                </div>
                            </div>
                            <div class="field tcyclone-w-50">
                                <div class="tcyclone-px-5">
                                    <label>Khoảng cách so với km0</label>
                                    <div class="ui input mini">
                                        <input
                                            type="text"
                                            class="tcyclone-modal-input tcyclone-modal-distance-to-0km-create"
                                            placeholder="Khoảng cách so với km0..."
                                        />
                                    </div>
                                </div>
                            </div>
                            <div class="field tcyclone-w-50">
                                <div class="tcyclone-px-5">
                                    <label>Khoảng cách mép đường</label>
                                    <div class="ui input mini">
                                        <input
                                            type="text"
                                            class="tcyclone-modal-input tcyclone-modal-road-edge-distance-create"
                                            placeholder="Khoảng cách mép đường..."
                                        />
                                    </div>
                                </div>
                            </div>
                            <div class="field tcyclone-w-50">
                                <div class="tcyclone-px-5">
                                    <label>Vị trí</label>
                                    <div
                                        class="tcyclone-modal-dropdown tcyclone-modal-positon-create tcyclone-w-100 mini ui search selection dropdown"
                                    >
                                        <i class="dropdown icon"></i>
                                        <div class="default text">Vị trí</div>
                                        <div class="menu">
                                            <div class="item" data-value="LEFT">Trái</div>
                                            <div class="item" data-value="RIGHT">Phải</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="field tcyclone-w-50">
                                <div class="tcyclone-px-5">
                                    <label>Loại hộ lan</label>
                                    <div
                                        class="tcyclone-modal-dropdown tcyclone-modal-manhole-type-create tcyclone-w-100 mini ui search selection dropdown"
                                    >
                                        <i class="dropdown icon"></i>
                                        <div class="default text">Loại kè</div>
                                        <div class="menu">
                                            <div class="item" data-value="333">Tôn lượn sóng</div>
                                            <div class="item" data-value="334">Hàng rào sắt</div>
                                            <div class="item" data-value="335">Bê tông xi măng</div>
                                            <div class="item" data-value="336">Tôn mạ kẽm</div>
                                            <div class="item" data-value="337">Xây gạch</div>
                                            <div class="item" data-value="338">Đá hộc</div>
                                            <div class="item" data-value="339">Hàng rào lưới thép</div>
                                            <div class="item" data-value="340">Hàng rào xoắn</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="field tcyclone-w-50">
                                <div class="tcyclone-px-5">
                                    <label>Kích thước</label>
                                    <div class="ui input mini">
                                        <input
                                            type="text"
                                            class="tcyclone-modal-input tcyclone-modal-size-create"
                                            placeholder="Kích thước..."
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="field">
                            <div class="tcyclone-px-5">
                                <label>Tình trạng</label>
                                <div
                                    class="tcyclone-modal-dropdown tcyclone-modal-status-create tcyclone-w-100 mini ui search selection dropdown"
                                >
                                    <i class="dropdown icon"></i>
                                    <div class="default text">V3</div>
                                    <div class="menu">
                                        <div class="item" data-value="439">Bình thường</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="tcyclone-d-flex tcyclone-flex-wrap">
                            <div class="field tcyclone-w-50">
                                <div class="tcyclone-px-5">
                                    <label>Tọa độ</label>
                                    <textarea
                                        class="tcyclone-modal-input tcyclone-modal-coordinates-create"
                                        placeholder="Tọa độ"
                                        rows="4"
                                    ></textarea>
                                </div>
                            </div>
                            <div class="field tcyclone-w-50">
                                <div class="tcyclone-px-5">
                                    <label>Mô tả</label>
                                    <textarea
                                        class="tcyclone-modal-input tcyclone-modal-description-create"
                                        placeholder="Mô tả"
                                        rows="4"
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        },

        addContentModalUpdate: function () {
            return `
                <div class="ui form">
                    <input type="hidden" class="tcyclone-modal-organization-id" />
                    <input type="hidden" class="tcyclone-modal-id" />
                    <div class="field">
                        <div class="tcyclone-px-5">
                            <label>Tên</label>
                            <div class="ui disabled input mini">
                                <input
                                    disabled
                                    type="text"
                                    class="tcyclone-modal-input tcyclone-modal-name"
                                    placeholder="Tên..."
                                />
                            </div>
                        </div>
                    </div>
                    <div class="tcyclone-d-flex tcyclone-flex-wrap">
                        <div class="field tcyclone-w-50">
                            <div class="tcyclone-px-5">
                                <label>Ngày bắt đầu</label>
                                <div class="ui input mini">
                                    <input
                                        type="text"
                                        placeholder="dd/mm/yyyy"
                                        class="tcyclone-modal-input tcyclone-modal-start-date"
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="field tcyclone-w-50">
                            <div class="tcyclone-px-5">
                                <label>Ngày kết thúc</label>
                                <div class="ui input mini">
                                    <input
                                        type="text"
                                        placeholder="dd/mm/yyyy"
                                        class="tcyclone-modal-input tcyclone-modal-end-date"
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="field tcyclone-w-50">
                            <div class="tcyclone-px-5">
                                <label>Loại đối tượng</label>
                                <div
                                    class="tcyclone-modal-dropdown tcyclone-modal-object disabled tcyclone-w-100 mini ui search selection dropdown"
                                >
                                    <i class="dropdown icon"></i>
                                    <div class="default text">V3</div>
                                    <div class="menu">
                                        <div class="item" data-value="ROAD">Đường</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="field tcyclone-w-50">
                            <div class="tcyclone-px-5">
                                <label>Tên đối tượng</label>
                                <div
                                    class="tcyclone-modal-dropdown tcyclone-modal-object-name tcyclone-w-100 mini ui search selection dropdown"
                                >
                                    <i class="dropdown icon"></i>
                                    <div class="default text">V3</div>
                                    <div class="menu"></div>
                                </div>
                            </div>
                        </div>
                        <div class="field tcyclone-w-50">
                            <div class="tcyclone-px-5">
                                <label>Dơn vị quản lý</label>
                                <div class="ui disabled input mini">
                                    <input
                                        type="text"
                                        class="tcyclone-modal-input disabled"
                                        placeholder="Dơn vị quản lý..."
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="field tcyclone-w-50">
                            <div class="tcyclone-px-5">
                                <label>Khoảng cách so với km0</label>
                                <div class="ui input mini">
                                    <input
                                        type="text"
                                        class="tcyclone-modal-input tcyclone-modal-distance-to-0km"
                                        placeholder="Khoảng cách so với km0..."
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="field tcyclone-w-50">
                            <div class="tcyclone-px-5">
                                <label>Khoảng cách mép đường</label>
                                <div class="ui input mini">
                                    <input
                                        type="text"
                                        class="tcyclone-modal-input tcyclone-modal-road-edge-distance"
                                        placeholder="Khoảng cách mép đường..."
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="field tcyclone-w-50">
                            <div class="tcyclone-px-5">
                                <label>Vị trí</label>
                                <div
                                    class="tcyclone-modal-dropdown tcyclone-modal-positon tcyclone-w-100 mini ui search selection dropdown"
                                >
                                    <i class="dropdown icon"></i>
                                    <div class="default text">Vị trí</div>
                                    <div class="menu">
                                        <div class="item" data-value="LEFT">Trái</div>
                                        <div class="item" data-value="RIGHT">Phải</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="field tcyclone-w-50">
                            <div class="tcyclone-px-5">
                                <label>Loại hộ lan</label>
                                <div
                                    class="tcyclone-modal-dropdown tcyclone-modal-manhole-type tcyclone-w-100 mini ui search selection dropdown"
                                >
                                    <i class="dropdown icon"></i>
                                    <div class="default text">Loại kè</div>
                                    <div class="menu">
                                        <div class="item" data-value="333">Tôn lượn sóng</div>
                                        <div class="item" data-value="334">Hàng rào sắt</div>
                                        <div class="item" data-value="335">Bê tông xi măng</div>
                                        <div class="item" data-value="336">Tôn mạ kẽm</div>
                                        <div class="item" data-value="337">Xây gạch</div>
                                        <div class="item" data-value="338">Đá hộc</div>
                                        <div class="item" data-value="339">Hàng rào lưới thép</div>
                                        <div class="item" data-value="340">Hàng rào xoắn</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="field tcyclone-w-50">
                            <div class="tcyclone-px-5">
                                <label>Kích thước</label>
                                <div class="ui input mini">
                                    <input
                                        type="text"
                                        class="tcyclone-modal-input tcyclone-modal-size"
                                        placeholder="Kích thước..."
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="field">
                        <div class="tcyclone-px-5">
                            <label>Tình trạng</label>
                            <div
                                class="tcyclone-modal-dropdown tcyclone-modal-status tcyclone-w-100 mini ui search selection dropdown"
                            >
                                <i class="dropdown icon"></i>
                                <div class="default text">V3</div>
                                <div class="menu">
                                    <div class="item" data-value="435">Bình thường</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="tcyclone-d-flex tcyclone-flex-wrap">
                        <div class="field tcyclone-w-50">
                            <div class="tcyclone-px-5">
                                <label>Tọa độ</label>
                                <textarea
                                    class="tcyclone-modal-input tcyclone-modal-coordinates"
                                    placeholder="Tọa độ"
                                    rows="4"
                                ></textarea>
                            </div>
                        </div>
                        <div class="field tcyclone-w-50">
                            <div class="tcyclone-px-5">
                                <label>Mô tả</label>
                                <textarea
                                    class="tcyclone-modal-input tcyclone-modal-description"
                                    placeholder="Mô tả"
                                    rows="4"
                                ></textarea>
                            </div>
                        </div>
                    </div>
                </div>`;
        },

        getDataCreate: function () {
            return {
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
        },

        getDataUpdate: function () {
            return {
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
        },
    },
    4: {
        render: function (data) {
            let html = data
                .map((d, i) => {
                    const fields = [
                        'distance_0km',
                        'position',
                        'object_name',
                        'status',
                        'form_date',
                        'to_date',
                        'type',
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
                        type: 'loại cọc H',
                        road_edge_distance: 'Khoảng cách mép đường',
                        size: 'Nội dung',
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
                                                        : `<h4 class="ui header">Không hỗ trợ thêm mới</h4>`
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

            return html;
        },

        addDataModalUpdate: function (data) {
            $('.tcyclone-modal-description').val(data.description ?? '');
            $('.tcyclone-modal-coordinates').val(data.coordinates ?? '');
            $('.tcyclone-modal-status').dropdown('set selected', data.status_id ?? 433);
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
            $('.tcyclone-modal-organization-id').val(data.organization_id ?? 1);
            $('.tcyclone-modal-id').val(data.id ?? '');
        },

        addContentFormCreate: function () {
            return `
                <div class="tcyclone-d-flex tcyclone-align-items-center tcyclone-gap-10">
                    <div class="tcyclone-modal-create-data tcyclone-w-100"></div>
                    <div class="ui form">
                        <div class="tcyclone-d-flex tcyclone-flex-wrap">
                            <div class="field tcyclone-w-50">
                                <div class="tcyclone-px-5">
                                    <label>Ngày bắt đầu</label>
                                    <div class="ui input mini">
                                        <input
                                            type="text"
                                            placeholder="dd/mm/yyyy"
                                            class="tcyclone-modal-input tcyclone-modal-start-date-create"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div class="field tcyclone-w-50">
                                <div class="tcyclone-px-5">
                                    <label>Ngày kết thúc</label>
                                    <div class="ui input mini">
                                        <input
                                            type="text"
                                            placeholder="dd/mm/yyyy"
                                            class="tcyclone-modal-input tcyclone-modal-end-date-create"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div class="field tcyclone-w-50">
                                <div class="tcyclone-px-5">
                                    <label>Loại đối tượng</label>
                                    <div
                                        class="tcyclone-modal-dropdown tcyclone-modal-object-create disabled tcyclone-w-100 mini ui search selection dropdown"
                                    >
                                        <i class="dropdown icon"></i>
                                        <div class="default text">V3</div>
                                        <div class="menu">
                                            <div class="item" data-value="ROAD">Đường</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="field tcyclone-w-50">
                                <div class="tcyclone-px-5">
                                    <label>Tên đối tượng</label>
                                    <div
                                        class="tcyclone-modal-dropdown tcyclone-modal-object-name-create tcyclone-w-100 mini ui search selection dropdown"
                                    >
                                        <i class="dropdown icon"></i>
                                        <div class="default text">V3</div>
                                        <div class="menu"></div>
                                    </div>
                                </div>
                            </div>
                            <div class="field tcyclone-w-50">
                                <div class="tcyclone-px-5">
                                    <label>Dơn vị quản lý</label>
                                    <div class="ui disabled input mini">
                                        <input
                                            type="text"
                                            class="tcyclone-modal-input disabled"
                                            placeholder="Dơn vị quản lý..."
                                        />
                                    </div>
                                </div>
                            </div>
                            <div class="field tcyclone-w-50">
                                <div class="tcyclone-px-5">
                                    <label>Khoảng cách so với km0</label>
                                    <div class="ui input mini">
                                        <input
                                            type="text"
                                            class="tcyclone-modal-input tcyclone-modal-distance-to-0km-create"
                                            placeholder="Khoảng cách so với km0..."
                                        />
                                    </div>
                                </div>
                            </div>
                            <div class="field tcyclone-w-50">
                                <div class="tcyclone-px-5">
                                    <label>Khoảng cách mép đường</label>
                                    <div class="ui input mini">
                                        <input
                                            type="text"
                                            class="tcyclone-modal-input tcyclone-modal-road-edge-distance-create"
                                            placeholder="Khoảng cách mép đường..."
                                        />
                                    </div>
                                </div>
                            </div>
                            <div class="field tcyclone-w-50">
                                <div class="tcyclone-px-5">
                                    <label>Vị trí</label>
                                    <div
                                        class="tcyclone-modal-dropdown tcyclone-modal-positon-create tcyclone-w-100 mini ui search selection dropdown"
                                    >
                                        <i class="dropdown icon"></i>
                                        <div class="default text">Vị trí</div>
                                        <div class="menu">
                                            <div class="item" data-value="LEFT">Trái</div>
                                            <div class="item" data-value="RIGHT">Phải</div>
                                            <div class="item" data-value="CENTER">Tim</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="field tcyclone-w-50">
                                <div class="tcyclone-px-5">
                                    <label>Loại hộ lan</label>
                                    <div
                                        class="tcyclone-modal-dropdown tcyclone-modal-manhole-type-create tcyclone-w-100 mini ui search selection dropdown"
                                    >
                                        <i class="dropdown icon"></i>
                                        <div class="default text">Loại cọc H</div>
                                        <div class="menu">
                                            <div class="item" data-value="316">Cột H sơn trên vỉa</div>
                                            <div class="item" data-value="314">Cột BT</div>
                                            <div class="item" data-value="315">Tấm thép</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="field tcyclone-w-50">
                                <div class="tcyclone-px-5">
                                    <label>Kích thước</label>
                                    <div class="ui input mini">
                                        <input
                                            type="text"
                                            class="tcyclone-modal-input tcyclone-modal-size-create"
                                            placeholder="Kích thước..."
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="field">
                            <div class="tcyclone-px-5">
                                <label>Tình trạng</label>
                                <div
                                    class="tcyclone-modal-dropdown tcyclone-modal-status-create tcyclone-w-100 mini ui search selection dropdown"
                                >
                                    <i class="dropdown icon"></i>
                                    <div class="default text">V3</div>
                                    <div class="menu">
                                        <div class="item" data-value="411">Bình thường</div>
                                        <div class="item" data-value="412">Đổ gãy</div>
                                        <div class="item" data-value="413">Mất</div>
                                        <div class="item" data-value="414">Bàn Giao CTNC</div>
                                        <div class="item" data-value="415">Han rỉ, mờ sơn</div>
                                        <div class="item" data-value="416">Bẩn, mờ sơn</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="tcyclone-d-flex tcyclone-flex-wrap">
                            <div class="field tcyclone-w-50">
                                <div class="tcyclone-px-5">
                                    <label>Tọa độ</label>
                                    <textarea
                                        class="tcyclone-modal-input tcyclone-modal-coordinates-create"
                                        placeholder="Tọa độ"
                                        rows="4"
                                    ></textarea>
                                </div>
                            </div>
                            <div class="field tcyclone-w-50">
                                <div class="tcyclone-px-5">
                                    <label>Mô tả</label>
                                    <textarea
                                        class="tcyclone-modal-input tcyclone-modal-description-create"
                                        placeholder="Mô tả"
                                        rows="4"
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        },

        addContentModalUpdate: function () {
            return `
                <div class="ui form">
                    <input type="hidden" class="tcyclone-modal-organization-id" />
                    <input type="hidden" class="tcyclone-modal-id" />
                    <div class="field">
                        <div class="tcyclone-px-5">
                            <label>Tên</label>
                            <div class="ui disabled input mini">
                                <input
                                    disabled
                                    type="text"
                                    class="tcyclone-modal-input tcyclone-modal-name"
                                    placeholder="Tên..."
                                />
                            </div>
                        </div>
                    </div>
                    <div class="tcyclone-d-flex tcyclone-flex-wrap">
                        <div class="field tcyclone-w-50">
                            <div class="tcyclone-px-5">
                                <label>Ngày bắt đầu</label>
                                <div class="ui input mini">
                                    <input
                                        type="text"
                                        placeholder="dd/mm/yyyy"
                                        class="tcyclone-modal-input tcyclone-modal-start-date"
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="field tcyclone-w-50">
                            <div class="tcyclone-px-5">
                                <label>Ngày kết thúc</label>
                                <div class="ui input mini">
                                    <input
                                        type="text"
                                        placeholder="dd/mm/yyyy"
                                        class="tcyclone-modal-input tcyclone-modal-end-date"
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="field tcyclone-w-50">
                            <div class="tcyclone-px-5">
                                <label>Loại đối tượng</label>
                                <div
                                    class="tcyclone-modal-dropdown tcyclone-modal-object disabled tcyclone-w-100 mini ui search selection dropdown"
                                >
                                    <i class="dropdown icon"></i>
                                    <div class="default text">V3</div>
                                    <div class="menu">
                                        <div class="item" data-value="ROAD">Đường</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="field tcyclone-w-50">
                            <div class="tcyclone-px-5">
                                <label>Tên đối tượng</label>
                                <div
                                    class="tcyclone-modal-dropdown tcyclone-modal-object-name tcyclone-w-100 mini ui search selection dropdown"
                                >
                                    <i class="dropdown icon"></i>
                                    <div class="default text">V3</div>
                                    <div class="menu"></div>
                                </div>
                            </div>
                        </div>
                        <div class="field tcyclone-w-50">
                            <div class="tcyclone-px-5">
                                <label>Dơn vị quản lý</label>
                                <div class="ui disabled input mini">
                                    <input
                                        type="text"
                                        class="tcyclone-modal-input disabled"
                                        placeholder="Dơn vị quản lý..."
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="field tcyclone-w-50">
                            <div class="tcyclone-px-5">
                                <label>Khoảng cách so với km0</label>
                                <div class="ui input mini">
                                    <input
                                        type="text"
                                        class="tcyclone-modal-input tcyclone-modal-distance-to-0km"
                                        placeholder="Khoảng cách so với km0..."
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="field tcyclone-w-50">
                            <div class="tcyclone-px-5">
                                <label>Khoảng cách mép đường</label>
                                <div class="ui input mini">
                                    <input
                                        type="text"
                                        class="tcyclone-modal-input tcyclone-modal-road-edge-distance"
                                        placeholder="Khoảng cách mép đường..."
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="field tcyclone-w-50">
                            <div class="tcyclone-px-5">
                                <label>Vị trí</label>
                                <div
                                    class="tcyclone-modal-dropdown tcyclone-modal-positon tcyclone-w-100 mini ui search selection dropdown"
                                >
                                    <i class="dropdown icon"></i>
                                    <div class="default text">Vị trí</div>
                                    <div class="menu">
                                        <div class="item" data-value="LEFT">Trái</div>
                                        <div class="item" data-value="RIGHT">Phải</div>
                                        <div class="item" data-value="CENTER">Tim</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="field tcyclone-w-50">
                            <div class="tcyclone-px-5">
                                <label>Loại cọc H</label>
                                <div
                                    class="tcyclone-modal-dropdown tcyclone-modal-manhole-type tcyclone-w-100 mini ui search selection dropdown"
                                >
                                    <i class="dropdown icon"></i>
                                    <div class="default text">Loại cọc H</div>
                                    <div class="menu">
                                        <div class="item" data-value="316">Cột H sơn trên vỉa</div>
                                        <div class="item" data-value="314">Cột BT</div>
                                        <div class="item" data-value="315">Tấm thép</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="field tcyclone-w-50">
                            <div class="tcyclone-px-5">
                                <label>Tình trạng</label>
                                <div
                                    class="tcyclone-modal-dropdown tcyclone-modal-status tcyclone-w-100 mini ui search selection dropdown"
                                >
                                    <i class="dropdown icon"></i>
                                    <div class="default text">V3</div>
                                    <div class="menu">
                                        <div class="item" data-value="411">Bình thường</div>
                                        <div class="item" data-value="412">Đổ gãy</div>
                                        <div class="item" data-value="413">Mất</div>
                                        <div class="item" data-value="414">Bàn Giao CTNC</div>
                                        <div class="item" data-value="415">Han rỉ, mờ sơn</div>
                                        <div class="item" data-value="416">Bẩn, mờ sơn</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="tcyclone-d-flex tcyclone-flex-wrap">
                        <div class="field tcyclone-w-50">
                            <div class="tcyclone-px-5">
                                <label>Tọa độ</label>
                                <textarea
                                    class="tcyclone-modal-input tcyclone-modal-coordinates"
                                    placeholder="Tọa độ"
                                    rows="4"
                                ></textarea>
                            </div>
                        </div>
                        <div class="field tcyclone-w-50">
                            <div class="tcyclone-px-5">
                                <label>Mô tả</label>
                                <textarea
                                    class="tcyclone-modal-input tcyclone-modal-description"
                                    placeholder="Mô tả"
                                    rows="4"
                                ></textarea>
                            </div>
                        </div>
                    </div>
                </div>`;
        },

        getDataCreate: function () {
            return {
                name_object_id: $('.tcyclone-modal-object-name-create').dropdown('get value'),
                organization_id: 1,
                form_date: $('.tcyclone-modal-start-date-create').val(),
                to_date: $('.tcyclone-modal-end-date-create').val(),
                object_type: $('.tcyclone-modal-object-create').dropdown('get value'),
                distance_0km: $('.tcyclone-modal-distance-to-0km-create').val(),
                road_edge_distance: $('.tcyclone-modal-road-edge-distance-create').val(),
                position: $('.tcyclone-modal-positon-create').dropdown('get value'),
                manhole_type_id: $('.tcyclone-modal-manhole-type-create').dropdown('get value'),
                status_id: $('.tcyclone-modal-status-create').dropdown('get value'),
                coordinates: $('.tcyclone-modal-coordinates-create').val(),
                description: $('.tcyclone-modal-description-create').val(),
            };
        },

        getDataUpdate: function () {
            return {
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
        },
    },
    5: {
        render: function (data) {
            let html = data
                .map((d, i) => {
                    const fields = [
                        'distance_0km',
                        'position',
                        'object_name',
                        'status',
                        'form_date',
                        'to_date',
                        'type',
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
                        type: 'loại cột km',
                        road_edge_distance: 'Khoảng cách mép đường',
                        size: 'Nội dung',
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
                                                        : `<h4 class="ui header">Không hỗ trợ thêm mới</h4>`
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

            return html;
        },

        addDataModalUpdate: function (data) {
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
            $('.tcyclone-modal-organization-id').val(data.organization_id ?? 1);
            $('.tcyclone-modal-id').val(data.id ?? '');
        },

        addContentFormCreate: function () {
            return `
                <div class="tcyclone-d-flex tcyclone-align-items-center tcyclone-gap-10">
                    <div class="tcyclone-modal-create-data tcyclone-w-100"></div>
                    <div class="ui form">
                        <div class="tcyclone-d-flex tcyclone-flex-wrap">
                            <div class="field tcyclone-w-50">
                                <div class="tcyclone-px-5">
                                    <label>Ngày bắt đầu</label>
                                    <div class="ui input mini">
                                        <input
                                            type="text"
                                            placeholder="dd/mm/yyyy"
                                            class="tcyclone-modal-input tcyclone-modal-start-date-create"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div class="field tcyclone-w-50">
                                <div class="tcyclone-px-5">
                                    <label>Ngày kết thúc</label>
                                    <div class="ui input mini">
                                        <input
                                            type="text"
                                            placeholder="dd/mm/yyyy"
                                            class="tcyclone-modal-input tcyclone-modal-end-date-create"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div class="field tcyclone-w-50">
                                <div class="tcyclone-px-5">
                                    <label>Loại đối tượng</label>
                                    <div
                                        class="tcyclone-modal-dropdown tcyclone-modal-object-create disabled tcyclone-w-100 mini ui search selection dropdown"
                                    >
                                        <i class="dropdown icon"></i>
                                        <div class="default text">V3</div>
                                        <div class="menu">
                                            <div class="item" data-value="ROAD">Đường</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="field tcyclone-w-50">
                                <div class="tcyclone-px-5">
                                    <label>Tên đối tượng</label>
                                    <div
                                        class="tcyclone-modal-dropdown tcyclone-modal-object-name-create tcyclone-w-100 mini ui search selection dropdown"
                                    >
                                        <i class="dropdown icon"></i>
                                        <div class="default text">V3</div>
                                        <div class="menu"></div>
                                    </div>
                                </div>
                            </div>
                            <div class="field tcyclone-w-50">
                                <div class="tcyclone-px-5">
                                    <label>Dơn vị quản lý</label>
                                    <div class="ui disabled input mini">
                                        <input
                                            type="text"
                                            class="tcyclone-modal-input disabled"
                                            placeholder="Dơn vị quản lý..."
                                        />
                                    </div>
                                </div>
                            </div>
                            <div class="field tcyclone-w-50">
                                <div class="tcyclone-px-5">
                                    <label>Khoảng cách so với km0</label>
                                    <div class="ui input mini">
                                        <input
                                            type="text"
                                            class="tcyclone-modal-input tcyclone-modal-distance-to-0km-create"
                                            placeholder="Khoảng cách so với km0..."
                                        />
                                    </div>
                                </div>
                            </div>
                            <div class="field tcyclone-w-50">
                                <div class="tcyclone-px-5">
                                    <label>Khoảng cách mép đường</label>
                                    <div class="ui input mini">
                                        <input
                                            type="text"
                                            class="tcyclone-modal-input tcyclone-modal-road-edge-distance-create"
                                            placeholder="Khoảng cách mép đường..."
                                        />
                                    </div>
                                </div>
                            </div>
                            <div class="field tcyclone-w-50">
                                <div class="tcyclone-px-5">
                                    <label>Vị trí</label>
                                    <div
                                        class="tcyclone-modal-dropdown tcyclone-modal-positon-create tcyclone-w-100 mini ui search selection dropdown"
                                    >
                                        <i class="dropdown icon"></i>
                                        <div class="default text">Vị trí</div>
                                        <div class="menu">
                                            <div class="item" data-value="LEFT">Trái</div>
                                            <div class="item" data-value="RIGHT">Phải</div>
                                            <div class="item" data-value="CENTER">Tim</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="field tcyclone-w-50">
                                <div class="tcyclone-px-5">
                                    <label>Loại cộc km</label>
                                    <div
                                        class="tcyclone-modal-dropdown tcyclone-modal-manhole-type-create tcyclone-w-100 mini ui search selection dropdown"
                                    >
                                        <i class="dropdown icon"></i>
                                        <div class="default text">Loại cọc H</div>
                                        <div class="menu">
                                            <div class="item" data-value="150">BTCT+Bọc tôn</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="field tcyclone-w-50">
                                <div class="tcyclone-px-5">
                                    <label>Kích thước</label>
                                    <div class="ui input mini">
                                        <input
                                            type="text"
                                            class="tcyclone-modal-input tcyclone-modal-size-create"
                                            placeholder="Kích thước..."
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="field">
                            <div class="tcyclone-px-5">
                                <label>Tình trạng</label>
                                <div
                                    class="tcyclone-modal-dropdown tcyclone-modal-status-create tcyclone-w-100 mini ui search selection dropdown"
                                >
                                    <i class="dropdown icon"></i>
                                    <div class="default text">V3</div>
                                    <div class="menu">
                                        <div class="item" data-value="405">Đổ gãy</div>
                                        <div class="item" data-value="406">Mất</div>
                                        <div class="item" data-value="407">Bẩn, mờ sơn</div>
                                        <div class="item" data-value="408">Bàn giao CTNC</div>
                                        <div class="item" data-value="409">Bình thường</div>
                                        <div class="item" data-value="410">Bàn Giao CTNC</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="tcyclone-d-flex tcyclone-flex-wrap">
                            <div class="field tcyclone-w-50">
                                <div class="tcyclone-px-5">
                                    <label>Tọa độ</label>
                                    <textarea
                                        class="tcyclone-modal-input tcyclone-modal-coordinates-create"
                                        placeholder="Tọa độ"
                                        rows="4"
                                    ></textarea>
                                </div>
                            </div>
                            <div class="field tcyclone-w-50">
                                <div class="tcyclone-px-5">
                                    <label>Mô tả</label>
                                    <textarea
                                        class="tcyclone-modal-input tcyclone-modal-description-create"
                                        placeholder="Mô tả"
                                        rows="4"
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        },

        addContentModalUpdate: function () {
            return `
                <div class="ui form">
                    <input type="hidden" class="tcyclone-modal-organization-id" />
                    <input type="hidden" class="tcyclone-modal-id" />
                    <div class="field">
                        <div class="tcyclone-px-5">
                            <label>Tên</label>
                            <div class="ui disabled input mini">
                                <input
                                    disabled
                                    type="text"
                                    class="tcyclone-modal-input tcyclone-modal-name"
                                    placeholder="Tên..."
                                />
                            </div>
                        </div>
                    </div>
                    <div class="tcyclone-d-flex tcyclone-flex-wrap">
                        <div class="field tcyclone-w-50">
                            <div class="tcyclone-px-5">
                                <label>Ngày bắt đầu</label>
                                <div class="ui input mini">
                                    <input
                                        type="text"
                                        placeholder="dd/mm/yyyy"
                                        class="tcyclone-modal-input tcyclone-modal-start-date"
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="field tcyclone-w-50">
                            <div class="tcyclone-px-5">
                                <label>Ngày kết thúc</label>
                                <div class="ui input mini">
                                    <input
                                        type="text"
                                        placeholder="dd/mm/yyyy"
                                        class="tcyclone-modal-input tcyclone-modal-end-date"
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="field tcyclone-w-50">
                            <div class="tcyclone-px-5">
                                <label>Loại đối tượng</label>
                                <div
                                    class="tcyclone-modal-dropdown tcyclone-modal-object disabled tcyclone-w-100 mini ui search selection dropdown"
                                >
                                    <i class="dropdown icon"></i>
                                    <div class="default text">V3</div>
                                    <div class="menu">
                                        <div class="item" data-value="ROAD">Đường</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="field tcyclone-w-50">
                            <div class="tcyclone-px-5">
                                <label>Tên đối tượng</label>
                                <div
                                    class="tcyclone-modal-dropdown tcyclone-modal-object-name tcyclone-w-100 mini ui search selection dropdown"
                                >
                                    <i class="dropdown icon"></i>
                                    <div class="default text">V3</div>
                                    <div class="menu"></div>
                                </div>
                            </div>
                        </div>
                        <div class="field tcyclone-w-50">
                            <div class="tcyclone-px-5">
                                <label>Dơn vị quản lý</label>
                                <div class="ui disabled input mini">
                                    <input
                                        type="text"
                                        class="tcyclone-modal-input disabled"
                                        placeholder="Dơn vị quản lý..."
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="field tcyclone-w-50">
                            <div class="tcyclone-px-5">
                                <label>Khoảng cách so với km0</label>
                                <div class="ui input mini">
                                    <input
                                        type="text"
                                        class="tcyclone-modal-input tcyclone-modal-distance-to-0km"
                                        placeholder="Khoảng cách so với km0..."
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="field tcyclone-w-50">
                            <div class="tcyclone-px-5">
                                <label>Khoảng cách mép đường</label>
                                <div class="ui input mini">
                                    <input
                                        type="text"
                                        class="tcyclone-modal-input tcyclone-modal-road-edge-distance"
                                        placeholder="Khoảng cách mép đường..."
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="field tcyclone-w-50">
                            <div class="tcyclone-px-5">
                                <label>Vị trí</label>
                                <div
                                    class="tcyclone-modal-dropdown tcyclone-modal-positon tcyclone-w-100 mini ui search selection dropdown"
                                >
                                    <i class="dropdown icon"></i>
                                    <div class="default text">Vị trí</div>
                                    <div class="menu">
                                        <div class="item" data-value="LEFT">Trái</div>
                                        <div class="item" data-value="RIGHT">Phải</div>
                                        <div class="item" data-value="CENTER">Tim</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="field tcyclone-w-50">
                            <div class="tcyclone-px-5">
                                <label>Loại cột km</label>
                                <div
                                    class="tcyclone-modal-dropdown tcyclone-modal-manhole-type tcyclone-w-100 mini ui search selection dropdown"
                                >
                                    <i class="dropdown icon"></i>
                                    <div class="default text">Loại cột km</div>
                                    <div class="menu">
                                        <div class="item" data-value="150">BTCT+Bọc tôn</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="field tcyclone-w-50">
                            <div class="tcyclone-px-5">
                                <label>Kích thước</label>
                                <div class="ui input mini">
                                    <input
                                        type="text"
                                        class="tcyclone-modal-input tcyclone-modal-size"
                                        placeholder="Kích thước..."
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="field">
                        <div class="tcyclone-px-5">
                            <label>Tình trạng</label>
                            <div
                                class="tcyclone-modal-dropdown tcyclone-modal-status tcyclone-w-100 mini ui search selection dropdown"
                            >
                                <i class="dropdown icon"></i>
                                <div class="default text">V3</div>
                                <div class="menu">
                                    <div class="item" data-value="405">Đổ gãy</div>
                                    <div class="item" data-value="406">Mất</div>
                                    <div class="item" data-value="407">Bẩn, mờ sơn</div>
                                    <div class="item" data-value="408">Bàn giao CTNC</div>
                                    <div class="item" data-value="409">Bình thường</div>
                                    <div class="item" data-value="410">Bàn Giao CTNC</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="tcyclone-d-flex tcyclone-flex-wrap">
                        <div class="field tcyclone-w-50">
                            <div class="tcyclone-px-5">
                                <label>Tọa độ</label>
                                <textarea
                                    class="tcyclone-modal-input tcyclone-modal-coordinates"
                                    placeholder="Tọa độ"
                                    rows="4"
                                ></textarea>
                            </div>
                        </div>
                        <div class="field tcyclone-w-50">
                            <div class="tcyclone-px-5">
                                <label>Mô tả</label>
                                <textarea
                                    class="tcyclone-modal-input tcyclone-modal-description"
                                    placeholder="Mô tả"
                                    rows="4"
                                ></textarea>
                            </div>
                        </div>
                    </div>
                </div>`;
        },

        getDataCreate: function () {
            return {
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
        },

        getDataUpdate: function () {
            return {
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
        },
    },
    6: {
        render: function (data) {
            let html = data
                .map((d, i) => {
                    const fields = [
                        'distance_0km',
                        'position',
                        'object_name',
                        'form_date',
                        'to_date',
                        'road_edge_distance',
                        'size',
                    ];
                    const nameMapping = {
                        distance_0km: 'Khoảng cách 0km',
                        position: 'Vị trí',
                        object_name: 'Tên đường',
                        form_date: 'Ngày bắt đầu',
                        to_date: 'Ngày kết thúc',
                        road_edge_distance: 'Khoảng cách mép đường',
                        size: 'Chiều dài',
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
                                                        : `<h4 class="ui header">Không hỗ trợ thêm mới</h4>`
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

            return html;
        },

        addDataModalUpdate: function (data) {
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
            $('.tcyclone-modal-organization-id').val(data.organization_id ?? 1);
            $('.tcyclone-modal-id').val(data.id ?? '');
        },

        addContentFormCreate: function () {
            return `
                <div class="tcyclone-d-flex tcyclone-align-items-center tcyclone-gap-10">
                    <div class="tcyclone-modal-create-data tcyclone-w-100"></div>
                    <div class="ui form">
                        <div class="tcyclone-d-flex tcyclone-flex-wrap">
                            <div class="field tcyclone-w-50">
                                <div class="tcyclone-px-5">
                                    <label>Ngày bắt đầu</label>
                                    <div class="ui input mini">
                                        <input
                                            type="text"
                                            placeholder="dd/mm/yyyy"
                                            class="tcyclone-modal-input tcyclone-modal-start-date-create"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div class="field tcyclone-w-50">
                                <div class="tcyclone-px-5">
                                    <label>Ngày kết thúc</label>
                                    <div class="ui input mini">
                                        <input
                                            type="text"
                                            placeholder="dd/mm/yyyy"
                                            class="tcyclone-modal-input tcyclone-modal-end-date-create"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div class="field tcyclone-w-50">
                                <div class="tcyclone-px-5">
                                    <label>Loại đối tượng</label>
                                    <div
                                        class="tcyclone-modal-dropdown tcyclone-modal-object-create disabled tcyclone-w-100 mini ui search selection dropdown"
                                    >
                                        <i class="dropdown icon"></i>
                                        <div class="default text">V3</div>
                                        <div class="menu">
                                            <div class="item" data-value="ROAD">Đường</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="field tcyclone-w-50">
                                <div class="tcyclone-px-5">
                                    <label>Tên đối tượng</label>
                                    <div
                                        class="tcyclone-modal-dropdown tcyclone-modal-object-name-create tcyclone-w-100 mini ui search selection dropdown"
                                    >
                                        <i class="dropdown icon"></i>
                                        <div class="default text">V3</div>
                                        <div class="menu"></div>
                                    </div>
                                </div>
                            </div>
                            <div class="field tcyclone-w-50">
                                <div class="tcyclone-px-5">
                                    <label>Dơn vị quản lý</label>
                                    <div class="ui disabled input mini">
                                        <input
                                            type="text"
                                            class="tcyclone-modal-input disabled"
                                            placeholder="Dơn vị quản lý..."
                                        />
                                    </div>
                                </div>
                            </div>
                            <div class="field tcyclone-w-50">
                                <div class="tcyclone-px-5">
                                    <label>Khoảng cách so với km0</label>
                                    <div class="ui input mini">
                                        <input
                                            type="text"
                                            class="tcyclone-modal-input tcyclone-modal-distance-to-0km-create"
                                            placeholder="Khoảng cách so với km0..."
                                        />
                                    </div>
                                </div>
                            </div>
                            <div class="field tcyclone-w-50">
                                <div class="tcyclone-px-5">
                                    <label>Khoảng cách mép đường</label>
                                    <div class="ui input mini">
                                        <input
                                            type="text"
                                            class="tcyclone-modal-input tcyclone-modal-road-edge-distance-create"
                                            placeholder="Khoảng cách mép đường..."
                                        />
                                    </div>
                                </div>
                            </div>
                            <div class="field tcyclone-w-50">
                                <div class="tcyclone-px-5">
                                    <label>Vị trí</label>
                                    <div
                                        class="tcyclone-modal-dropdown tcyclone-modal-positon-create tcyclone-w-100 mini ui search selection dropdown"
                                    >
                                        <i class="dropdown icon"></i>
                                        <div class="default text">Vị trí</div>
                                        <div class="menu">
                                            <div class="item" data-value="LEFT">Trái</div>
                                            <div class="item" data-value="RIGHT">Phải</div>
                                            <div class="item" data-value="CENTER">Tim</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="field tcyclone-w-50">
                                <div class="tcyclone-px-5">
                                    <label>Kích thước</label>
                                    <div class="ui input mini">
                                        <input
                                            type="text"
                                            class="tcyclone-modal-input tcyclone-modal-size-create"
                                            placeholder="Kích thước..."
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="field">
                            <div class="tcyclone-px-5">
                                <label>Tình trạng</label>
                                <div
                                    class="tcyclone-modal-dropdown tcyclone-modal-status-create tcyclone-w-100 mini ui search selection dropdown"
                                >
                                    <i class="dropdown icon"></i>
                                    <div class="default text">V3</div>
                                    <div class="menu">
                                        <div class="item" data-value="186">Tốt</div>
                                        <div class="item" data-value="187">Trung bình</div>
                                        <div class="item" data-value="188">Xấu</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="tcyclone-d-flex tcyclone-flex-wrap">
                            <div class="field tcyclone-w-50">
                                <div class="tcyclone-px-5">
                                    <label>Tọa độ</label>
                                    <textarea
                                        class="tcyclone-modal-input tcyclone-modal-coordinates-create"
                                        placeholder="Tọa độ"
                                        rows="4"
                                    ></textarea>
                                </div>
                            </div>
                            <div class="field tcyclone-w-50">
                                <div class="tcyclone-px-5">
                                    <label>Mô tả</label>
                                    <textarea
                                        class="tcyclone-modal-input tcyclone-modal-description-create"
                                        placeholder="Mô tả"
                                        rows="4"
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        },

        addContentModalUpdate: function () {
            return `
                <div class="ui form">
                    <input type="hidden" class="tcyclone-modal-organization-id" />
                    <input type="hidden" class="tcyclone-modal-id" />
                    <div class="field">
                        <div class="tcyclone-px-5">
                            <label>Tên</label>
                            <div class="ui disabled input mini">
                                <input
                                    disabled
                                    type="text"
                                    class="tcyclone-modal-input tcyclone-modal-name"
                                    placeholder="Tên..."
                                />
                            </div>
                        </div>
                    </div>
                    <div class="tcyclone-d-flex tcyclone-flex-wrap">
                        <div class="field tcyclone-w-50">
                            <div class="tcyclone-px-5">
                                <label>Ngày bắt đầu</label>
                                <div class="ui input mini">
                                    <input
                                        type="text"
                                        placeholder="dd/mm/yyyy"
                                        class="tcyclone-modal-input tcyclone-modal-start-date"
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="field tcyclone-w-50">
                            <div class="tcyclone-px-5">
                                <label>Ngày kết thúc</label>
                                <div class="ui input mini">
                                    <input
                                        type="text"
                                        placeholder="dd/mm/yyyy"
                                        class="tcyclone-modal-input tcyclone-modal-end-date"
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="field tcyclone-w-50">
                            <div class="tcyclone-px-5">
                                <label>Loại đối tượng</label>
                                <div
                                    class="tcyclone-modal-dropdown tcyclone-modal-object disabled tcyclone-w-100 mini ui search selection dropdown"
                                >
                                    <i class="dropdown icon"></i>
                                    <div class="default text">V3</div>
                                    <div class="menu">
                                        <div class="item" data-value="ROAD">Đường</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="field tcyclone-w-50">
                            <div class="tcyclone-px-5">
                                <label>Tên đối tượng</label>
                                <div
                                    class="tcyclone-modal-dropdown tcyclone-modal-object-name tcyclone-w-100 mini ui search selection dropdown"
                                >
                                    <i class="dropdown icon"></i>
                                    <div class="default text">V3</div>
                                    <div class="menu"></div>
                                </div>
                            </div>
                        </div>
                        <div class="field tcyclone-w-50">
                            <div class="tcyclone-px-5">
                                <label>Dơn vị quản lý</label>
                                <div class="ui disabled input mini">
                                    <input
                                        type="text"
                                        class="tcyclone-modal-input disabled"
                                        placeholder="Dơn vị quản lý..."
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="field tcyclone-w-50">
                            <div class="tcyclone-px-5">
                                <label>Khoảng cách so với km0</label>
                                <div class="ui input mini">
                                    <input
                                        type="text"
                                        class="tcyclone-modal-input tcyclone-modal-distance-to-0km"
                                        placeholder="Khoảng cách so với km0..."
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="field tcyclone-w-50">
                            <div class="tcyclone-px-5">
                                <label>Khoảng cách mép đường</label>
                                <div class="ui input mini">
                                    <input
                                        type="text"
                                        class="tcyclone-modal-input tcyclone-modal-road-edge-distance"
                                        placeholder="Khoảng cách mép đường..."
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="field tcyclone-w-50">
                            <div class="tcyclone-px-5">
                                <label>Vị trí</label>
                                <div
                                    class="tcyclone-modal-dropdown tcyclone-modal-positon tcyclone-w-100 mini ui search selection dropdown"
                                >
                                    <i class="dropdown icon"></i>
                                    <div class="default text">Vị trí</div>
                                    <div class="menu">
                                        <div class="item" data-value="LEFT">Trái</div>
                                        <div class="item" data-value="RIGHT">Phải</div>
                                        <div class="item" data-value="CENTER">Tim</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="field tcyclone-w-50">
                            <div class="tcyclone-px-5">
                                <label>Chiều dài</label>
                                <div class="ui input mini">
                                    <input
                                        type="text"
                                        class="tcyclone-modal-input tcyclone-modal-size"
                                        placeholder="Chiều dài..."
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="field tcyclone-w-50">
                            <div class="tcyclone-px-5">
                                <label>Tình trạng</label>
                                <div
                                    class="tcyclone-modal-dropdown tcyclone-modal-status tcyclone-w-100 mini ui search selection dropdown"
                                >
                                    <i class="dropdown icon"></i>
                                    <div class="default text">V3</div>
                                    <div class="menu">
                                        <div class="item" data-value="186">Tốt</div>
                                        <div class="item" data-value="187">Trung bình</div>
                                        <div class="item" data-value="188">Xấu</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="tcyclone-d-flex tcyclone-flex-wrap">
                        <div class="field tcyclone-w-50">
                            <div class="tcyclone-px-5">
                                <label>Tọa độ</label>
                                <textarea
                                    class="tcyclone-modal-input tcyclone-modal-coordinates"
                                    placeholder="Tọa độ"
                                    rows="4"
                                ></textarea>
                            </div>
                        </div>
                        <div class="field tcyclone-w-50">
                            <div class="tcyclone-px-5">
                                <label>Mô tả</label>
                                <textarea
                                    class="tcyclone-modal-input tcyclone-modal-description"
                                    placeholder="Mô tả"
                                    rows="4"
                                ></textarea>
                            </div>
                        </div>
                    </div>
                </div>`;
        },

        getDataCreate: function () {
            return {
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
        },

        getDataUpdate: function () {
            return {
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
                manhole_type_id: 1,
                size: $('.tcyclone-modal-size').val(),
                status_id: $('.tcyclone-modal-status').dropdown('get value'),
                coordinates: $('.tcyclone-modal-coordinates').val(),
                description: $('.tcyclone-modal-description').val(),
            };
        },
    },
    7: {
        render: function (data) {
            let html = data
                .map((d, i) => {
                    const fields = [
                        'position',
                        'object_name',
                        'distance_0km',
                        'form_date',
                        'to_date',
                        'status',
                        'name',
                        'width',
                        'angle',
                    ];
                    const nameMapping = {
                        distance_0km: 'Khoảng cách 0km',
                        position: 'Vị trí',
                        object_name: 'Tên đường',
                        status: 'Trạng thái',
                        form_date: 'Ngày bắt đầu',
                        to_date: 'Ngày kết thúc',
                        name: 'Tên',
                        width: 'Chiều rộng',
                        angle: 'Góc nghiêng',
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
                                                        : `<h4 class="ui header">Không hỗ trợ thêm mới</h4>`
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

            return html;
        },

        addDataModalUpdate: function (data) {
            $('.tcyclone-modal-description').val(data.description ?? '');
            $('.tcyclone-modal-coordinates').val(data.coordinates ?? '');
            $('.tcyclone-modal-status').dropdown('set selected', data.status_id ?? 433);
            $('.tcyclone-modal-size').val(data.size ?? '');
            $('.tcyclone-modal-positon').dropdown('set selected', data.position ?? 'CENTER');
            $('.tcyclone-modal-angle').val(data.angle ?? '');
            $('.tcyclone-modal-width').val(data.width ?? '');
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
            $('.tcyclone-modal-name-edit').val(data.name ?? '');
            $('.tcyclone-modal-organization-id').val(data.organization_id ?? 1);
            $('.tcyclone-modal-id').val(data.id ?? '');
        },

        addContentFormCreate: function () {
            return `
                <div class="tcyclone-d-flex tcyclone-align-items-center tcyclone-gap-10">
                    <div class="tcyclone-modal-create-data tcyclone-w-100"></div>
                    <div class="ui form">
                        <div class="tcyclone-d-flex tcyclone-flex-wrap">
                            <div class="field tcyclone-w-50">
                                <div class="tcyclone-px-5">
                                    <label>Ngày bắt đầu</label>
                                    <div class="ui input mini">
                                        <input
                                            type="text"
                                            placeholder="dd/mm/yyyy"
                                            class="tcyclone-modal-input tcyclone-modal-start-date-create"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div class="field tcyclone-w-50">
                                <div class="tcyclone-px-5">
                                    <label>Ngày kết thúc</label>
                                    <div class="ui input mini">
                                        <input
                                            type="text"
                                            placeholder="dd/mm/yyyy"
                                            class="tcyclone-modal-input tcyclone-modal-end-date-create"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div class="field tcyclone-w-50">
                                <div class="tcyclone-px-5">
                                    <label>Loại đối tượng</label>
                                    <div
                                        class="tcyclone-modal-dropdown tcyclone-modal-object-create disabled tcyclone-w-100 mini ui search selection dropdown"
                                    >
                                        <i class="dropdown icon"></i>
                                        <div class="default text">V3</div>
                                        <div class="menu">
                                            <div class="item" data-value="ROAD">Đường</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="field tcyclone-w-50">
                                <div class="tcyclone-px-5">
                                    <label>Tên đối tượng</label>
                                    <div
                                        class="tcyclone-modal-dropdown tcyclone-modal-object-name-create tcyclone-w-100 mini ui search selection dropdown"
                                    >
                                        <i class="dropdown icon"></i>
                                        <div class="default text">V3</div>
                                        <div class="menu"></div>
                                    </div>
                                </div>
                            </div>
                            <div class="field tcyclone-w-50">
                                <div class="tcyclone-px-5">
                                    <label>Dơn vị quản lý</label>
                                    <div class="ui disabled input mini">
                                        <input
                                            type="text"
                                            class="tcyclone-modal-input disabled"
                                            placeholder="Dơn vị quản lý..."
                                        />
                                    </div>
                                </div>
                            </div>
                            <div class="field tcyclone-w-50">
                                <div class="tcyclone-px-5">
                                    <label>Khoảng cách so với km0</label>
                                    <div class="ui input mini">
                                        <input
                                            type="text"
                                            class="tcyclone-modal-input tcyclone-modal-distance-to-0km-create"
                                            placeholder="Khoảng cách so với km0..."
                                        />
                                    </div>
                                </div>
                            </div>
                            <div class="field tcyclone-w-50">
                                <div class="tcyclone-px-5">
                                    <label>Khoảng cách mép đường</label>
                                    <div class="ui input mini">
                                        <input
                                            type="text"
                                            class="tcyclone-modal-input tcyclone-modal-road-edge-distance-create"
                                            placeholder="Khoảng cách mép đường..."
                                        />
                                    </div>
                                </div>
                            </div>
                            <div class="field tcyclone-w-50">
                                <div class="tcyclone-px-5">
                                    <label>Vị trí</label>
                                    <div
                                        class="tcyclone-modal-dropdown tcyclone-modal-positon-create tcyclone-w-100 mini ui search selection dropdown"
                                    >
                                        <i class="dropdown icon"></i>
                                        <div class="default text">Vị trí</div>
                                        <div class="menu">
                                            <div class="item" data-value="LEFT">Trái</div>
                                            <div class="item" data-value="RIGHT">Phải</div>
                                            <div class="item" data-value="CENTER">Tim</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="field tcyclone-w-50">
                                <div class="tcyclone-px-5">
                                    <label>Loại cộc km</label>
                                    <div
                                        class="tcyclone-modal-dropdown tcyclone-modal-manhole-type-create tcyclone-w-100 mini ui search selection dropdown"
                                    >
                                        <i class="dropdown icon"></i>
                                        <div class="default text">Loại cọc H</div>
                                        <div class="menu">
                                            </--- <div class="item" data-value="105">BTCT+Bọc tôn</div> --->
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="field tcyclone-w-50">
                                <div class="tcyclone-px-5">
                                    <label>Kích thước</label>
                                    <div class="ui input mini">
                                        <input
                                            type="text"
                                            class="tcyclone-modal-input tcyclone-modal-size-create"
                                            placeholder="Kích thước..."
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="field">
                            <div class="tcyclone-px-5">
                                <label>Tình trạng</label>
                                <div
                                    class="tcyclone-modal-dropdown tcyclone-modal-status-create tcyclone-w-100 mini ui search selection dropdown"
                                >
                                    <i class="dropdown icon"></i>
                                    <div class="default text">V3</div>
                                    <div class="menu">
                                        <div class="item" data-value="186">Tốt</div>
                                        <div class="item" data-value="187">Trung bình</div>
                                        <div class="item" data-value="188">Xấu</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="tcyclone-d-flex tcyclone-flex-wrap">
                            <div class="field tcyclone-w-50">
                                <div class="tcyclone-px-5">
                                    <label>Tọa độ</label>
                                    <textarea
                                        class="tcyclone-modal-input tcyclone-modal-coordinates-create"
                                        placeholder="Tọa độ"
                                        rows="4"
                                    ></textarea>
                                </div>
                            </div>
                            <div class="field tcyclone-w-50">
                                <div class="tcyclone-px-5">
                                    <label>Mô tả</label>
                                    <textarea
                                        class="tcyclone-modal-input tcyclone-modal-description-create"
                                        placeholder="Mô tả"
                                        rows="4"
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        },

        addContentModalUpdate: function () {
            return `
                <div class="ui form">
                    <input type="hidden" class="tcyclone-modal-organization-id" />
                    <input type="hidden" class="tcyclone-modal-id" />
                    <div class="field">
                        <div class="tcyclone-px-5">
                            <label>Tên</label>
                            <div class="ui disabled input mini">
                                <input
                                    disabled
                                    type="text"
                                    class="tcyclone-modal-input tcyclone-modal-name"
                                    placeholder="Tên..."
                                />
                            </div>
                        </div>
                    </div>
                    <div class="tcyclone-d-flex tcyclone-flex-wrap">
                        <div class="field tcyclone-w-50">
                            <div class="tcyclone-px-5">
                                <label>Ngày bắt đầu</label>
                                <div class="ui input mini">
                                    <input
                                        type="text"
                                        placeholder="dd/mm/yyyy"
                                        class="tcyclone-modal-input tcyclone-modal-start-date"
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="field tcyclone-w-50">
                            <div class="tcyclone-px-5">
                                <label>Ngày kết thúc</label>
                                <div class="ui input mini">
                                    <input
                                        type="text"
                                        placeholder="dd/mm/yyyy"
                                        class="tcyclone-modal-input tcyclone-modal-end-date"
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="field tcyclone-w-50">
                            <div class="tcyclone-px-5">
                                <label>Loại đối tượng</label>
                                <div
                                    class="tcyclone-modal-dropdown tcyclone-modal-object disabled tcyclone-w-100 mini ui search selection dropdown"
                                >
                                    <i class="dropdown icon"></i>
                                    <div class="default text">V3</div>
                                    <div class="menu">
                                        <div class="item" data-value="ROAD">Đường</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="field tcyclone-w-50">
                            <div class="tcyclone-px-5">
                                <label>Tên đối tượng</label>
                                <div
                                    class="tcyclone-modal-dropdown tcyclone-modal-object-name tcyclone-w-100 mini ui search selection dropdown"
                                >
                                    <i class="dropdown icon"></i>
                                    <div class="default text">V3</div>
                                    <div class="menu"></div>
                                </div>
                            </div>
                        </div>
                        <div class="field tcyclone-w-50">
                            <div class="tcyclone-px-5">
                                <label>Dơn vị quản lý</label>
                                <div class="ui disabled input mini">
                                    <input
                                        type="text"
                                        class="tcyclone-modal-input disabled"
                                        placeholder="Dơn vị quản lý..."
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="field tcyclone-w-50">
                            <div class="tcyclone-px-5">
                                <label>Khoảng cách so với km0</label>
                                <div class="ui input mini">
                                    <input
                                        type="text"
                                        class="tcyclone-modal-input tcyclone-modal-distance-to-0km"
                                        placeholder="Khoảng cách so với km0..."
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="field tcyclone-w-50">
                            <div class="tcyclone-px-5">
                                <label>Khoảng cách mép đường</label>
                                <div class="ui input mini">
                                    <input
                                        type="text"
                                        class="tcyclone-modal-input tcyclone-modal-road-edge-distance"
                                        placeholder="Khoảng cách mép đường..."
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="field tcyclone-w-50">
                            <div class="tcyclone-px-5">
                                <label>Vị trí</label>
                                <div
                                    class="tcyclone-modal-dropdown tcyclone-modal-positon tcyclone-w-100 mini ui search selection dropdown"
                                >
                                    <i class="dropdown icon"></i>
                                    <div class="default text">Vị trí</div>
                                    <div class="menu">
                                        <div class="item" data-value="LEFT">Trái</div>
                                        <div class="item" data-value="RIGHT">Phải</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="field tcyclone-w-50">
                            <div class="tcyclone-px-5">
                                <label>Chiều rồng</label>
                                <div class="ui input mini">
                                    <input
                                        type="text"
                                        class="tcyclone-modal-input tcyclone-modal-width"
                                        placeholder="Chiều rộng..."
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="field tcyclone-w-50">
                            <div class="tcyclone-px-5">
                                <label>Góc nghiêng</label>
                                <div class="ui input mini">
                                    <input
                                        type="text"
                                        class="tcyclone-modal-input tcyclone-modal-angle"
                                        placeholder="Góc nghiêng..."
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="field">
                        <div class="tcyclone-px-5">
                            <label>Tên</label>
                            <div class="ui input mini">
                                <input
                                    type="text"
                                    class="tcyclone-modal-input tcyclone-modal-name-edit"
                                    placeholder="Kích thước..."
                                />
                            </div>
                        </div>
                    </div>
                    <div class="field">
                        <div class="tcyclone-px-5">
                            <label>Tình trạng</label>
                            <div
                                class="tcyclone-modal-dropdown tcyclone-modal-status tcyclone-w-100 mini ui search selection dropdown"
                            >
                                <i class="dropdown icon"></i>
                                <div class="default text">V3</div>
                                <div class="menu">
                                    <div class="item" data-value="440">Trung bình</div>
                                    <div class="item" data-value="441">Xấu</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="tcyclone-d-flex tcyclone-flex-wrap">
                        <div class="field tcyclone-w-50">
                            <div class="tcyclone-px-5">
                                <label>Tọa độ</label>
                                <textarea
                                    class="tcyclone-modal-input tcyclone-modal-coordinates"
                                    placeholder="Tọa độ"
                                    rows="4"
                                ></textarea>
                            </div>
                        </div>
                        <div class="field tcyclone-w-50">
                            <div class="tcyclone-px-5">
                                <label>Mô tả</label>
                                <textarea
                                    class="tcyclone-modal-input tcyclone-modal-description"
                                    placeholder="Mô tả"
                                    rows="4"
                                ></textarea>
                            </div>
                        </div>
                    </div>
                </div>`;
        },

        getDataCreate: function () {
            return {
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
        },

        getDataUpdate: function () {
            return {
                id: $('.tcyclone-modal-id').val(),
                name: $('.tcyclone-modal-name-edit').val(),
                name_object_id: $('.tcyclone-modal-object-name').dropdown('get value'),
                organization_id: $('.tcyclone-modal-organization-id').val(),
                form_date: $('.tcyclone-modal-start-date').val(),
                to_date: $('.tcyclone-modal-end-date').val(),
                object_type: $('.tcyclone-modal-object').dropdown('get value'),
                object_name: $('.tcyclone-modal-object-name').dropdown('get value'),
                distance_0km: $('.tcyclone-modal-distance-to-0km').val(),
                road_edge_distance: $('.tcyclone-modal-road-edge-distance').val(),
                position: $('.tcyclone-modal-positon').dropdown('get value'),
                angle: $('.tcyclone-modal-angle').val(),
                width: $('.tcyclone-modal-width').val(),
                size: $('.tcyclone-modal-size').val(),
                status_id: $('.tcyclone-modal-status').dropdown('get value'),
                coordinates: $('.tcyclone-modal-coordinates').val(),
                description: $('.tcyclone-modal-description').val(),
            };
        },
    },
    8: {
        render: function (data) {
            let html = data
                .map((d, i) => {
                    const fields = [
                        'distance_0km',
                        'object_name',
                        'form_date',
                        'to_date',
                        'position',
                        'direction',
                        'type',
                        'culvertAperture',
                        'length',
                        'status',
                        'name',
                    ];
                    const nameMapping = {
                        distance_0km: 'Khoảng cách 0km',
                        object_name: 'Tên đường',
                        form_date: 'Ngày bắt đầu',
                        to_date: 'Ngày kết thúc',
                        position: 'Vị trí',
                        direction: 'Theo chiều',
                        type: 'Loại cống',
                        culvertAperture: 'Khẩu độ cống',
                        length: 'Chiều dài',
                        status: 'Trạng thái',
                        name: 'Tên',
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
                                                        : `<h4 class="ui header">Không hỗ trợ thêm mới</h4>`
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

            return html;
        },

        addDataModalUpdate: function (data) {
            $('.tcyclone-modal-description').val(data.description ?? '');
            $('.tcyclone-modal-coordinates').val(data.coordinates ?? '');
            $('.tcyclone-modal-status').dropdown('set selected', data.status_id ?? 433);
            $('.tcyclone-modal-culvert-aperture').dropdown('set selected', data.culvert_aperture ?? 433);
            $('.tcyclone-modal-direction-type').dropdown('set selected', data.direction_type ?? 433);
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
            $('.tcyclone-modal-organization-id').val(data.organization_id ?? 1);
            $('.tcyclone-modal-id').val(data.id ?? '');
        },

        addContentFormCreate: function () {
            return `
                <div class="tcyclone-d-flex tcyclone-align-items-center tcyclone-gap-10">
                    <div class="tcyclone-modal-create-data tcyclone-w-100"></div>
                    <div class="ui form">
                        <div class="tcyclone-d-flex tcyclone-flex-wrap">
                            <div class="field tcyclone-w-50">
                                <div class="tcyclone-px-5">
                                    <label>Ngày bắt đầu</label>
                                    <div class="ui input mini">
                                        <input
                                            type="text"
                                            placeholder="dd/mm/yyyy"
                                            class="tcyclone-modal-input tcyclone-modal-start-date-create"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div class="field tcyclone-w-50">
                                <div class="tcyclone-px-5">
                                    <label>Ngày kết thúc</label>
                                    <div class="ui input mini">
                                        <input
                                            type="text"
                                            placeholder="dd/mm/yyyy"
                                            class="tcyclone-modal-input tcyclone-modal-end-date-create"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div class="field tcyclone-w-50">
                                <div class="tcyclone-px-5">
                                    <label>Loại đối tượng</label>
                                    <div
                                        class="tcyclone-modal-dropdown tcyclone-modal-object-create disabled tcyclone-w-100 mini ui search selection dropdown"
                                    >
                                        <i class="dropdown icon"></i>
                                        <div class="default text">V3</div>
                                        <div class="menu">
                                            <div class="item" data-value="ROAD">Đường</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="field tcyclone-w-50">
                                <div class="tcyclone-px-5">
                                    <label>Tên đối tượng</label>
                                    <div
                                        class="tcyclone-modal-dropdown tcyclone-modal-object-name-create tcyclone-w-100 mini ui search selection dropdown"
                                    >
                                        <i class="dropdown icon"></i>
                                        <div class="default text">V3</div>
                                        <div class="menu"></div>
                                    </div>
                                </div>
                            </div>
                            <div class="field tcyclone-w-50">
                                <div class="tcyclone-px-5">
                                    <label>Dơn vị quản lý</label>
                                    <div class="ui disabled input mini">
                                        <input
                                            type="text"
                                            class="tcyclone-modal-input disabled"
                                            placeholder="Dơn vị quản lý..."
                                        />
                                    </div>
                                </div>
                            </div>
                            <div class="field tcyclone-w-50">
                                <div class="tcyclone-px-5">
                                    <label>Khoảng cách so với km0</label>
                                    <div class="ui input mini">
                                        <input
                                            type="text"
                                            class="tcyclone-modal-input tcyclone-modal-distance-to-0km-create"
                                            placeholder="Khoảng cách so với km0..."
                                        />
                                    </div>
                                </div>
                            </div>
                            <div class="field tcyclone-w-50">
                                <div class="tcyclone-px-5">
                                    <label>Khoảng cách mép đường</label>
                                    <div class="ui input mini">
                                        <input
                                            type="text"
                                            class="tcyclone-modal-input tcyclone-modal-road-edge-distance-create"
                                            placeholder="Khoảng cách mép đường..."
                                        />
                                    </div>
                                </div>
                            </div>
                            <div class="field tcyclone-w-50">
                                <div class="tcyclone-px-5">
                                    <label>Vị trí</label>
                                    <div
                                        class="tcyclone-modal-dropdown tcyclone-modal-positon-create tcyclone-w-100 mini ui search selection dropdown"
                                    >
                                        <i class="dropdown icon"></i>
                                        <div class="default text">Vị trí</div>
                                        <div class="menu">
                                            <div class="item" data-value="LEFT">Trái</div>
                                            <div class="item" data-value="RIGHT">Phải</div>
                                            <div class="item" data-value="CENTER">Tim</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="field tcyclone-w-50">
                                <div class="tcyclone-px-5">
                                    <label>Loại cộc km</label>
                                    <div
                                        class="tcyclone-modal-dropdown tcyclone-modal-manhole-type-create tcyclone-w-100 mini ui search selection dropdown"
                                    >
                                        <i class="dropdown icon"></i>
                                        <div class="default text">Loại cọc H</div>
                                        <div class="menu">
                                            </--- <div class="item" data-value="105">BTCT+Bọc tôn</div> --->
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="field tcyclone-w-50">
                                <div class="tcyclone-px-5">
                                    <label>Kích thước</label>
                                    <div class="ui input mini">
                                        <input
                                            type="text"
                                            class="tcyclone-modal-input tcyclone-modal-size-create"
                                            placeholder="Kích thước..."
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="field">
                            <div class="tcyclone-px-5">
                                <label>Tình trạng</label>
                                <div
                                    class="tcyclone-modal-dropdown tcyclone-modal-status-create tcyclone-w-100 mini ui search selection dropdown"
                                >
                                    <i class="dropdown icon"></i>
                                    <div class="default text">V3</div>
                                    <div class="menu">
                                        <div class="item" data-value="186">Tốt</div>
                                        <div class="item" data-value="187">Trung bình</div>
                                        <div class="item" data-value="188">Xấu</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="tcyclone-d-flex tcyclone-flex-wrap">
                            <div class="field tcyclone-w-50">
                                <div class="tcyclone-px-5">
                                    <label>Tọa độ</label>
                                    <textarea
                                        class="tcyclone-modal-input tcyclone-modal-coordinates-create"
                                        placeholder="Tọa độ"
                                        rows="4"
                                    ></textarea>
                                </div>
                            </div>
                            <div class="field tcyclone-w-50">
                                <div class="tcyclone-px-5">
                                    <label>Mô tả</label>
                                    <textarea
                                        class="tcyclone-modal-input tcyclone-modal-description-create"
                                        placeholder="Mô tả"
                                        rows="4"
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        },

        addContentModalUpdate: function () {
            return `
                <div class="ui form">
                    <input type="hidden" class="tcyclone-modal-organization-id" />
                    <input type="hidden" class="tcyclone-modal-id" />
                    <div class="field">
                        <div class="tcyclone-px-5">
                            <label>Tên</label>
                            <div class="ui disabled input mini">
                                <input
                                    disabled
                                    type="text"
                                    class="tcyclone-modal-input tcyclone-modal-name"
                                    placeholder="Tên..."
                                />
                            </div>
                        </div>
                    </div>
                    <div class="tcyclone-d-flex tcyclone-flex-wrap">
                        <div class="field tcyclone-w-50">
                            <div class="tcyclone-px-5">
                                <label>Ngày bắt đầu</label>
                                <div class="ui input mini">
                                    <input
                                        type="text"
                                        placeholder="dd/mm/yyyy"
                                        class="tcyclone-modal-input tcyclone-modal-start-date"
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="field tcyclone-w-50">
                            <div class="tcyclone-px-5">
                                <label>Ngày kết thúc</label>
                                <div class="ui input mini">
                                    <input
                                        type="text"
                                        placeholder="dd/mm/yyyy"
                                        class="tcyclone-modal-input tcyclone-modal-end-date"
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="field tcyclone-w-50">
                            <div class="tcyclone-px-5">
                                <label>Loại đối tượng</label>
                                <div
                                    class="tcyclone-modal-dropdown tcyclone-modal-object disabled tcyclone-w-100 mini ui search selection dropdown"
                                >
                                    <i class="dropdown icon"></i>
                                    <div class="default text">V3</div>
                                    <div class="menu">
                                        <div class="item" data-value="ROAD">Đường</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="field tcyclone-w-50">
                            <div class="tcyclone-px-5">
                                <label>Tên đối tượng</label>
                                <div
                                    class="tcyclone-modal-dropdown tcyclone-modal-object-name tcyclone-w-100 mini ui search selection dropdown"
                                >
                                    <i class="dropdown icon"></i>
                                    <div class="default text">V3</div>
                                    <div class="menu"></div>
                                </div>
                            </div>
                        </div>
                        <div class="field tcyclone-w-50">
                            <div class="tcyclone-px-5">
                                <label>Dơn vị quản lý</label>
                                <div class="ui disabled input mini">
                                    <input
                                        type="text"
                                        class="tcyclone-modal-input disabled"
                                        placeholder="Dơn vị quản lý..."
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="field tcyclone-w-50">
                            <div class="tcyclone-px-5">
                                <label>Khoảng cách so với km0</label>
                                <div class="ui input mini">
                                    <input
                                        type="text"
                                        class="tcyclone-modal-input tcyclone-modal-distance-to-0km"
                                        placeholder="Khoảng cách so với km0..."
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="field tcyclone-w-50">
                            <div class="tcyclone-px-5">
                                <label>Khoảng cách mép đường</label>
                                <div class="ui input mini">
                                    <input
                                        type="text"
                                        class="tcyclone-modal-input tcyclone-modal-road-edge-distance"
                                        placeholder="Khoảng cách mép đường..."
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="field tcyclone-w-50">
                            <div class="tcyclone-px-5">
                                <label>Vị trí</label>
                                <div
                                    class="tcyclone-modal-dropdown tcyclone-modal-positon tcyclone-w-100 mini ui search selection dropdown"
                                >
                                    <i class="dropdown icon"></i>
                                    <div class="default text">Vị trí</div>
                                    <div class="menu">
                                        <div class="item" data-value="LEFT">Trái</div>
                                        <div class="item" data-value="RIGHT">Phải</div>
                                        <div class="item" data-value="CENTER">Tim</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="field tcyclone-w-50">
                            <div class="tcyclone-px-5">
                                <label>Loại hố</label>
                                <div
                                    class="tcyclone-modal-dropdown tcyclone-modal-manhole-type tcyclone-w-100 mini ui search selection dropdown"
                                >
                                    <i class="dropdown icon"></i>
                                    <div class="default text">Loại cột km</div>
                                    <div class="menu">
                                        <div class="item" data-value="372">Tròn</div>
                                        <div class="item" data-value="373">Hộp</div>
                                        <div class="item" data-value="374">Cống bản</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="field tcyclone-w-50">
                            <div class="tcyclone-px-5">
                                <label>Chiều dài</label>
                                <div class="ui input mini">
                                    <input
                                        type="text"
                                        class="tcyclone-modal-input tcyclone-modal-size"
                                        placeholder="Chiều dài..."
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="field tcyclone-w-50">
                            <div class="tcyclone-px-5">
                                <label>Khẩu độ cống</label>
                                <div
                                    class="tcyclone-modal-dropdown tcyclone-modal-culvert-aperture tcyclone-w-100 mini ui search selection dropdown"
                                >
                                    <i class="dropdown icon"></i>
                                    <div class="default text">V3</div>
                                    <div class="menu">
                                        <div class="item" data-value="40">0.5 - 2m</div>
                                        <div class="item" data-value="41">10m</div>
                                    </div>
                            </div>
                            </div>
                        </div>
                        <div class="field tcyclone-w-50">
                            <div class="tcyclone-px-5">
                                <label>Chiều so với đường</label>
                                <div
                                    class="tcyclone-modal-dropdown tcyclone-modal-direction-type tcyclone-w-100 mini ui search selection dropdown"
                                >
                                    <i class="dropdown icon"></i>
                                    <div class="default text">V3</div>
                                    <div class="menu">
                                        <div class="item" data-value="LONGITUDINAL">Dọc</div>
                                        <div class="item" data-value="TRANSVERSE">Ngang</div>
                                    </div>
                            </div>
                            </div>
                        </div>
                    </div>
                    <div class="field">
                        <div class="tcyclone-px-5">
                            <label>Trạng thái</label>
                            <div
                                class="tcyclone-modal-dropdown tcyclone-modal-status tcyclone-w-100 mini ui search selection dropdown"
                            >
                                <i class="dropdown icon"></i>
                                <div class="default text">V3</div>
                                <div class="menu">
                                    <div class="item" data-value="397">D120</div>
                                    <div class="item" data-value="398">Đã bị lấp</div>
                                    <div class="item" data-value="399">Lấp hạ lưu</div>
                                    <div class="item" data-value="400">Mất tác dụng</div>
                                    <div class="item" data-value="401">Tắc 1/2 cống</div>
                                    <div class="item" data-value="402">Tốt</div>
                                    <div class="item" data-value="403">Bình thường</div>
                                    <div class="item" data-value="404">Kém</div>
                                </div>
                        </div>
                        </div>
                    </div>
                    <div class="tcyclone-d-flex tcyclone-flex-wrap">
                        <div class="field tcyclone-w-50">
                            <div class="tcyclone-px-5">
                                <label>Tọa độ</label>
                                <textarea
                                    class="tcyclone-modal-input tcyclone-modal-coordinates"
                                    placeholder="Tọa độ"
                                    rows="4"
                                ></textarea>
                            </div>
                        </div>
                        <div class="field tcyclone-w-50">
                            <div class="tcyclone-px-5">
                                <label>Mô tả</label>
                                <textarea
                                    class="tcyclone-modal-input tcyclone-modal-description"
                                    placeholder="Mô tả"
                                    rows="4"
                                ></textarea>
                            </div>
                        </div>
                    </div>
                </div>`;
        },

        getDataCreate: function () {
            return {
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
        },

        getDataUpdate: function () {
            return {
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
                culvert_aperture: $('.tcyclone-modal-culvert-aperture').dropdown('get value'),
                direction_type: $('.tcyclone-modal-direction-type').dropdown('get value'),
            };
        },
    },
    9: {
        render: function (data) {
            let html = data
                .map((d, i) => {
                    const fields = [
                        'object_name',
                        'distance_0km',
                        'road_edge_distance',
                        'form_date',
                        'to_date',
                        'position',
                        'type',
                        'width',
                        'length',
                        'status',
                    ];
                    const nameMapping = {
                        distance_0km: 'Khoảng cách 0km',
                        object_name: 'Tên đường',
                        road_edge_distance: 'Khoảng cách mep đường',
                        form_date: 'Ngày bắt đầu',
                        to_date: 'Ngày kết thúc',
                        position: 'Vị trí',
                        type: 'Loại cống',
                        width: 'Chiều rộng',
                        length: 'Chiều dài',
                        status: 'Trạng thái',
                        name: 'Tên',
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
                                                        : `<h4 class="ui header">Không hỗ trợ thêm mới</h4>`
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

            return html;
        },

        addDataModalUpdate: function (data) {
            $('.tcyclone-modal-description').val(data.description ?? '');
            $('.tcyclone-modal-coordinates').val(data.coordinates ?? '');
            $('.tcyclone-modal-status').dropdown('set selected', data.status_id ?? 433);
            $('.tcyclone-modal-size').val(data.length ?? '');
            $('.tcyclone-modal-width').val(data.width ?? '');
            $('.tcyclone-modal-type').dropdown('set selected', data.type_id ?? 380);
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
            $('.tcyclone-modal-organization-id').val(data.organization_id ?? 1);
            $('.tcyclone-modal-id').val(data.id ?? '');
        },

        addContentFormCreate: function () {
            return `
                <div class="tcyclone-d-flex tcyclone-align-items-center tcyclone-gap-10">
                    <div class="tcyclone-modal-create-data tcyclone-w-100"></div>
                    <div class="ui form">
                        <div class="tcyclone-d-flex tcyclone-flex-wrap">
                            <div class="field tcyclone-w-50">
                                <div class="tcyclone-px-5">
                                    <label>Ngày bắt đầu</label>
                                    <div class="ui input mini">
                                        <input
                                            type="text"
                                            placeholder="dd/mm/yyyy"
                                            class="tcyclone-modal-input tcyclone-modal-start-date-create"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div class="field tcyclone-w-50">
                                <div class="tcyclone-px-5">
                                    <label>Ngày kết thúc</label>
                                    <div class="ui input mini">
                                        <input
                                            type="text"
                                            placeholder="dd/mm/yyyy"
                                            class="tcyclone-modal-input tcyclone-modal-end-date-create"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div class="field tcyclone-w-50">
                                <div class="tcyclone-px-5">
                                    <label>Loại đối tượng</label>
                                    <div
                                        class="tcyclone-modal-dropdown tcyclone-modal-object-create disabled tcyclone-w-100 mini ui search selection dropdown"
                                    >
                                        <i class="dropdown icon"></i>
                                        <div class="default text">V3</div>
                                        <div class="menu">
                                            <div class="item" data-value="ROAD">Đường</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="field tcyclone-w-50">
                                <div class="tcyclone-px-5">
                                    <label>Tên đối tượng</label>
                                    <div
                                        class="tcyclone-modal-dropdown tcyclone-modal-object-name-create tcyclone-w-100 mini ui search selection dropdown"
                                    >
                                        <i class="dropdown icon"></i>
                                        <div class="default text">V3</div>
                                        <div class="menu"></div>
                                    </div>
                                </div>
                            </div>
                            <div class="field tcyclone-w-50">
                                <div class="tcyclone-px-5">
                                    <label>Dơn vị quản lý</label>
                                    <div class="ui disabled input mini">
                                        <input
                                            type="text"
                                            class="tcyclone-modal-input disabled"
                                            placeholder="Dơn vị quản lý..."
                                        />
                                    </div>
                                </div>
                            </div>
                            <div class="field tcyclone-w-50">
                                <div class="tcyclone-px-5">
                                    <label>Khoảng cách so với km0</label>
                                    <div class="ui input mini">
                                        <input
                                            type="text"
                                            class="tcyclone-modal-input tcyclone-modal-distance-to-0km-create"
                                            placeholder="Khoảng cách so với km0..."
                                        />
                                    </div>
                                </div>
                            </div>
                            <div class="field tcyclone-w-50">
                                <div class="tcyclone-px-5">
                                    <label>Khoảng cách mép đường</label>
                                    <div class="ui input mini">
                                        <input
                                            type="text"
                                            class="tcyclone-modal-input tcyclone-modal-road-edge-distance-create"
                                            placeholder="Khoảng cách mép đường..."
                                        />
                                    </div>
                                </div>
                            </div>
                            <div class="field tcyclone-w-50">
                                <div class="tcyclone-px-5">
                                    <label>Vị trí</label>
                                    <div
                                        class="tcyclone-modal-dropdown tcyclone-modal-positon-create tcyclone-w-100 mini ui search selection dropdown"
                                    >
                                        <i class="dropdown icon"></i>
                                        <div class="default text">Vị trí</div>
                                        <div class="menu">
                                            <div class="item" data-value="LEFT">Trái</div>
                                            <div class="item" data-value="RIGHT">Phải</div>
                                            <div class="item" data-value="CENTER">Tim</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="field tcyclone-w-50">
                                <div class="tcyclone-px-5">
                                    <label>Loại cộc km</label>
                                    <div
                                        class="tcyclone-modal-dropdown tcyclone-modal-manhole-type-create tcyclone-w-100 mini ui search selection dropdown"
                                    >
                                        <i class="dropdown icon"></i>
                                        <div class="default text">Loại cọc H</div>
                                        <div class="menu">
                                            </--- <div class="item" data-value="105">BTCT+Bọc tôn</div> --->
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="field tcyclone-w-50">
                                <div class="tcyclone-px-5">
                                    <label>Kích thước</label>
                                    <div class="ui input mini">
                                        <input
                                            type="text"
                                            class="tcyclone-modal-input tcyclone-modal-size-create"
                                            placeholder="Kích thước..."
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="field">
                            <div class="tcyclone-px-5">
                                <label>Tình trạng</label>
                                <div
                                    class="tcyclone-modal-dropdown tcyclone-modal-status-create tcyclone-w-100 mini ui search selection dropdown"
                                >
                                    <i class="dropdown icon"></i>
                                    <div class="default text">V3</div>
                                    <div class="menu">
                                        <div class="item" data-value="186">Tốt</div>
                                        <div class="item" data-value="187">Trung bình</div>
                                        <div class="item" data-value="188">Xấu</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="tcyclone-d-flex tcyclone-flex-wrap">
                            <div class="field tcyclone-w-50">
                                <div class="tcyclone-px-5">
                                    <label>Tọa độ</label>
                                    <textarea
                                        class="tcyclone-modal-input tcyclone-modal-coordinates-create"
                                        placeholder="Tọa độ"
                                        rows="4"
                                    ></textarea>
                                </div>
                            </div>
                            <div class="field tcyclone-w-50">
                                <div class="tcyclone-px-5">
                                    <label>Mô tả</label>
                                    <textarea
                                        class="tcyclone-modal-input tcyclone-modal-description-create"
                                        placeholder="Mô tả"
                                        rows="4"
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        },

        addContentModalUpdate: function () {
            return `
                <div class="ui form">
                    <input type="hidden" class="tcyclone-modal-organization-id" />
                    <input type="hidden" class="tcyclone-modal-id" />
                    <div class="field">
                        <div class="tcyclone-px-5">
                            <label>Tên</label>
                            <div class="ui disabled input mini">
                                <input
                                    disabled
                                    type="text"
                                    class="tcyclone-modal-input tcyclone-modal-name"
                                    placeholder="Tên..."
                                />
                            </div>
                        </div>
                    </div>
                    <div class="tcyclone-d-flex tcyclone-flex-wrap">
                        <div class="field tcyclone-w-50">
                            <div class="tcyclone-px-5">
                                <label>Ngày bắt đầu</label>
                                <div class="ui input mini">
                                    <input
                                        type="text"
                                        placeholder="dd/mm/yyyy"
                                        class="tcyclone-modal-input tcyclone-modal-start-date"
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="field tcyclone-w-50">
                            <div class="tcyclone-px-5">
                                <label>Ngày kết thúc</label>
                                <div class="ui input mini">
                                    <input
                                        type="text"
                                        placeholder="dd/mm/yyyy"
                                        class="tcyclone-modal-input tcyclone-modal-end-date"
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="field tcyclone-w-50">
                            <div class="tcyclone-px-5">
                                <label>Loại đối tượng</label>
                                <div
                                    class="tcyclone-modal-dropdown tcyclone-modal-object disabled tcyclone-w-100 mini ui search selection dropdown"
                                >
                                    <i class="dropdown icon"></i>
                                    <div class="default text">V3</div>
                                    <div class="menu">
                                        <div class="item" data-value="ROAD">Đường</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="field tcyclone-w-50">
                            <div class="tcyclone-px-5">
                                <label>Tên đối tượng</label>
                                <div
                                    class="tcyclone-modal-dropdown tcyclone-modal-object-name tcyclone-w-100 mini ui search selection dropdown"
                                >
                                    <i class="dropdown icon"></i>
                                    <div class="default text">V3</div>
                                    <div class="menu"></div>
                                </div>
                            </div>
                        </div>
                        <div class="field tcyclone-w-50">
                            <div class="tcyclone-px-5">
                                <label>Dơn vị quản lý</label>
                                <div class="ui disabled input mini">
                                    <input
                                        type="text"
                                        class="tcyclone-modal-input disabled"
                                        placeholder="Dơn vị quản lý..."
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="field tcyclone-w-50">
                            <div class="tcyclone-px-5">
                                <label>Khoảng cách so với km0</label>
                                <div class="ui input mini">
                                    <input
                                        type="text"
                                        class="tcyclone-modal-input tcyclone-modal-distance-to-0km"
                                        placeholder="Khoảng cách so với km0..."
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="field tcyclone-w-50">
                            <div class="tcyclone-px-5">
                                <label>Khoảng cách mép đường</label>
                                <div class="ui input mini">
                                    <input
                                        type="text"
                                        class="tcyclone-modal-input tcyclone-modal-road-edge-distance"
                                        placeholder="Khoảng cách mép đường..."
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="field tcyclone-w-50">
                            <div class="tcyclone-px-5">
                                <label>Vị trí</label>
                                <div
                                    class="tcyclone-modal-dropdown tcyclone-modal-positon tcyclone-w-100 mini ui search selection dropdown"
                                >
                                    <i class="dropdown icon"></i>
                                    <div class="default text">Vị trí</div>
                                    <div class="menu">
                                        <div class="item" data-value="LEFT">Trái</div>
                                        <div class="item" data-value="RIGHT">Phải</div>
                                        <div class="item" data-value="CENTER">Tim</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="field tcyclone-w-50">
                            <div class="tcyclone-px-5">
                                <label>Loại rãnh nước</label>
                                <div
                                    class="tcyclone-modal-dropdown tcyclone-modal-type tcyclone-w-100 mini ui search selection dropdown"
                                >
                                    <i class="dropdown icon"></i>
                                    <div class="default text">Loại cột km</div>
                                    <div class="menu">
                                        <div class="item" data-value="384">Rãnh đất hở</div>
                                        <div class="item" data-value="385">Rãnh xây hở</div>
                                        <div class="item" data-value="386">Rãnh xây đậy bản</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="field tcyclone-w-50">
                            <div class="tcyclone-px-5">
                                <label>Chiều dài</label>
                                <div class="ui input mini">
                                    <input
                                        type="text"
                                        class="tcyclone-modal-input tcyclone-modal-size"
                                        placeholder="Kích thước..."
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="field tcyclone-w-50">
                            <div class="tcyclone-px-5">
                                <label>Tình trạng</label>
                                <div
                                    class="tcyclone-modal-dropdown tcyclone-modal-status tcyclone-w-100 mini ui search selection dropdown"
                                >
                                    <i class="dropdown icon"></i>
                                    <div class="default text">V3</div>
                                    <div class="menu">
                                        <div class="item" data-value="186">Tốt</div>
                                        <div class="item" data-value="187">Trung bình</div>
                                        <div class="item" data-value="188">Xấu</div>
                                    </div>
                            </div>
                            </div>
                        </div>
                        <div class="field tcyclone-w-50">
                            <div class="tcyclone-px-5">
                                <label>chiều rộng</label>
                                    <input
                                        type="text"
                                        class="tcyclone-modal-input tcyclone-modal-width"
                                        placeholder="Kích thước..."
                                    />
                            </div>
                        </div>
                    </div>
                    
                    <div class="tcyclone-d-flex tcyclone-flex-wrap">
                        <div class="field tcyclone-w-50">
                            <div class="tcyclone-px-5">
                                <label>Tọa độ</label>
                                <textarea
                                    class="tcyclone-modal-input tcyclone-modal-coordinates"
                                    placeholder="Tọa độ"
                                    rows="4"
                                ></textarea>
                            </div>
                        </div>
                        <div class="field tcyclone-w-50">
                            <div class="tcyclone-px-5">
                                <label>Mô tả</label>
                                <textarea
                                    class="tcyclone-modal-input tcyclone-modal-description"
                                    placeholder="Mô tả"
                                    rows="4"
                                ></textarea>
                            </div>
                        </div>
                    </div>
                </div>`;
        },

        getDataCreate: function () {
            return {
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
        },

        getDataUpdate: function () {
            return {
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
                type_id: $('.tcyclone-modal-type').dropdown('get value'),
                width: $('.tcyclone-modal-width').val(),
                length: $('.tcyclone-modal-size').val(),
                status_id: $('.tcyclone-modal-status').dropdown('get value'),
                coordinates: $('.tcyclone-modal-coordinates').val(),
                description: $('.tcyclone-modal-description').val(),
            };
        },
    },
    10: {
        render: function (data) {
            let html = data
                .map((d, i) => {
                    const fields = [
                        'object_name',
                        'distance_0km',
                        'road_edge_distance',
                        'form_date',
                        'to_date',
                        'position',
                        'type',
                        'width',
                        'length',
                    ];
                    const nameMapping = {
                        distance_0km: 'Khoảng cách 0km',
                        object_name: 'Tên đường',
                        road_edge_distance: 'Khoảng cách mep đường',
                        form_date: 'Ngày bắt đầu',
                        to_date: 'Ngày kết thúc',
                        position: 'Vị trí',
                        type: 'Loại cống',
                        width: 'Chiều rộng',
                        length: 'Chiều dài',
                        name: 'Tên',
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
                                                        : `<h4 class="ui header">Không hỗ trợ thêm mới</h4>`
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

            return html;
        },

        addDataModalUpdate: function (data) {
            $('.tcyclone-modal-description').val(data.description ?? '');
            $('.tcyclone-modal-coordinates').val(data.coordinates ?? '');
            $('.tcyclone-modal-status').dropdown('set selected', data.status_id ?? 433);
            $('.tcyclone-modal-length').val(data.length ?? '');
            $('.tcyclone-modal-width').val(data.width ?? '');
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
            $('.tcyclone-modal-organization-id').val(data.organization_id ?? 1);
            $('.tcyclone-modal-id').val(data.id ?? '');
        },

        addContentFormCreate: function () {
            return `
                <div class="tcyclone-d-flex tcyclone-align-items-center tcyclone-gap-10">
                    <div class="tcyclone-modal-create-data tcyclone-w-100"></div>
                    <div class="ui form">
                        <div class="tcyclone-d-flex tcyclone-flex-wrap">
                            <div class="field tcyclone-w-50">
                                <div class="tcyclone-px-5">
                                    <label>Ngày bắt đầu</label>
                                    <div class="ui input mini">
                                        <input
                                            type="text"
                                            placeholder="dd/mm/yyyy"
                                            class="tcyclone-modal-input tcyclone-modal-start-date-create"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div class="field tcyclone-w-50">
                                <div class="tcyclone-px-5">
                                    <label>Ngày kết thúc</label>
                                    <div class="ui input mini">
                                        <input
                                            type="text"
                                            placeholder="dd/mm/yyyy"
                                            class="tcyclone-modal-input tcyclone-modal-end-date-create"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div class="field tcyclone-w-50">
                                <div class="tcyclone-px-5">
                                    <label>Loại đối tượng</label>
                                    <div
                                        class="tcyclone-modal-dropdown tcyclone-modal-object-create disabled tcyclone-w-100 mini ui search selection dropdown"
                                    >
                                        <i class="dropdown icon"></i>
                                        <div class="default text">V3</div>
                                        <div class="menu">
                                            <div class="item" data-value="ROAD">Đường</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="field tcyclone-w-50">
                                <div class="tcyclone-px-5">
                                    <label>Tên đối tượng</label>
                                    <div
                                        class="tcyclone-modal-dropdown tcyclone-modal-object-name-create tcyclone-w-100 mini ui search selection dropdown"
                                    >
                                        <i class="dropdown icon"></i>
                                        <div class="default text">V3</div>
                                        <div class="menu"></div>
                                    </div>
                                </div>
                            </div>
                            <div class="field tcyclone-w-50">
                                <div class="tcyclone-px-5">
                                    <label>Dơn vị quản lý</label>
                                    <div class="ui disabled input mini">
                                        <input
                                            type="text"
                                            class="tcyclone-modal-input disabled"
                                            placeholder="Dơn vị quản lý..."
                                        />
                                    </div>
                                </div>
                            </div>
                            <div class="field tcyclone-w-50">
                                <div class="tcyclone-px-5">
                                    <label>Khoảng cách so với km0</label>
                                    <div class="ui input mini">
                                        <input
                                            type="text"
                                            class="tcyclone-modal-input tcyclone-modal-distance-to-0km-create"
                                            placeholder="Khoảng cách so với km0..."
                                        />
                                    </div>
                                </div>
                            </div>
                            <div class="field tcyclone-w-50">
                                <div class="tcyclone-px-5">
                                    <label>Khoảng cách mép đường</label>
                                    <div class="ui input mini">
                                        <input
                                            type="text"
                                            class="tcyclone-modal-input tcyclone-modal-road-edge-distance-create"
                                            placeholder="Khoảng cách mép đường..."
                                        />
                                    </div>
                                </div>
                            </div>
                            <div class="field tcyclone-w-50">
                                <div class="tcyclone-px-5">
                                    <label>Vị trí</label>
                                    <div
                                        class="tcyclone-modal-dropdown tcyclone-modal-positon-create tcyclone-w-100 mini ui search selection dropdown"
                                    >
                                        <i class="dropdown icon"></i>
                                        <div class="default text">Vị trí</div>
                                        <div class="menu">
                                            <div class="item" data-value="LEFT">Trái</div>
                                            <div class="item" data-value="RIGHT">Phải</div>
                                            <div class="item" data-value="CENTER">Tim</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="field tcyclone-w-50">
                                <div class="tcyclone-px-5">
                                    <label>Loại cộc km</label>
                                    <div
                                        class="tcyclone-modal-dropdown tcyclone-modal-manhole-type-create tcyclone-w-100 mini ui search selection dropdown"
                                    >
                                        <i class="dropdown icon"></i>
                                        <div class="default text">Loại cọc H</div>
                                        <div class="menu">
                                            </--- <div class="item" data-value="105">BTCT+Bọc tôn</div> --->
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="field tcyclone-w-50">
                                <div class="tcyclone-px-5">
                                    <label>Kích thước</label>
                                    <div class="ui input mini">
                                        <input
                                            type="text"
                                            class="tcyclone-modal-input tcyclone-modal-size-create"
                                            placeholder="Kích thước..."
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="field">
                            <div class="tcyclone-px-5">
                                <label>Tình trạng</label>
                                <div
                                    class="tcyclone-modal-dropdown tcyclone-modal-status-create tcyclone-w-100 mini ui search selection dropdown"
                                >
                                    <i class="dropdown icon"></i>
                                    <div class="default text">V3</div>
                                    <div class="menu">
                                        <div class="item" data-value="186">Tốt</div>
                                        <div class="item" data-value="187">Trung bình</div>
                                        <div class="item" data-value="188">Xấu</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="tcyclone-d-flex tcyclone-flex-wrap">
                            <div class="field tcyclone-w-50">
                                <div class="tcyclone-px-5">
                                    <label>Tọa độ</label>
                                    <textarea
                                        class="tcyclone-modal-input tcyclone-modal-coordinates-create"
                                        placeholder="Tọa độ"
                                        rows="4"
                                    ></textarea>
                                </div>
                            </div>
                            <div class="field tcyclone-w-50">
                                <div class="tcyclone-px-5">
                                    <label>Mô tả</label>
                                    <textarea
                                        class="tcyclone-modal-input tcyclone-modal-description-create"
                                        placeholder="Mô tả"
                                        rows="4"
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        },

        addContentModalUpdate: function () {
            return `
                <div class="ui form">
                    <input type="hidden" class="tcyclone-modal-organization-id" />
                    <input type="hidden" class="tcyclone-modal-id" />
                    <div class="field">
                        <div class="tcyclone-px-5">
                            <label>Tên</label>
                            <div class="ui disabled input mini">
                                <input
                                    disabled
                                    type="text"
                                    class="tcyclone-modal-input tcyclone-modal-name"
                                    placeholder="Tên..."
                                />
                            </div>
                        </div>
                    </div>
                    <div class="tcyclone-d-flex tcyclone-flex-wrap">
                        <div class="field tcyclone-w-50">
                            <div class="tcyclone-px-5">
                                <label>Ngày bắt đầu</label>
                                <div class="ui input mini">
                                    <input
                                        type="text"
                                        placeholder="dd/mm/yyyy"
                                        class="tcyclone-modal-input tcyclone-modal-start-date"
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="field tcyclone-w-50">
                            <div class="tcyclone-px-5">
                                <label>Ngày kết thúc</label>
                                <div class="ui input mini">
                                    <input
                                        type="text"
                                        placeholder="dd/mm/yyyy"
                                        class="tcyclone-modal-input tcyclone-modal-end-date"
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="field tcyclone-w-50">
                            <div class="tcyclone-px-5">
                                <label>Loại đối tượng</label>
                                <div
                                    class="tcyclone-modal-dropdown tcyclone-modal-object disabled tcyclone-w-100 mini ui search selection dropdown"
                                >
                                    <i class="dropdown icon"></i>
                                    <div class="default text">V3</div>
                                    <div class="menu">
                                        <div class="item" data-value="ROAD">Đường</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="field tcyclone-w-50">
                            <div class="tcyclone-px-5">
                                <label>Tên đối tượng</label>
                                <div
                                    class="tcyclone-modal-dropdown tcyclone-modal-object-name tcyclone-w-100 mini ui search selection dropdown"
                                >
                                    <i class="dropdown icon"></i>
                                    <div class="default text">V3</div>
                                    <div class="menu"></div>
                                </div>
                            </div>
                        </div>
                        <div class="field tcyclone-w-50">
                            <div class="tcyclone-px-5">
                                <label>Dơn vị quản lý</label>
                                <div class="ui disabled input mini">
                                    <input
                                        type="text"
                                        class="tcyclone-modal-input disabled"
                                        placeholder="Dơn vị quản lý..."
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="field tcyclone-w-50">
                            <div class="tcyclone-px-5">
                                <label>Khoảng cách so với km0</label>
                                <div class="ui input mini">
                                    <input
                                        type="text"
                                        class="tcyclone-modal-input tcyclone-modal-distance-to-0km"
                                        placeholder="Khoảng cách so với km0..."
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="field tcyclone-w-50">
                            <div class="tcyclone-px-5">
                                <label>Khoảng cách mép đường</label>
                                <div class="ui input mini">
                                    <input
                                        type="text"
                                        class="tcyclone-modal-input tcyclone-modal-road-edge-distance"
                                        placeholder="Khoảng cách mép đường..."
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="field tcyclone-w-50">
                            <div class="tcyclone-px-5">
                                <label>Vị trí</label>
                                <div
                                    class="tcyclone-modal-dropdown tcyclone-modal-positon tcyclone-w-100 mini ui search selection dropdown"
                                >
                                    <i class="dropdown icon"></i>
                                    <div class="default text">Vị trí</div>
                                    <div class="menu">
                                        <div class="item" data-value="LEFT">Trái</div>
                                        <div class="item" data-value="RIGHT">Phải</div>
                                        <div class="item" data-value="CENTER">Tim</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="field tcyclone-w-50">
                            <div class="tcyclone-px-5">
                                <label>Loại dải phân cách</label>
                                <div
                                    class="tcyclone-modal-dropdown tcyclone-modal-manhole-type tcyclone-w-100 mini ui search selection dropdown"
                                >
                                    <i class="dropdown icon"></i>
                                    <div class="default text">Loại dải phân cách</div>
                                    <div class="menu">
                                        <div class="item" data-value="355">Cứng</div>
                                        <div class="item" data-value="356">Mềm</div>
                                        <div class="item" data-value="357">Vỉa</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="field tcyclone-w-50">
                            <div class="tcyclone-px-5">
                                <label>Chiều dài</label>
                                <div class="ui input mini">
                                    <input
                                        type="text"
                                        class="tcyclone-modal-input tcyclone-modal-length"
                                        placeholder="Kích thước..."
                                    />
                                </div>
                            </div>
                        </div>
                        <!--- <div class="field tcyclone-w-50">
                            <div class="tcyclone-px-5">
                                <label>Hiện trạng sử dụng</label>
                                <div
                                    class="tcyclone-modal-dropdown tcyclone-modal-manhole-type tcyclone-w-100 mini ui search selection dropdown"
                                >
                                    <i class="dropdown icon"></i>
                                    <div class="default text">Hiện trạng sử dụng</div>
                                    <div class="menu">
                                        <div class="item" data-value="358">Đá</div>
                                        <div class="item" data-value="359">Bê tông xi măng</div>
                                        <div class="item" data-value="360">Trụ bê tông</div>
                                        <div class="item" data-value="361">Sắt mạ kẽm</div>
                                        <div class="item" data-value="362">Không</div>
                                        <div class="item" data-value="363">Tôn mũi tên</div>
                                        <div class="item" data-value="364">Bê tông xi măng cốt thép</div>
                                        <div class="item" data-value="365">trụ dẻo +mũi tên phản quang</div>
                                        <div class="item" data-value="366">Thép</div>
                                    </div>
                                </div>
                            </div>
                        </div> --->
                        <div class="field tcyclone-w-50">
                            <div class="tcyclone-px-5">
                                <label>Chiều rộng</label>
                                <div class="ui input mini">
                                    <input
                                        type="text"
                                        class="tcyclone-modal-input tcyclone-modal-width"
                                        placeholder="Kích thước..."
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="field tcyclone-w-50">
                            <div class="tcyclone-px-5">
                                <label>Tình trạng</label>
                                <div
                                    class="tcyclone-modal-dropdown tcyclone-modal-status tcyclone-w-100 mini ui search selection dropdown"
                                >
                                    <i class="dropdown icon"></i>
                                    <div class="default text">V3</div>
                                    <div class="menu">
                                        <div class="item" data-value="186">Tốt</div>
                                        <div class="item" data-value="187">Trung bình</div>
                                        <div class="item" data-value="188">Xấu</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="tcyclone-d-flex tcyclone-flex-wrap">
                        <div class="field tcyclone-w-50">
                            <div class="tcyclone-px-5">
                                <label>Tọa độ</label>
                                <textarea
                                    class="tcyclone-modal-input tcyclone-modal-coordinates"
                                    placeholder="Tọa độ"
                                    rows="4"
                                ></textarea>
                            </div>
                        </div>
                        <div class="field tcyclone-w-50">
                            <div class="tcyclone-px-5">
                                <label>Mô tả</label>
                                <textarea
                                    class="tcyclone-modal-input tcyclone-modal-description"
                                    placeholder="Mô tả"
                                    rows="4"
                                ></textarea>
                            </div>
                        </div>
                    </div>
                </div>`;
        },

        getDataCreate: function () {
            return {
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
        },

        getDataUpdate: function () {
            return {
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
                type_id: $('.tcyclone-modal-manhole-type').dropdown('get value'),
                length: $('.tcyclone-modal-length').val(),
                width: $('.tcyclone-modal-width').val(),
                status_id: $('.tcyclone-modal-status').dropdown('get value'),
                coordinates: $('.tcyclone-modal-coordinates').val(),
                description: $('.tcyclone-modal-description').val(),
            };
        },
    },
    11: {
        render: function (data) {
            let html = data
                .map((d, i) => {
                    const fields = [
                        'object_name',
                        'distance_0km',
                        'road_edge_distance',
                        'form_date',
                        'to_date',
                        'position',
                        'type',
                        'quantity',
                        'length',
                        'status',
                    ];
                    const nameMapping = {
                        distance_0km: 'Khoảng cách 0km',
                        object_name: 'Tên đường',
                        road_edge_distance: 'Khoảng cách mep đường',
                        form_date: 'Ngày bắt đầu',
                        to_date: 'Ngày kết thúc',
                        position: 'Vị trí',
                        type: 'Loại cống',
                        quantity: 'Số lượng cọc',
                        length: 'Chiều dài',
                        status: 'Trạng thái',
                        name: 'Tên',
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
                                                        : `<h4 class="ui header">Không hỗ trợ thêm mới</h4>`
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

            return html;
        },

        addDataModalUpdate: function (data) {
            console.log(data.quantity);
            $('.tcyclone-modal-description').val(data.description ?? '');
            $('.tcyclone-modal-coordinates').val(data.coordinates ?? '');
            $('.tcyclone-modal-road-edge-distance-data').val(data.road_edge_distance ?? '');
            $('.tcyclone-modal-status').dropdown('set selected', data.status_id ?? 433);
            $('.tcyclone-modal-size').val(data.length ?? '');
            $('.tcyclone-modal-manhole-type').dropdown('set selected', data.type ?? 380);
            $('.tcyclone-modal-positon').dropdown('set selected', data.position ?? 'CENTER');
            $('.tcyclone-modal-road-edge-distance').val(data.quantity ?? '');
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
            $('.tcyclone-modal-organization-id').val(data.organization_id ?? 1);
            $('.tcyclone-modal-id').val(data.id ?? '');
            $('.tcyclone-modal-reflective_eyes_number').val(data.reflective_eyes_number ?? '');
        },

        addContentFormCreate: function () {
            return `<h4 class="ui header">Không hỗ trợ</h4>`;
        },

        addContentModalUpdate: function () {
            return `
                <div class="ui form">
                    <input type="hidden" class="tcyclone-modal-organization-id" />
                    <input type="hidden" class="tcyclone-modal-reflective_eyes_number" />
                    <input type="hidden" class="tcyclone-modal-id" />
                    <input type="hidden" class="tcyclone-modal-road-edge-distance-data" />
                    <div class="field">
                        <div class="tcyclone-px-5">
                            <label>Tên</label>
                            <div class="ui disabled input mini">
                                <input
                                    disabled
                                    type="text"
                                    class="tcyclone-modal-input tcyclone-modal-name"
                                    placeholder="Tên..."
                                />
                            </div>
                        </div>
                    </div>
                    <div class="tcyclone-d-flex tcyclone-flex-wrap">
                        <div class="field tcyclone-w-50">
                            <div class="tcyclone-px-5">
                                <label>Ngày bắt đầu</label>
                                <div class="ui input mini">
                                    <input
                                        type="text"
                                        placeholder="dd/mm/yyyy"
                                        class="tcyclone-modal-input tcyclone-modal-start-date"
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="field tcyclone-w-50">
                            <div class="tcyclone-px-5">
                                <label>Ngày kết thúc</label>
                                <div class="ui input mini">
                                    <input
                                        type="text"
                                        placeholder="dd/mm/yyyy"
                                        class="tcyclone-modal-input tcyclone-modal-end-date"
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="field tcyclone-w-50">
                            <div class="tcyclone-px-5">
                                <label>Loại đối tượng</label>
                                <div
                                    class="tcyclone-modal-dropdown tcyclone-modal-object disabled tcyclone-w-100 mini ui search selection dropdown"
                                >
                                    <i class="dropdown icon"></i>
                                    <div class="default text">V3</div>
                                    <div class="menu">
                                        <div class="item" data-value="ROAD">Đường</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="field tcyclone-w-50">
                            <div class="tcyclone-px-5">
                                <label>Tên đối tượng</label>
                                <div
                                    class="tcyclone-modal-dropdown tcyclone-modal-object-name tcyclone-w-100 mini ui search selection dropdown"
                                >
                                    <i class="dropdown icon"></i>
                                    <div class="default text">V3</div>
                                    <div class="menu"></div>
                                </div>
                            </div>
                        </div>
                        <div class="field tcyclone-w-50">
                            <div class="tcyclone-px-5">
                                <label>Dơn vị quản lý</label>
                                <div class="ui disabled input mini">
                                    <input
                                        type="text"
                                        class="tcyclone-modal-input disabled"
                                        placeholder="Dơn vị quản lý..."
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="field tcyclone-w-50">
                            <div class="tcyclone-px-5">
                                <label>Khoảng cách so với km0</label>
                                <div class="ui input mini">
                                    <input
                                        type="text"
                                        class="tcyclone-modal-input tcyclone-modal-distance-to-0km"
                                        placeholder="Khoảng cách so với km0..."
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="field tcyclone-w-50">
                            <div class="tcyclone-px-5">
                                <label>Số lượng cọc</label>
                                <div class="ui input mini">
                                    <input
                                        type="text"
                                        class="tcyclone-modal-input tcyclone-modal-road-edge-distance"
                                        placeholder="Khoảng cách mép đường..."
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="field tcyclone-w-50">
                            <div class="tcyclone-px-5">
                                <label>Vị trí</label>
                                <div
                                    class="tcyclone-modal-dropdown tcyclone-modal-positon tcyclone-w-100 mini ui search selection dropdown"
                                >
                                    <i class="dropdown icon"></i>
                                    <div class="default text">Vị trí</div>
                                    <div class="menu">
                                        <div class="item" data-value="LEFT">Trái</div>
                                        <div class="item" data-value="RIGHT">Phải</div>
                                        <div class="item" data-value="CENTER">Tim</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="field tcyclone-w-50">
                            <div class="tcyclone-px-5">
                                <label>Loại cọc</label>
                                <div
                                    class="tcyclone-modal-dropdown tcyclone-modal-manhole-type tcyclone-w-100 mini ui search selection dropdown"
                                >
                                    <i class="dropdown icon"></i>
                                    <div class="default text">Loại cọc</div>
                                    <div class="menu">
                                        <div class="item" data-value="448">Loại 15*15</div>
                                        <div class="item" data-value="448">Loại 18*18</div>
                                        <div class="item" data-value="450">Loại 12*12</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="field tcyclone-w-50">
                            <div class="tcyclone-px-5">
                                <label>Chiều dài</label>
                                <div class="ui input mini">
                                    <input
                                        type="text"
                                        class="tcyclone-modal-input tcyclone-modal-size"
                                        placeholder="Kích thước..."
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="field">
                        <div class="tcyclone-px-5">
                            <label>Tình trạng</label>
                            <div
                                class="tcyclone-modal-dropdown tcyclone-modal-status tcyclone-w-100 mini ui search selection dropdown"
                            >
                                <i class="dropdown icon"></i>
                                <div class="default text">V3</div>
                                <div class="menu">
                                    <div class="item" data-value="417">Tốt</div>
                                    <div class="item" data-value="418">Yếu</div>
                                    <div class="item" data-value="419">Trung bình</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="tcyclone-d-flex tcyclone-flex-wrap">
                        <div class="field tcyclone-w-50">
                            <div class="tcyclone-px-5">
                                <label>Tọa độ</label>
                                <textarea
                                    class="tcyclone-modal-input tcyclone-modal-coordinates"
                                    placeholder="Tọa độ"
                                    rows="4"
                                ></textarea>
                            </div>
                        </div>
                        <div class="field tcyclone-w-50">
                            <div class="tcyclone-px-5">
                                <label>Mô tả</label>
                                <textarea
                                    class="tcyclone-modal-input tcyclone-modal-description"
                                    placeholder="Mô tả"
                                    rows="4"
                                ></textarea>
                            </div>
                        </div>
                    </div>
                </div>`;
        },

        getDataCreate: function () {
            return {
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
        },

        getDataUpdate: function () {
            return {
                coordinates: $('.tcyclone-modal-coordinates').val(),
                description: $('.tcyclone-modal-description').val(),
                distance_0km: $('.tcyclone-modal-distance-to-0km').val(),
                to_date: $('.tcyclone-modal-end-date').val(),
                id: $('.tcyclone-modal-id').val(),
                quanlity: $('.tcyclone-modal-road-edge-distance').val(),
                name: $('.tcyclone-modal-name').val(),
                name_object_id: $('.tcyclone-modal-object-name').dropdown('get value'),
                object_type: $('.tcyclone-modal-object').dropdown('get value'),
                organization_id: $('.tcyclone-modal-organization-id').val(),
                position: $('.tcyclone-modal-positon').dropdown('get value'),
                form_date: $('.tcyclone-modal-start-date').val(),
                object_name: $('.tcyclone-modal-object-name').dropdown('get value'),
                road_edge_distance: $('.tcyclone-modal-road-edge-distance-data').val(),
                type: $('.tcyclone-modal-manhole-type').dropdown('get value'),
                length: $('.tcyclone-modal-size').val(),
                status_id: $('.tcyclone-modal-status').dropdown('get value'),
                reflective_eyes_number: $('.tcyclone-modal-reflective_eyes_number').val(),
            };
        },
    },
};
