<?php

namespace App\Http\Controllers;

use App\Models\Batik;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class TransactionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();
        $transactions = Transaction::with('batik')->get();
        $batiks = Batik::all(); 

        // print_r($batiks);die(); 
        return Inertia::render('Transaction/Index', [
            'title' => 'Data Transaksi',
            'user' => $user,
            'transactions' => $transactions,
            'batiks' => $batiks,
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
        $validatedData = $request->validate([
            'batik_id' => 'required|numeric',
            'quantity' => 'required|numeric|max:255',
            'total_price' => 'required|numeric',
            'transaction_date' => 'required',
            'notes' => 'nullable|string',
        ]);
    
        // Ambil data batik berdasarkan batik_id
        $batik = Batik::find($validatedData['batik_id']);
    
        // Periksa apakah stok cukup
        if (!$batik) {
            return response()->json([
                'message' => 'Batik tidak ditemukan.',
            ], 404);
        }
    
        if ($batik->stock < $validatedData['quantity']) {
            return response()->json([
                'message' => 'Stok tidak cukup.',
            ], 400);
        }
    
        // Kurangi stok
        $batik->stock -= $validatedData['quantity'];
        $batik->save();
    
        // Simpan transaksi
        $transaction = Transaction::create($validatedData);
    
        return response()->json([
            'message' => 'Data Transaction berhasil ditambahkan.',
            'transaction' => $transaction,
        ]);   
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
                'batik_id' => 'required|max:255',
                'quantity' => 'required|numeric|max:255',
                'total_price' => 'required|numeric',
                'transaction_date' => 'required',
                'notes' => 'nullable|string',
            ]);
        
            // Temukan transaksi lama
            $transaction = Transaction::findOrFail($id);
            $oldQuantity = $transaction->quantity; 
            $batik = Batik::find($validated['batik_id']);
        
            if (!$batik) {
                return response()->json([
                    'message' => 'Batik tidak ditemukan.',
                ], 404);
            }
        
            // Hitung selisih perubahan jumlah
            $quantityDifference = $validated['quantity'] - $oldQuantity;
        
            // Periksa stok yang tersedia sebelum mengurangi stok
            if ($quantityDifference > 0 && $batik->stock < $quantityDifference) {
                return response()->json([
                    'message' => 'Stok tidak cukup untuk melakukan perubahan.',
                ], 400);
            }
        
            // Perbarui stok dengan selisih yang dihitung
            $batik->stock -= $quantityDifference;
            $batik->save();
        
            // Perbarui transaksi
            $transaction->update($validated);
        
            return response()->json([
                'message' => 'Data Transaction berhasil diperbarui.',
                'transaction' => $transaction,
            ]);
        }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Transaction $transaction)
    {
        // Cari batik terkait dengan transaksi yang akan dihapus
        $batik = Batik::find($transaction->batik_id);
    
        if ($batik) {
            // Tambahkan jumlah transaksi ke stok batik sebelum menghapus
            $batik->stock += $transaction->quantity;
            $batik->save();
        }
    
        // Hapus transaksi
        $transaction->delete();
    
        return response()->json([
            'success' => true,
            'message' => 'Transaction berhasil dihapus dan stok telah dikembalikan!',
        ]);
    }
    
}
