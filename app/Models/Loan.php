<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Loan extends Model
{
	use HasFactory;

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