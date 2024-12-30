<?php

namespace App\Http\Controllers;

use App\Models\BackLayer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;


class BacklayerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index() {
        $user = Auth::user();
        $backlayers = BackLayer::all();

        // dd($backlayer);
        return Inertia::render('Backlayer/Index', [
            'title' => 'Daftar Penembok Batik Tulis Merawit Cirebon',
            'user' => $user,
            'backlayers' => $backlayers,
        ]);
    }
    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Validasi input
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        // Generate next backlayer_number
        $lastBacklayer = BackLayer::orderBy('backlayer_number', 'desc')->first();
        $lastNumber = $lastBacklayer ? (int) ltrim($lastBacklayer->backlayer_number, '0') : 0; // Ambil angka terakhir
        $nextNumber = $lastNumber + 1; // Tambah 1
        $backlayerNumber = str_pad($nextNumber, 2, '0', STR_PAD_LEFT); // Format menjadi dua digit, misalnya '01', '02', dst.

        // Create the backlayer record
        $backlayer = BackLayer::create([
            'name' => $validatedData['name'],
            'backlayer_number' => $backlayerNumber,
        ]);

        // Kembalikan respons JSON
        return response()->json([
            'message' => 'Data Penembok berhasil ditambahkan.',
            'backlayer' => $backlayer,
        ], 201);
    }

    
    

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);
        
        $backlayer = BackLayer::findOrFail($id);

        $backlayer->update($validated);
    
        return response()->json([
            'message' => 'Data Perajin berhasil diperbarui.',
            'backlayer' => $backlayer,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(BackLayer $backlayer)
    {
        try {
            $backlayer->delete();
    
            return response()->json([
                'success' => true,
                'message' => 'Penembok berhasil dihapus!',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal menghapus data!',
            ], 500);
        }
    }
    
}
