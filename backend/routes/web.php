<?php

use App\Http\Controllers\MahasiswaController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return redirect('/mahasiswa');
});

// Endpoint untuk halaman utama dan API CRUD
Route::resource('mahasiswa', MahasiswaController::class);
