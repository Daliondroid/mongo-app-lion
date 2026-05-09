<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Mahasiswa;
use Barryvdh\DomPDF\Facade\Pdf;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Alignment;

class MahasiswaController extends Controller
{
    public function index()
    {
        $mahasiswa = Mahasiswa::all();
        return response()->json($mahasiswa);
    }

    public function store(Request $request)
    {
        // Validasi input
        $request->validate([
            'nama' => 'required',
            'nim' => 'required|unique:mahasiswa,nim',
            'jenis_kelamin' => 'required',
            'usia' => 'required|numeric',
            'prodi' => 'required',
        ]);

        $mahasiswa = Mahasiswa::create($request->all());
        return response()->json(['message' => 'Data berhasil disimpan', 'data' => $mahasiswa]);
    }

    public function show($id)
    {
        return response()->json(Mahasiswa::find($id));
    }

    public function update(Request $request, $id)
    {
        $mahasiswa = Mahasiswa::find($id);
        $mahasiswa->update($request->all());
        return response()->json(['message' => 'Data berhasil diupdate']);
    }

    public function destroy($id)
    {
        Mahasiswa::destroy($id);
        return response()->json(['message' => 'Data berhasil dihapus']);
    }

    public function exportPdf()
    {
        $mahasiswa = Mahasiswa::all();
        
        $pdf = Pdf::loadView('mahasiswa.pdf', compact('mahasiswa'));
        
        // Atur ukuran kertas ke A4 (Opsional)
        $pdf->setPaper('A4', 'landscape');
        
        return $pdf->download('Daftar_Mahasiswa.pdf');
    }

    public function exportPdfSingle($id)
    {
        // Mengambil satu data saja, masukkan ke array agar bisa dipakai di view yang sama
        $mahasiswa = [Mahasiswa::find($id)];
        $mhs = Mahasiswa::find($id);
        
        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('mahasiswa.pdf', compact('mahasiswa'));
        return $pdf->download('Data_Mahasiswa_'.$mhs->nim.'.pdf');
    }
    
    public function exportExcel()
    {
        $mahasiswa = Mahasiswa::all();
        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();

        // 1. Set Header
        $headers = ['NIM', 'Nama', 'Jenis Kelamin', 'Usia', 'Program Studi'];
        $sheet->fromArray($headers, NULL, 'A1');

        // 2. Styling Header (Warna Background & Teks Bold)
        $headerStyle = [
            'font' => [
                'bold' => true,
                'color' => ['rgb' => 'FFFFFF'],
            ],
            'fill' => [
                'fillType' => Fill::FILL_SOLID,
                'startColor' => ['rgb' => '4472C4'], // Warna Biru Profesional
            ],
            'alignment' => [
                'horizontal' => Alignment::HORIZONTAL_CENTER,
            ],
        ];
        $sheet->getStyle('A1:E1')->applyFromArray($headerStyle);

        // 3. Isi Data
        $row = 2;
        foreach ($mahasiswa as $mhs) {
            $prodi = is_string($mhs->prodi) ? $mhs->prodi : ($mhs->prodi['nama'] ?? '-');

            $sheet->setCellValue('A' . $row, $mhs->nim);
            $sheet->setCellValue('B' . $row, $mhs->nama);
            $sheet->setCellValue('C' . $row, $mhs->jenis_kelamin);
            $sheet->setCellValue('D' . $row, $mhs->usia);
            $sheet->setCellValue('E' . $row, $prodi);
            $row++;
        }

        // 4. Styling Tabel (Borders & Alignment)
        $lastRow = $row - 1;
        $tableRange = 'A1:E' . $lastRow;
        
        $styleArray = [
            'borders' => [
                'allBorders' => [
                    'borderStyle' => Border::BORDER_THIN,
                    'color' => ['rgb' => '000000'],
                ],
            ],
            'alignment' => [
                'vertical' => Alignment::VERTICAL_CENTER,
            ],
        ];
        $sheet->getStyle($tableRange)->applyFromArray($styleArray);

        // Mengetengahkan kolom NIM, Jenis Kelamin, dan Usia
        $sheet->getStyle('A2:A'.$lastRow)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
        $sheet->getStyle('C2:D'.$lastRow)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);

        // 5. Auto-size kolom
        foreach (range('A', 'E') as $col) {
            $sheet->getColumnDimension($col)->setAutoSize(true);
        }

        // Proses Download
        $writer = new Xlsx($spreadsheet);
        $fileName = 'Daftar_Mahasiswa.xlsx';

        header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        header('Content-Disposition: attachment;filename="' . $fileName . '"');
        header('Cache-Control: max-age=0');

        $writer->save('php://output');
        exit;
    }


    public function exportExcelSingle($id)
    {
        $mhs = Mahasiswa::find($id);
        $spreadsheet = new \PhpOffice\PhpSpreadsheet\Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();

        // Header
        $headers = ['NIM', 'Nama', 'Jenis Kelamin', 'Usia', 'Program Studi'];
        $sheet->fromArray($headers, NULL, 'A1');

        // Styling Header
        $sheet->getStyle('A1:E1')->getFont()->setBold(true);
        $sheet->getStyle('A1:E1')->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()->setRGB('4472C4');
        $sheet->getStyle('A1:E1')->getFont()->getColor()->setRGB('FFFFFF');

        // Isi Data Tunggal
        $prodi = is_string($mhs->prodi) ? $mhs->prodi : ($mhs->prodi['nama'] ?? '-');
        $sheet->setCellValue('A2', $mhs->nim);
        $sheet->setCellValue('B2', $mhs->nama);
        $sheet->setCellValue('C2', $mhs->jenis_kelamin);
        $sheet->setCellValue('D2', $mhs->usia);
        $sheet->setCellValue('E2', $prodi);

        // Border & Alignment
        $sheet->getStyle('A1:E2')->getBorders()->getAllBorders()->setBorderStyle(\PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN);
        foreach (range('A', 'E') as $col) {
            $sheet->getColumnDimension($col)->setAutoSize(true);
        }

        $writer = new \PhpOffice\PhpSpreadsheet\Writer\Xlsx($spreadsheet);
        $fileName = 'Data_Mahasiswa_'.$mhs->nim.'.xlsx';

        header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        header('Content-Disposition: attachment;filename="' . $fileName . '"');
        $writer->save('php://output');
        exit;
    }
}