<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Saving extends Model
{
	use HasFactory;

	protected $fillable = [
		'user_id',
		'saving_type_id',
		'amount',
		'date',
		'notes',
	];

	public function user()
	{
		return $this->belongsTo(User::class);
	}

	public function savingType()
	{
		return $this->belongsTo(SavingType::class);
	}
}
