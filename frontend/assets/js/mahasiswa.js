$(document).ready(function() {
    var url = 'http://localhost:8000/api/mahasiswa/';
    $.ajax({
       url: url,
       method: 'GET',
       berforeSend: function() {
           $('#mahasiswa-table').html('<tr><td colspan="6" class="text-center"><i class="fas fa-spinner fa-spin"></i> Loading...</td></tr>');
       },
        success: function(data) {
            var tableBody = $('#mahasiswa-table');
            tableBody.empty();
            $.each(data, function(index, mahasiswa) {
                var row = '<tr data-id="' + encodeURIComponent(btoa(mahasiswa.id)) + '">' +
                    '<td>' + mahasiswa.nim + '</td>' +
                    '<td>' + mahasiswa.nama + '</td>' +
                    '<td>' + mahasiswa.jenis_kelamin + '</td>' +
                    '<td>' + mahasiswa.usia + '</td>' +
                    '<td>' + mahasiswa.prodi.nama + '</td>' +
                    '<td><button class="btn btn-warning btn-sm edit">Edit</button> <button class="btn btn-danger btn-sm delete">Hapus</button></td>' +
                    '</tr>';
                tableBody.append(row);
            });
            if (data.length === 0) {
                tableBody.html('<tr><td colspan="6" class="text-center"><i class="fas fa-solid fa-triangle-exclamation"></i> Tidak ada data</td></tr>');
            }
        },
        error: function(err) {
            console.log(err)
            $('#mahasiswa-table').html('<tr><td colspan="6" class="text-center"><i class="fas fa-solid fa-circle-xmark"></i> Gagal memuat data</td></tr>');
        }      
    });

    $('#mahasiswa-table').on('click', '.delete', function() {
        var row = $(this).closest('tr');
        var id = decodeURIComponent(atob(row.data('id')));
        if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
            $.ajax({
                url: url + id,
                method: 'DELETE',
                success: function() {                    
                    row.remove();
                },
                error: function(err) {
                    console.log(err);
                    alert('Gagal menghapus data');
                }
            });
        }
    });

    $('#mahasiswa-table').on('click', '.edit', function() {
        var row = $(this).closest('tr');
        var id = decodeURIComponent(atob(row.data('id')));

        $.ajax({
            url: url + id,
            method: 'GET',
            success: function(data) {
                $('#nim').val(data.nim);
                $('#nama').val(data.nama);
                $('#jenis_kelamin').val(data.jenis_kelamin);
                $('#usia').val(data.usia);
                $('#kode_prodi').val(data.prodi.kode);
                $('#nama_prodi').val(data.prodi.nama);

                $('#mahasiswaModalLabel').text('Edit Mahasiswa');
                $('#save').data('id', id);

                $('#mahasiswaModal').modal('show');
            },
            error: function(err) {
                console.log(err);
                alert('Gagal mengambil data mahasiswa');
            }
        });
    });

    $('#add').click(function() {
        $('#mahasiswa-form')[0].reset();
        $('#mahasiswaModalLabel').text('Tambah Mahasiswa');
        $('#save').data('id', '');
    });

    $('#mahasiswa-form').submit(function(e) {
        e.preventDefault();
        
        var formData = {
            nim: $('#nim').val(),
            nama: $('#nama').val(),
            jenis_kelamin: $('#jenis_kelamin').val(),
            usia: $('#usia').val(),
            prodi: {
                kode: $('#kode_prodi').val(),
                nama: $('#nama_prodi').val()
            }
        };

        var id = $('#save').data('id');
        if (id) {
            $.ajax({
                url: url + id,
                method: 'PUT',
                contentType: 'application/json',
                data: JSON.stringify(formData),
                success: function() {
                    $('#mahasiswaModal').modal('hide');
                    $('#mahasiswa-form')[0].reset();
                    $('#save').data('id', '');
                    location.reload();
                },
                error: function(err) {
                    console.log(err);
                    alert('Gagal mengedit data');
                }
            });
        } else {
            $.ajax({
                url: url,
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(formData),
                success: function() {
                    $('#mahasiswaModal').modal('hide');
                    $('#mahasiswa-form')[0].reset();
                    location.reload();
                },
                error: function(err) {
                    console.log(err);
                    alert('Gagal menambah data');
                }
            });
        }
    });

    $('#pdf').click(function() {
        const btn = $(this);
        const originalText = btn.html();
        btn.html('<i class="fas fa-spinner fa-spin"></i> Loading...').prop('disabled', true);

        const data = new FormData();
        
        let contentHTML = `
            <html>
            <head>
                <style>
                    body { font-family: sans-serif; }
                    h1 { text-align: center; color: #333; }
                    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                    th, td { border: 1px solid #000; padding: 10px; text-align: left; }
                    th { background-color: #f2f2f2; }
                </style>
            </head>
            <body>
                <h1>Daftar Mahasiswa</h1>
                <table>
                    <thead>
                        <tr>
                            <th>NIM</th>
                            <th>Nama</th>
                            <th>Jenis Kelamin</th>
                            <th>Usia</th>
                            <th>Prodi</th>
                        </tr>
                    </thead>
                    <tbody>`;

        $('#mahasiswa-table tr').each(function() {
            const cells = $(this).find('td');
            
            if (cells.length > 1) {
                contentHTML += '<tr>';
                contentHTML += '<td>' + $(cells[0]).text() + '</td>'; // NIM
                contentHTML += '<td>' + $(cells[1]).text() + '</td>'; // Nama
                contentHTML += '<td>' + $(cells[2]).text() + '</td>'; // Jenis Kelamin
                contentHTML += '<td>' + $(cells[3]).text() + '</td>'; // Usia
                contentHTML += '<td>' + $(cells[4]).text() + '</td>'; // Prodi
                contentHTML += '</tr>';
            }
        });

        contentHTML += '</tbody></table></body></html>';
        data.append('html', contentHTML);

        fetch('https://apdf.io/api/pdf/file/create', {
            headers: {'Authorization': 'Bearer hX8ckdkFd2YIvcLP2LlO8kKxGJ1FzoNMJh6efRMi423ad4d6'},
            method: 'POST',
            body: data
        })
        .then(response => response.json())
        .then(json => {
            console.log(json);
            window.location = json.file;
        });

        $('#excel').click(function() {
            window.location = url + 'mahasiswa/export_excel'
        });
    });
});