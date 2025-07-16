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

	public const PENDING = 1;
	public const APPROVED = 2;
	public const ACTIVE = 3;
	public const PAID_OFF = 3;
	public const REJECTED = 4;

	public function loans()
	{
		return $this->hasMany(Loan::class);
	}
}
