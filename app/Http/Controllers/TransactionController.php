<?php

namespace App\Http\Controllers;

use App\Models\Loan;
use App\Models\Transaction;
use App\Models\TransactionType;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TransactionController extends Controller
{
	/**
	 * Display a listing of the resource.
	 */
	// TransactionController.php
	public function index(Request $request)
	{
		$month = $request->input('month') ?? now()->format('Y-m');

		$users = User::with('status')->get();

		$transactions = Transaction::whereMonth('date', substr($month, 5, 2))
			->whereYear('date', substr($month, 0, 4))
			->get()
			->groupBy('user_id');

		$transactionTypes = TransactionType::pluck('code', 'id');

		$data = $users->map(function ($user) use ($transactions, $transactionTypes) {
			$userTx = $transactions->get($user->id, collect());
			$sum = fn($code) => $userTx->filter(fn($t) => $transactionTypes[$t->transaction_type_id] === $code)->sum('amount');

			return [
				'id' => $user->id,
				'code' => $user->code,
				'name' => $user->name,
				'status' => $user->status->code,
				'angsuran' => $sum('ANGSURAN'),
				'bunga' => $sum('BUNGA'),
				'sw' => $sum('SW'),
				'ss' => $sum('SS'),
				'tarik_ss' => $sum('TARIK_SS'),
				'total' => $sum('ANGSURAN') + $sum('BUNGA') + $sum('SW') + $sum('SS'),
			];
		});

		$start = \Carbon\Carbon::parse(config('koperasi.periode.start_date'))->startOfMonth();
		$end = \Carbon\Carbon::parse(config('koperasi.periode.end_date'))->endOfMonth();

		$months = [];
		while ($start->lte($end)) {
			$months[] = [
				'value' => $start->format('Y-m'),
				'label' => $start->translatedFormat('F Y'),
			];
			$start->addMonth();
		}

		return Inertia::render('Transaction/Index', [
			'month' => $month,
			'records' => $data,
			'months' => $months,
		]);
	}


	/**
	 * Show the form for creating a new resource.
	 */
	public function create()
	{
		$users = User::get();
		$loans = Loan::get();
		$transactionTypes = TransactionType::get();

		return Inertia::render('Transaction/Create', [
			'users' => $users,
			'transactionTypes' => $transactionTypes,
			'loans' => $loans,
		]);
	}


	/**
	 * Store a newly created resource in storage.
	 */
	public function store(Request $request)
	{
		$validated = $request->validate([
			'user_id' => ['required', 'exists:users,id'],
			'transaction_type_id' => ['required', 'exists:transaction_types,id'],
			'date' => ['required', 'date'],
			'amount' => ['required', 'numeric', 'min:1'],
			'note' => ['nullable', 'string'],
		]);

		Transaction::create($validated);

		return to_route('transaction.index')->with('success', 'Transaksi berhasil ditambahkan.');
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
	public function update(Request $request, string $id)
	{
		//
	}

	/**
	 * Remove the specified resource from storage.
	 */
	public function destroy(string $id)
	{
		//
	}
}
