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
        var id = $(this).data('id'); // ID sudah berhasil ditangkap di sini

        $.ajax({
            url: url + id,
            method: 'GET',
            success: function(data) {
                // PERBAIKAN: Gunakan variabel id secara langsung
                $('#id').val(id); 
                
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

    // Export PDF Massal
    $('#pdf').click(function() {
        window.open('/api/mahasiswa/export-pdf', '_blank');
    });

    // Export Excel Massal
    $('#excel').click(function() {
        window.location.href = '/api/mahasiswa/export-excel';
    });
});