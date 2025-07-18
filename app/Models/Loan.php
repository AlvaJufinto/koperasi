<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Loan extends Model
{
	use HasFactory;

	protected $fillable = [
		'user_id',
		'principal',
		'admin_fee',
		'admin_fee_amount',
		'disbursed_amount',
		'interest',
		'tenor_months',
		'installment_amount',
		'remaining_amount',
		'approved_date',
		'loan_status_id',
		'note',
	];

	public function user()
	{
		return $this->belongsTo(User::class);
	}

	public function loanStatus()
	{
		return $this->belongsTo(LoanStatus::class);
	}

	public function loanPayments()
	{
		return $this->hasMany(LoanPayment::class);
	}
}
