<?php

use App\Http\Controllers\MahasiswaController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return redirect('/mahasiswa');
});

Route::get('/mahasiswa', [MahasiswaController::class, 'index']);
