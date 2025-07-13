<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TransactionController extends Controller
{
	/**
	 * Display a listing of the resource.
	 */
	public function index(Request $request)
	{
		$month = $request->input('month', now()->format('Y-m'));

		$users = User::with(['transactions' => function ($q) use ($month) {
			$q->whereYear('date', substr($month, 0, 4))
				->whereMonth('date', substr($month, 5, 2))
				->with('transactionType');
		}])->get();

		$data = $users->map(function ($user) {
			$grouped = $user->transactions->groupBy('transactionType.code');
			return [
				'id' => $user->id,
				'code' => $user->code,
				'name' => $user->name,
				'angsuran' => $grouped['ANGSURAN']->sum('amount') ?? 0,
				'bunga' => $grouped['BUNGA']->sum('amount') ?? 0,
				'sw' => $grouped['SW']->sum('amount') ?? 0,
				'ss' => $grouped['SS']->sum('amount') ?? 0,
				'tarik_ss' => $grouped['TARIK_SS']->sum('amount') ?? 0,
				'pinjaman' => $grouped['PINJAMAN']->sum('amount') ?? 0,
			];
		});

		return Inertia::render('Transaction/Index', [
			'records' => $data,
			'month' => $month,
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
		//
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