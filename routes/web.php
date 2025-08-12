<?php

use App\Http\Controllers\PartyMasterController;
use App\Http\Controllers\StockController;
use App\Http\Controllers\DiamondController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\DiamondImportController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

Route::resource('orders', OrderController::class);

Route::get('/diamonds/import', fn() => Inertia::render('Diamonds/Import'))
    ->name('diamonds.import.form');

Route::post('/diamonds/import', [DiamondImportController::class, 'import'])
    ->name('diamonds.import');

Route::get('/diamonds', [DiamondImportController::class, 'index'])
    ->name('diamonds.index');

Route::get('/diamonds/{stock_id}', [DiamondController::class, 'show'])->name('diamonds.show');


Route::get('/stocks', [StockController::class, 'index'])->name('stocks.index');

// Route::get('/parties', [PartyMasterController::class, 'index'])->name('parties.index');
// Route::post('/parties', [PartyMasterController::class, 'store'])->name('parties.store');

Route::resource('parties', PartyMasterController::class);

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
