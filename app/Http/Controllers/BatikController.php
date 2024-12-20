<?php

namespace App\Http\Controllers;

use App\Models\Batik;
use App\Models\BatikDescription;
use App\Models\Member;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use SimpleSoftwareIO\QrCode\Facades\QrCode;
use Illuminate\Support\Facades\Response;


class BatikController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();
        $batikData = Batik::with('member')->get();
        $members = Member::all(); 
        $batikDescription = BatikDescription::all();

        // print_r($batikDescription);die(); 
    
        return Inertia::render('Batik/Index', [
            'title' => 'Daftar Produk Batik',
            'user' => $user,
            'batikData' => $batikData,
            'members' => $members,
            'batikDescription' => $batikDescription,
        ]);
    }
    
    

    /**
     * Show the form for creating a new resource.
     */
    public function create() {
        $user = Auth::user();

        return Inertia::render('Batik/Create', [
            'title' => 'Tambah Produk Batik',
            'user' => $user
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */

        public function show($code_batik)
        {
            $batik = Batik::where('code_batik', $code_batik)->firstOrFail();
        
            return Inertia::render('Batik/QrCode', [
                'batik' => $batik,
            ]);
        }

        public function store(Request $request)
        {

            $request->merge([
                'price' => str_replace('.', '', $request->input('price'))
            ]);

            // dd($request->all());
            $validatedData = $request->validate([
                'code_batik' => 'required|unique:batiks|max:255',
                'name' => 'required|string|max:255',
                'quality' => 'required|string|max:255',
                // 'price' => 'required|numeric',
                'description' => 'nullable|string',
                'image' => 'nullable|image',
                'member_id' => 'nullable|exists:members,id',
                'motif_creator' => 'nullable|string|max:255',
                'bricklayer_name' => 'nullable|string|max:255',
                'production_year' => 'nullable|integer',
                'materials' => 'nullable|string|max:255',
                'color_materials' => 'nullable|string|max:255',
            ]);
        
         // Generate QR Code in SVG format
            $url = url("/scan-batik/{$validatedData['code_batik']}");
            $qrCodeSvg = QrCode::format('svg')->size(200)->generate($url);
        
            // Base64 encode the SVG QR code
            $qrCodeBase64 = base64_encode($qrCodeSvg);
        
            $validatedData['qr_code'] = $qrCodeBase64;
        
            // Upload image if present
            if ($request->hasFile('image')) {
                $validatedData['image'] = $request->file('image')->store('images', 'public');
            }
        
            // Save the batik data to the database
            $batik = Batik::create($validatedData);
            return response()->json([
                'message' => 'Data batik berhasil ditambahkan
                .',
                'batik' => $batik,
            ]);
        
        }

        

    /**
     * Update the specified resource in storage.
     */ 


        public function update(Request $request, $id)
        {
            $request->merge([
                'price' => str_replace('.', '', $request->input('price'))
            ]);
        
            // Validasi data
            $validated = $request->validate([
                'code_batik' => 'required|string|unique:batiks,code_batik,' . $id,
                'name' => 'required|string|max:255',
                'quality' => 'required|string|max:255',
                // 'price' => 'required|numeric|min:0',
                'description' => 'nullable|string|max:1000',
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
                'member_id' => 'nullable|exists:members,id',
                'motif_creator' => 'nullable|string|max:255',
                'bricklayer_name' => 'nullable|string|max:255',
                'production_year' => 'nullable|integer',
                'materials' => 'nullable|string|max:255',
                'color_materials' => 'nullable|string|max:255',
            ]);
        
            // Ambil data batik yang ingin diupdate
            $batik = Batik::findOrFail($id);
        
            // Update gambar jika ada file baru
            if ($request->hasFile('image')) {
                if ($batik->image && Storage::disk('public')->exists($batik->image)) {
                    Storage::disk('public')->delete($batik->image);
                }
                $validated['image'] = $request->file('image')->store('images', 'public');
            } else {
                $validated['image'] = $batik->image;
            }
        
            // Perbarui QR Code jika `code_batik` diubah
            if ($validated['code_batik'] !== $batik->code_batik) {
                $url = url("/scan-batik/{$validated['code_batik']}");
                $qrCodeSvg = QrCode::format('svg')->size(200)->generate($url);
                $qrCodeBase64 = base64_encode($qrCodeSvg);
                $validated['qr_code'] = $qrCodeBase64;
            } else {
                // Tetap gunakan QR Code lama jika `code_batik` tidak berubah
                $validated['qr_code'] = $batik->qr_code;
            }
        
            // Lakukan update pada database
            $batik->update($validated);
        
            return response()->json([
                'message' => 'Data batik berhasil diperbarui.',
                'batik' => $batik,
            ]);
        }
        



    // Qr Code Scan 
    public function detail($code)
    {
        $batik = Batik::where('code_batik', $code)->firstOrFail();
        return Inertia::render('Batik/QrCode', ['batik' => $batik]);
    }

    

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Batik $batik) {
        if ($batik->image) {
            Storage::disk('public')->delete($batik->image);
        }
            $batik->delete();
    
        return response()->json([
            'success' => true,
            'message' => 'Batik berhasil dihapus!',
        ]);
    }
    
    

    public function downloadQrCode($id)
    {
        $batik = Batik::findOrFail($id);
    
        if (!$batik->qr_code) {
            abort(404, 'QR Code tidak ditemukan');
        }
    
        // Generate QR Code sebagai file PNG
        $qrCodeContent = $batik->code_batik;
        $qrCode = QrCode::format('png')->size(200)->generate($qrCodeContent);
    
        // Set header untuk file unduhan
        $headers = [
            'Content-Type' => 'image/png',
            'Content-Disposition' => 'attachment; filename="qr-code-' . $batik->code_batik . '.png"',
        ];
    
        return Response::make($qrCode, 200, $headers);
    }
    

    
    
}
