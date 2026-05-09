<?php

use App\Http\Controllers\MahasiswaController;
use Illuminate\Support\Facades\Route;

Route::get('/mahasiswa', function () {
    return view('mahasiswa.index');
});

// Route::get('/mahasiswa', [MahasiswaController::class, 'index']);
