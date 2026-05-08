<?php

use App\Http\Controllers\MahasiswaController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return redirect('/mahasiswa');
});


Route::get('/mahasiswa/export-pdf', [MahasiswaController::class, 'exportPdf']);
Route::get('/mahasiswa/export-excel', [MahasiswaController::class, 'exportExcel']);
// Endpoint untuk halaman utama dan API CRUD
Route::resource('mahasiswa', MahasiswaController::class);
