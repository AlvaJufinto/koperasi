<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LoanStatus extends Model
{
	use HasFactory;

	protected $filable = [
		'code',
		'description'
	];

	public function loans()
	{
		return $this->hasMany(Loan::class);
	}
}