<?php

use App\Http\Controllers\BatikController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\FishController;
use App\Http\Controllers\MemberController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\QrCodeController;
use App\Http\Controllers\RajaOngkirController;
use App\Http\Controllers\ShippingController;
use App\Http\Controllers\TransactionController;
use Illuminate\Support\Facades\Route;
use App\Http\Middleware\IsAdmin;




// Route::get('/', function () {
//     return Inertia::render('Auth/Login');
// });



// Route::get('/city', [RajaOngkirController::class, 'city']);
// Route::post('/shipping-cost', [ShippingController::class, 'checkShippingCost']);


// Route::prefix('fish')->name('fish.')->group(function () {
//     Route::get('/', [FishController::class, 'index'])->name('index');
//     Route::post('/', [FishController::class, 'store'])->name('store');  
//     Route::post('{fish}', [FishController::class, 'update'])->name('update');
//     Route::delete('{fish}', [FishController::class, 'destroy'])->name('destroy');
// });


// Snap Payment 
// Route::post('/create-snap-token', [PaymentController::class, 'createTransaction']);




// New Batik 
Route::prefix('batik')->name('batik.')->group(function () {
    Route::get('/', [BatikController::class, 'index'])->name('index');
    Route::post('/', [BatikController::class, 'store'])->name('store');
    Route::post('{batik}', [BatikController::class, 'update'])->name('update');
    Route::post('/delete/{batik}', [BatikController::class, 'destroy'])->name('batik.destroy');
    Route::get('/{id}/download-qr', [BatikController::class, 'downloadQrCode'])->name('batik.downloadQr');

    // Show Qr Scann 
    Route::get('/{code}', [BatikController::class, 'detail'])->name('batik.detail');

});


// Member Data 
Route::prefix('member')->name('member.')->group(function () {
    Route::get('/', [MemberController::class, 'index'])->name('index');
    Route::post('/', [MemberController::class, 'store'])->name('store');
    Route::post('/delete/{member}', [MemberController::class, 'destroy'])->name('member.destroy');
    Route::post('{member}', [MemberController::class, 'update'])->name('update');

});


// Transaction
// Route::prefix('transaction')->name('transaction.')->group(function () {
//     Route::get('/', [TransactionController::class, 'index'])->name('index');
//     Route::post('/', [TransactionController::class, 'store'])->name('store');
//     Route::post('{transaction}', [TransactionController ::class, 'update'])->name('update');
//     Route::delete('/{transaction}', [TransactionController::class, 'destroy'])->name('transaction.destroy');

// });


// Scan for detail batik 
Route::get('/scan-batik/{code_batik}', [QrCodeController::class, 'show']);

// Route::get('/', function () {
//     return Inertia::render('Dashboard');
// })->middleware(['auth', 'verified'])->name('dashboard');



Route::get('/', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

    
// User Route
Route::middleware(['auth'])->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

});

// Admin Route
Route::middleware(['auth', IsAdmin::class])->group(function () {    


});

// Route::fallback(function () {
//     return('Not found');
// });



require __DIR__.'/auth.php';

