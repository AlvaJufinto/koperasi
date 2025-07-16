<?php

namespace App\Http\Controllers;

use App\Models\Loan;
use App\Models\LoanPayment;
use App\Models\LoanStatus;
use App\Models\User;
use Carbon\Carbon;
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
			'note' => 'nullable|string',
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
			'note' => $data['note'] ?? null,
			'loan_status_id' => LoanStatus::ACTIVE, // Assuming 1 is the ID for 'active' status
		]);

		return redirect()->route('loan.index')->with('success', 'Pinjaman berhasil dibuat.');
	}

	public function show(Loan $loan)
	{
		$loan->load(['user', 'loanPayments']);

		$start = Carbon::parse(config('koperasi.periode.start_date'))->startOfMonth();
		$end = Carbon::parse(config('koperasi.periode.end_date'))->endOfMonth();

		// Total pembayaran di periode
		$paymentsInPeriod = $loan->loanPayments()
			->whereBetween('date', [$start, $end])
			->get();

		$totalPaidInPeriod = $paymentsInPeriod->sum('amount');
		$totalPaid = $loan->loanPayments->sum('amount');
		$installmentNumber = $loan->loanPayments->count() + 1;
		$monthlyInterest = round($loan->principal * ($loan->interest / 100));
		$totalInterestPaid = $monthlyInterest * $loan->loanPayments->count();
		$remaining = $loan->remaining_amount;

		// Generate list bulan
		$months = [];
		$current = $start->copy();
		while ($current->lte($end)) {
			$months[] = $current->format('Y-m');
			$current->addMonth();
		}

		$installmentCounter = 0;

		// Summary per bulan
		$monthly_data = collect($months)->map(function ($month) use ($loan, $monthlyInterest, &$installmentCounter) {
			$periodStart = Carbon::createFromFormat('Y-m', $month)->startOfMonth();
			$periodEnd = Carbon::createFromFormat('Y-m', $month)->endOfMonth();

			$payments = $loan->loanPayments()
				->whereBetween('date', [$periodStart, $periodEnd])
				->get();

			$interest_payment = $payments->count() > 0 ? $monthlyInterest : 0;

			$total_payment = $payments->sum('amount') + $interest_payment;
			$principal_payment = $total_payment - $interest_payment;

			// Increment installment counter jika ada pembayaran
			if ($payments->count() > 0) {
				$installmentCounter++;
			}

			$installment_count = $payments->count() > 0 ? $installmentCounter : 0;

			return [
				'month' => $periodStart->translatedFormat('M Y'),
				'installment_count' => $installment_count,
				'total_payment' => $total_payment,
				'interest_payment' => $interest_payment,
				'principal_payment' => $principal_payment,
			];
		});

		return Inertia::render('Loan/Show', [
			'loan' => $loan,
			'summary' => [
				'total_paid_in_period' => $totalPaidInPeriod,
				'total_paid' => $totalPaid,
				'installment_number' => $installmentNumber,
				'total_interest_paid' => $totalInterestPaid,
				'remaining_amount' => $remaining,
			],
			'monthly_data' => $monthly_data,
		]);
	}


	public function payCreate(Loan $loan)
	{;

		$installment_number = $loan->loanPayments()->count() + 1;

		//dd($installment_number);

		return Inertia::render('Loan/PaymentCreate', [
			'loan' => $loan->load('user'),
			'installment_number' => $installment_number
		]);
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

			if ($loan->remaining_amount <= 0) {
				$loan->remaining_amount = 0;
				$loan->loan_status_id = LoanStatus::PAID_OFF;
			} else {
				$loan->loan_status_id = LoanStatus::ACTIVE;
			}

			$loan->save();

			$loan->loanPayments()->create([
				'loan_id' => $loan->id,
				'user_id' => auth()->id(),
				'amount' => $data['amount'],
				'date' => $data['date'],
				'is_full_settlement' => $loan->remaining_amount <= 0,
				'note' => $data['note'] ?? null
			]);
		});

		LoanPayment::insert([]);

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
