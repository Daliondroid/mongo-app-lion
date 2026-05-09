$(document).ready(function() {
    // Setup CSRF Token
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });

    // Mengarah ke endpoint API
    var url = '/api/mahasiswa/';

    // --- FUNGSI BARU: Load data dari API secara dinamis ---
    function loadMahasiswa() {
        $.ajax({
            url: url,
            type: 'GET',
            beforeSend: function() {
                $('#mahasiswaData').html('<tr><td colspan="6" class="text-center"><i class="fas fa-spinner fa-spin"></i> Loading...</td></tr>');
            },
            success: function(data) {
                var tableBody = $('#mahasiswaData');
                tableBody.empty();

                $.each(data, function(index, mhs) {
                    var prodi = typeof mhs.prodi === 'object' ? (mhs.prodi.nama || '-') : mhs.prodi;
                    
                    var row = '<tr>' +
                        '<td>' + mhs.nim + '</td>' +
                        '<td>' + mhs.nama + '</td>' +
                        '<td>' + mhs.jenis_kelamin + '</td>' +
                        '<td>' + mhs.usia + '</td>' +
                        '<td>' + prodi + '</td>' +
                        '<td>' +
                            '<button class="btn btn-warning btn-sm btn-edit" data-id="' + mhs._id + '"><i class="fas fa-edit"></i></button> ' +
                            '<button class="btn btn-danger btn-sm btn-delete" data-id="' + mhs._id + '"><i class="fas fa-trash"></i></button> ' +
                            '<span class="mx-1 text-muted">|</span> ' +
                            '<a href="/api/mahasiswa/' + mhs._id + '/export-pdf-single" class="btn btn-secondary btn-sm" target="_blank" title="Export PDF"><i class="fas fa-file-pdf"></i></a> ' +
                            '<a href="/api/mahasiswa/' + mhs._id + '/export-excel-single" class="btn btn-info btn-sm" title="Export Excel"><i class="fas fa-file-excel"></i></a>' +
                        '</td>' +
                    '</tr>';
                    tableBody.append(row);
                });

                if (data.length === 0) {
                    tableBody.html('<tr><td colspan="6" class="text-center">Tidak ada data</td></tr>');
                }
            },
            error: function(err) {
                $('#mahasiswaData').html('<tr><td colspan="6" class="text-center text-danger">Gagal memuat data API</td></tr>');
            }
        });
    }

    // Panggil fungsi saat web pertama kali dibuka
    loadMahasiswa();

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
            prodi: $('#nama_prodi').val() 
        };

        var requestMethod = id ? 'PUT' : 'POST';
        var requestUrl = id ? url + id : url;

        $.ajax({
            url: requestUrl,
            method: requestMethod,
            data: formData,
            success: function(res) {
                $('#mahasiswaModal').modal('hide');
                loadMahasiswa(); // Update tabel secara dinamis tanpa refresh halaman
            },
            error: function(err) {
                console.log(err);
                alert('Gagal menyimpan data.');
            }
        });
    });

    // Tampilkan Modal Edit (Event Delegation)
    $(document).on('click', '.btn-edit', function() {
        var id = $(this).data('id'); 

        $.ajax({
            url: url + id,
            method: 'GET',
            success: function(data) {
                $('#id').val(id); 
                $('#nim').val(data.nim);
                $('#nama').val(data.nama);
                $('#jenis_kelamin').val(data.jenis_kelamin);
                $('#usia').val(data.usia);
                
                var prodi = typeof data.prodi === 'object' ? data.prodi.nama : data.prodi;
                $('#nama_prodi').val(prodi);

                $('#mahasiswaModalLabel').text('Edit Mahasiswa');
                $('#mahasiswaModal').modal('show');
            },
            error: function(err) {
                console.log(err);
                alert('Gagal mengambil data mahasiswa');
            }
        });
    });

    // Hapus Data (Event Delegation)
    $(document).on('click', '.btn-delete', function() {
        if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
            var id = $(this).data('id');
            $.ajax({
                url: url + id,
                method: 'DELETE',
                success: function() {                    
                    loadMahasiswa(); // Update tabel secara dinamis tanpa refresh halaman
                },
                error: function(err) {
                    console.log(err);
                    alert('Gagal menghapus data');
                }
            });
        }
    });

    // Export PDF Massal
    $('#pdf').click(function() {
        window.open('/api/mahasiswa/export-pdf', '_blank');
    });

    // Export Excel Massal
    $('#excel').click(function() {
        window.location.href = '/api/mahasiswa/export-excel';
    });
});