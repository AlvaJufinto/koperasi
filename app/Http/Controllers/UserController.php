<?php

namespace App\Http\Controllers;

use App\Models\Role;
use App\Models\Saving;
use App\Models\Status;
use App\Models\Transaction;
use App\Models\TransactionType;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
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
		}])
			->paginate(50)
			->through(function ($user) {
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
		return Inertia::render('User/Create', [
			'statuses' => Status::all(['id', 'code']),
			'roles' => Role::all(['id', 'code']),
		]);
	}
	/**
	 * Store a newly created resource in storage.
	 */
	public function store(Request $request)
	{
		$validated = $request->validate([
			'code' => ['required', 'string', 'max:50', 'unique:users,code'],
			'phone' => ['required', 'string', 'max:20', 'unique:users,phone'],
			'name' => ['required', 'string', 'max:100'],
			'email' => ['nullable', 'email', 'max:100', 'unique:users,email'],
			'address' => ['nullable', 'string'],
			'join_date' => ['required', 'date'],
			'status_id' => ['required', 'exists:statuses,id'],
			'role_id' => ['required', 'exists:roles,id'],
			'password' => ['required', 'string', 'min:6'],
		]);

		$user = User::create([
			...Arr::except($validated, ['password']),
			'password' => Hash::make($validated['password']),
		]);

		// insert SP (Simpanan Pokok) awal di sini
		Saving::create([
			'user_id' => $user->id,
			'saving_type_id' => TransactionType::SP,
			'amount' => config('koperasi.simpanan_pokok.amount'),
			'date' => now(),
		]);

		Transaction::create([
			'user_id' => $user->id,
			'transaction_type_id' => TransactionType::SP,
			'date' => now(),
			'amount' => config('koperasi.simpanan_pokok.amount'),
			'note' => 'Simpanan Pokok Awal',
		]);

		return to_route('user.index')->with('success', 'Anggota berhasil ditambahkan.');
	}

	public function show(User $user)
	{
		$start = Carbon::parse(config('koperasi.periode.start_date'));
		$end = Carbon::parse(config('koperasi.periode.end_date'));

		$allMonths = collect();
		$date = $start->copy();
		while ($date <= $end) {
			$allMonths->push($date->format('M Y'));
			$date->addMonth();
		}

		$rawRecords = Saving::query()
			->selectRaw("DATE_FORMAT(date, '%b %Y') as month")
			->selectRaw("SUM(CASE WHEN saving_type_id = 1 THEN amount ELSE 0 END) as sp")
			->selectRaw("SUM(CASE WHEN saving_type_id = 2 THEN amount ELSE 0 END) as sw")
			->selectRaw("SUM(CASE WHEN saving_type_id = 3 THEN amount ELSE 0 END) as ss")
			->selectRaw("SUM(CASE WHEN saving_type_id = 4 THEN amount ELSE 0 END) as tarik_ss")
			->where('user_id', $user->id)
			->whereBetween('date', [$start, $end])
			->groupBy('month')
			->get()
			->keyBy('month');

		$monthlyRecords = $allMonths->map(function ($month) use ($rawRecords) {
			$data = $rawRecords->get($month);

			return [
				'month' => $month,
				'sp' => (int) optional($data)->sp ?? 0,
				'sw' => (int) optional($data)->sw ?? 0,
				'ss' => (int) optional($data)->ss ?? 0,
				'angsuran' => 0,
				'bunga' => 0,
				'tarik_ss' => (int) optional($data)->tarik_ss ?? 0,
				'total' => (
					(int) optional($data)->sp +
					(int) optional($data)->sw +
					(int) optional($data)->ss
				) ?? 0,
			];
		});

		$totalPinjaman = $user
			->loans()
			->where('remaining_amount', '>', 0)
			->sum('remaining_amount');

		return Inertia::render('User/Show', [
			'user' => $user,
			'monthlyRecords' => $monthlyRecords,
			'summary' => [
				'total_sw' => Saving::where('user_id', $user->id)
					->where('saving_type_id', 2)
					->whereBetween('date', [$start, $end])
					->sum('amount'),

				'total_ss' => Saving::where('user_id', $user->id)
					->where('saving_type_id', 3)
					->whereBetween('date', [$start, $end])
					->sum('amount'),

				'total_pinjaman' => $totalPinjaman,
			],
		]);
	}


	/**
	 * Show the form for editing the specified resource.
	 */
	public function edit(User $user)
	{
		return Inertia::render('User/Edit', [
			'user' => $user,
			'statuses' => Status::all(['id', 'code']),
			'roles' => Role::where('id', '!=', 1)->get(['id', 'code']),
		]);
	}

	/**
	 * Update the specified resource in storage.
	 */
	public function update(Request $request, User $user)
	{
		$validated = $request->validate([
			'code' => ['required', 'string', 'max:50', Rule::unique('users', 'code')->ignore($user->id)],
			'phone' => ['required', 'string', 'max:20', Rule::unique('users', 'phone')->ignore($user->id)],
			'name' => ['required', 'string', 'max:100'],
			'email' => ['nullable', 'email', 'max:100', Rule::unique('users', 'email')->ignore($user->id)],
			'address' => ['nullable', 'string'],
			'join_date' => ['required', 'date'],
			'status_id' => ['required', 'exists:statuses,id'],
			'role_id' => ['required', 'exists:roles,id'],
			'password' => ['nullable', 'string', 'min:6'],
		]);

		$user->update([
			...$validated,
			'password' => $validated['password'] ? Hash::make($validated['password']) : $user->password,
		]);

		return to_route('user.index')->with('success', 'Data anggota diperbarui.');
	}


	/**
	 * Remove the specified resource from storage.
	 */
	public function destroy(string $id)
	{
		//
	}
}