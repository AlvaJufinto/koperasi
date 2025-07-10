<?php

namespace App\Http\Controllers;

use App\Models\Saving;
use App\Models\Status;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class UserController extends Controller
{
	/**
	 * Display a listing of the resource.
	 */
	public function index()
	{
		$users = User::with(['status', 'savings' => function ($q) {
			$q->select('user_id', 'saving_type_id', DB::raw('SUM(amount) as amount'))
				->groupBy('user_id', 'saving_type_id')
				->with('savingType');
		}])->get()->map(function ($user) {
			return [
				'id' => $user->id,
				'code' => $user->code,
				'name' => $user->name,
				'status' => $user->status,
				'join_date' => $user->join_date,
				'savings' => $user->savings->map(fn($s) => [
					'type' => $s->savingType->code, // 'SP', 'SW', 'SS'
					'amount' => $s->amount
				]),
				'total_loan' => $user->loans->sum('principal'),
				'remaining_loan' => $user->loans->sum(fn($l) => $l->remaining_amount),
			];
		});

		return Inertia::render('User/Index', [
			'users' => $users,
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
	public function show(User $user)
	{
		// Ambil data bulanan untuk user ini
		// Hitung total pinjaman yang masih berjalan
		// Hitung total simpanan SP, SW, SS, dan tarik SS

		if (!$user) {
			return redirect()->route('user.index')->with('error', 'User not found');
		}

		$monthlyRecords = Saving::query()
			->selectRaw("DATE_FORMAT(date, '%b %Y') as month")
			->selectRaw("SUM(CASE WHEN saving_type_id = '1' THEN amount ELSE 0 END) as sp")
			->selectRaw("SUM(CASE WHEN saving_type_id = '2' THEN amount ELSE 0 END) as sw")
			->selectRaw("SUM(CASE WHEN saving_type_id = '3' THEN amount ELSE 0 END) as ss")
			->selectRaw("SUM(CASE WHEN saving_type_id = '4' THEN amount ELSE 0 END) as tarik_ss")
			->where('user_id', $user->id)
			->groupBy('month')
			->get();

		$totalPinjaman = $user
			->loans()
			->where('remaining_amount', '>', 0)
			->sum('remaining_amount');

		return Inertia::render('User/Show', [
			'user' => $user,
			'monthlyRecords' => $monthlyRecords->map(fn($r) => [
				'month' => $r->month,
				'sp' => (int) $r->sp,
				'sw' => (int) $r->sw,
				'ss' => (int) $r->ss,
				'angsuran' => 0,
				'bunga' => 0,
				'total' => $r->sp + $r->sw + $r->ss,
				'tarik_ss' => (int) $r->tarik_ss,
			]),
			'summary' => [
				'total_sw' => Saving::where('user_id', $user->id)->where('saving_type_id', 2)
					->sum('amount'),

				'total_ss' => Saving::where('user_id', $user->id)->where('saving_type_id', 3)
					->sum('amount'),
				'total_pinjaman' => $totalPinjaman,
			],
		]);
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
