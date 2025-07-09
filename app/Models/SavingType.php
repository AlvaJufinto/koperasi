<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SavingType extends Model
{
	use HasFactory;

	protected $fillable = [
		'level',
		'code',
		'description'
	];

	public function savings()
	{
		return $this->hasMany(Saving::class);
	}
}