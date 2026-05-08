<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Mahasiswa;

class MahasiswaController extends Controller
{
    public function index()
    {
        $mahasiswa = Mahasiswa::all();
        return view('mahasiswa.index', compact('mahasiswa'));
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
}