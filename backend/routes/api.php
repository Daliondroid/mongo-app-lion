<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\User;
use App\Http\Controllers\MahasiswaController;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');

Route::get('/users', function () {
    return User::all();
});

Route::get('/mahasiswa', [MahasiswaController::class, 'index']);
Route::post('/mahasiswa', [MahasiswaController::class, 'store']);
Route::get('/mahasiswa/{id}', [MahasiswaController::class, 'show']);
Route::put('/mahasiswa/{id}', [MahasiswaController::class, 'update']);
Route::delete('/mahasiswa/{id}', [MahasiswaController::class, 'destroy']);
// Masukkan fitur export di dalam routes API
Route::get('/mahasiswa/export-pdf', [MahasiswaController::class, 'exportPdf']);
Route::get('/mahasiswa/export-excel', [MahasiswaController::class, 'exportExcel']);
Route::get('/mahasiswa/{id}/export-pdf-single', [MahasiswaController::class, 'exportPdfSingle']);
Route::get('/mahasiswa/{id}/export-excel-single', [MahasiswaController::class, 'exportExcelSingle']);