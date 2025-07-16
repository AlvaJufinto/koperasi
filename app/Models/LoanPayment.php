<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LoanPayment extends Model
{
	use HasFactory;

	protected $fillable = [
		'loan_id',
		'user_id',
		'amount',
		'date',
		'is_full_settlement',
		'note',
	];

	public function loan()
	{
		return $this->belongsTo(Loan::class);
	}
}
