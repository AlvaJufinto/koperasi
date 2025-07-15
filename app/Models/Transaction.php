<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
	use HasFactory;

	protected $fillable = [
		'user_id',
		'transaction_type_id',
		'date',
		'amount',
		'note',
	];

	public function user()
	{
		return $this->belongsTo(User::class);
	}

	public function transactionType()
	{
		return $this->belongsTo(TransactionType::class);
	}

	public function scopeInMonth($query, $month)
	{
		return $query->whereYear('date', substr($month, 0, 4))
			->whereMonth('date', substr($month, 5, 2));
	}

	public function scopeByUser($query, $userId)
	{
		return $query->where('user_id', $userId);
	}
}
