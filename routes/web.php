<?php

use App\Http\Controllers\LoanController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SavingController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\UserController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/


Route::middleware('auth')->group(function () {
	Route::get('/', function () {
		return Inertia::render('Dashboard');
	})->name('dashboard');

	Route::resource('user', UserController::class);
	Route::resource('transaction', TransactionController::class);
	Route::resource('saving', SavingController::class);

	Route::resource('loan', LoanController::class);
	Route::get('/loans/{loan}/pay', [LoanController::class, 'payCreate'])->name('loan.payment.create');
	Route::post('/loans/{loan}/pay', [LoanController::class, 'payStore'])->name('loan.payment.store');



	Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
	Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
	Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
