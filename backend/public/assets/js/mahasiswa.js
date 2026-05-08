$(document).ready(function() {
    // Setup CSRF Token agar request POST/PUT/DELETE diizinkan oleh Laravel
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });

    var url = '/mahasiswa/';

    // Reset form saat tombol tambah diklik
    $('#add').click(function() {
        $('#mahasiswaForm')[0].reset();
        $('#id').val('');
        $('#mahasiswaModalLabel').text('Tambah Mahasiswa');
    });

    // Simpan Data (Tambah dan Edit)
    $('#mahasiswaForm').submit(function(e) {
        e.preventDefault();
        
        var id = $('#id').val();
        var formData = {
            nim: $('#nim').val(),
            nama: $('#nama').val(),
            jenis_kelamin: $('#jenis_kelamin').val(),
            usia: $('#usia').val(),
            // Kirimkan string nama prodi saja agar tidak bentrok dengan data lama
            prodi: $('#nama_prodi').val() 
        };

        var requestMethod = id ? 'PUT' : 'POST';
        var requestUrl = id ? '/mahasiswa/' + id : '/mahasiswa';

        $.ajax({
            url: requestUrl,
            method: requestMethod,
            data: formData,
            success: function(res) {
                $('#mahasiswaModal').modal('hide');
                location.reload(); 
            },
            error: function(err) {
                console.log(err);
                alert('Gagal menyimpan data. Cek console log.');
            }
        });
    });

    // Tampilkan Modal Edit beserta datanya
    $('.btn-edit').click(function() {
        var id = $(this).data('id');

        $.ajax({
            url: url + id,
            method: 'GET',
            success: function(data) {
                $('#id').val(data._id);
                $('#nim').val(data.nim);
                $('#nama').val(data.nama);
                $('#jenis_kelamin').val(data.jenis_kelamin);
                $('#usia').val(data.usia);
                $('#nama_prodi').val(data.prodi);

                $('#mahasiswaModalLabel').text('Edit Mahasiswa');
                $('#mahasiswaModal').modal('show');
            },
            error: function(err) {
                console.log(err);
                alert('Gagal mengambil data mahasiswa');
            }
        });
    });

    // Hapus Data
    $('.btn-delete').click(function() {
        if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
            var id = $(this).data('id');
            $.ajax({
                url: url + id,
                method: 'DELETE',
                success: function() {                    
                    location.reload();
                },
                error: function(err) {
                    console.log(err);
                    alert('Gagal menghapus data');
                }
            });
        }
    });

    // Export PDF
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

        $('#mahasiswaData tr').each(function() {
            const cells = $(this).find('td');
            
            if (cells.length > 1) {
                contentHTML += '<tr>';
                contentHTML += '<td>' + $(cells[0]).text() + '</td>';
                contentHTML += '<td>' + $(cells[1]).text() + '</td>';
                contentHTML += '<td>' + $(cells[2]).text() + '</td>';
                contentHTML += '<td>' + $(cells[3]).text() + '</td>';
                contentHTML += '<td>' + $(cells[4]).text() + '</td>';
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
            window.location = json.file;
            btn.html(originalText).prop('disabled', false);
        })
        .catch(err => {
            alert('Gagal membuat PDF');
            btn.html(originalText).prop('disabled', false);
        });
    });

    // Export Excel (Dikeluarkan dari block PDF)
    $('#excel').click(function() {
        window.location = url + 'export_excel';
    });
});