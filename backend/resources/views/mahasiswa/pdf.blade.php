<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Daftar Mahasiswa</title>
    <style>
        body { font-family: sans-serif; }
        h1 { text-align: center; color: #333; margin-bottom: 20px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #000; padding: 8px; text-align: left; }
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
                <th>Program Studi</th>
            </tr>
        </thead>
        <tbody id="mahasiswaData">
            @foreach($mahasiswa as $mhs)
            <tr>
                <td>{{ $mhs->nim }}</td>
                <td>{{ $mhs->nama }}</td>
                <td>{{ $mhs->jenis_kelamin }}</td>
                <td>{{ $mhs->usia }}</td>
                <td>{{ is_string($mhs->prodi) ? $mhs->prodi : ($mhs->prodi['nama'] ?? '-') }}</td>
                <td>
                    <button class="btn btn-warning btn-sm btn-edit" data-id="{{ $mhs->_id }}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-danger btn-sm btn-delete" data-id="{{ $mhs->_id }}">
                        <i class="fas fa-trash"></i>
                    </button>
                    
                    <a href="{{ url('/mahasiswa/'.$mhs->_id.'/export-pdf-single') }}" class="btn btn-secondary btn-sm" target="_blank" title="Export PDF Data Ini">
                        <i class="fas fa-file-pdf"></i>
                    </a>
                    <a href="{{ url('/mahasiswa/'.$mhs->_id.'/export-excel-single') }}" class="btn btn-info btn-sm" title="Export Excel Data Ini">
                        <i class="fas fa-file-excel"></i>
                    </a>
                </td>
            </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>