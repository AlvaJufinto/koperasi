<?php

namespace App\Http\Controllers;

use App\Models\Loan;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class LoanController extends Controller
{
	/**
	 * Display a listing of the resource.
	 */
	public function index()
	{
		$loans = Loan::with('user')->latest()->get();

		return Inertia::render('Loan/Index', [
			'loans' => $loans,
		]);
	}

	public function create()
	{
		$users = User::select('id', 'code', 'name')->get();

		return Inertia::render('Loan/Create', [
			'users' => $users,
		]);
	}

	public function store(Request $request)
	{
		$data = $request->validate([
			'user_id' => 'required|exists:users,id',
			'principal' => 'required|integer|min:100000',
			'admin_fee' => 'required|numeric|min:0',
			'interest' => 'required|numeric|min:0',
			'tenor_months' => 'required|integer|min:1',
			'approved_date' => 'required|date',
			'notes' => 'nullable|string',
		]);

		$admin_fee_amount = (int) floor($data['principal'] * ($data['admin_fee'] / 100));
		$disbursed_amount = $data['principal'] - $admin_fee_amount;
		$installment_amount = (int) ceil($data['principal'] * (1 + ($data['interest'] / 100 * $data['tenor_months'])) / $data['tenor_months']);

		$loan = Loan::create([
			'user_id' => $data['user_id'],
			'principal' => $data['principal'],
			'admin_fee' => $data['admin_fee'],
			'admin_fee_amount' => $admin_fee_amount,
			'disbursed_amount' => $disbursed_amount,
			'interest' => $data['interest'],
			'tenor_months' => $data['tenor_months'],
			'installment_amount' => $installment_amount,
			'remaining_amount' => $data['principal'],
			'approved_date' => $data['approved_date'],
			'notes' => $data['notes'] ?? null,
		]);

		return redirect()->route('loan.index')->with('success', 'Pinjaman berhasil dibuat.');
	}

	public function show(Loan $loan)
	{
		$loan->load('user');

		return Inertia::render('Loan/Show', [
			'loan' => $loan,
		]);
	}

	public function payCreate(Loan $loan)
	{
		return Inertia::render('Loan/PaymentCreate', ['loan' => $loan->load('user')]);
	}

	public function payStore(Request $request, Loan $loan)
	{
		$data = $request->validate([
			'date' => 'required|date',
			'amount' => 'required|integer|min:1000',
			'note' => 'nullable|string',
		]);

		DB::transaction(function () use ($loan, $data) {
			$loan->remaining_amount -= $data['amount'];
			if ($loan->remaining_amount < 0) {
				$loan->remaining_amount = 0;
			}
			$loan->save();

			$loan->payments()->create([
				'date' => $data['date'],
				'amount' => $data['amount'],
				'note' => $data['note'],
			]);
		});

		return redirect()->route('loan.index')->with('success', 'Pembayaran berhasil.');
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
