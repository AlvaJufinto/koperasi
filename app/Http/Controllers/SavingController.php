<?php

namespace App\Http\Controllers;

use App\Models\Saving;
use App\Models\Transaction;
use App\Models\TransactionType;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class SavingController extends Controller
{
	/**
	 * Display a listing of the resource.
	 */
	public function index(Request $request)
	{
		$month = $request->input('month', now()->format('Y-m'));
		$period = Carbon::createFromFormat('Y-m', $month);

		$users = User::with(['savings'])->get();

		$records = $users->map(function ($user) use ($period) {
			$sp = $user->savings
				->where('saving_type_id', TransactionType::SP)
				->where('date', '<=', $period->endOfMonth())
				->sum('amount');

			$sw = $user->savings
				->where('saving_type_id', TransactionType::SW)
				->where('date', '<=', $period->endOfMonth())
				->sum('amount');

			$ss =
				(int)($user->savings
					->where('saving_type_id', TransactionType::SS)
					->where('date', '<=', $period->endOfMonth())
					->sum('amount'))
				-
				(int)
				($user->savings
					->where('saving_type_id', TransactionType::TARIK_SS)
					->where('date', '<=', $period->endOfMonth())
					->sum('amount'));

			$tarik_ss = $user->savings
				->where('saving_type_id', TransactionType::TARIK_SS)
				->whereBetween('date', [
					$period->startOfMonth()->format('Y-m-d'),
					$period->endOfMonth()->format('Y-m-d'),
				])
				->sum('amount');

			$total = $sp + $sw + $ss; // Tidak dikurangi tarik_ss karena hanya menunjukkan tabungan masuk

			return [
				'id' => $user->id,
				'code' => $user->code,
				'name' => $user->name,
				'sp' => $sp,
				'sw' => $sw,
				'ss' => $ss,
				'tarik_ss' => $tarik_ss,
				'total' => $total,
			];
		});

		//dd($records->toArray());

		return Inertia::render('Saving/Index', [
			'records' => $records,
			'month' => $month,
		]);
	}



	/**
	 * Show the form for creating a new resource.
	 */
	public function create()
	{
		$users = User::get();
		$savingTypes = DB::table('transaction_types')
			->whereIn('code', ['SP', 'SW', 'SS', 'TARIK_SS'])
			->get();
		$balances = Saving::selectRaw('user_id, SUM(CASE 
    WHEN transaction_types.code = "SS" THEN amount
    WHEN transaction_types.code = "TARIK_SS" THEN -amount
    ELSE 0 END) as ss')
			->join('transaction_types', 'savings.saving_type_id', '=', 'transaction_types.id')
			->groupBy('user_id')
			->get();


		return Inertia::render('Saving/Create', [
			'users' => $users,
			'balances' => $balances,
			'savingTypes' => $savingTypes,
		]);
	}

	/**
	 * Store a newly created resource in storage.
	 */
	public function store(Request $request)
	{
		$validated = $request->validate([
			'user_id' => 'required|exists:users,id',
			'saving_type_id' => 'required|exists:transaction_types,id',
			'date' => 'required|date_format:Y-m-d',
			'amount' => 'required|integer|min:1',
			'note' => 'nullable|string',
		]);

		// Ambil data saving type
		$savingType = TransactionType::findOrFail($validated['saving_type_id']);

		// Validasi saldo SS kalau TARIK_SS
		if ($savingType->code === 'TARIK_SS') {
			$ssBalance = Saving::where('user_id', $validated['user_id'])
				->whereHas('savingType', fn($q) => $q->where('code', 'SS'))
				->sum('amount');

			$tarikSs = Saving::where('user_id', $validated['user_id'])
				->whereHas('savingType', fn($q) => $q->where('code', 'TARIK_SS'))
				->sum('amount');

			$availableSs = $ssBalance - $tarikSs;

			if ($validated['amount'] > $availableSs) {
				return back()->withErrors(['amount' => 'Jumlah penarikan melebihi saldo SS (tersisa ' . number_format($availableSs) . ')'])->withInput();
			}
		}

		Saving::create([
			'user_id' => $validated['user_id'],
			'saving_type_id' => $validated['saving_type_id'],
			'date' => $validated['date'],
			'amount' => $validated['amount'],
			'note' => $validated['note'],
		]);

		return to_route('saving.index')->with('success', 'Data simpanan berhasil ditambahkan.');
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
