<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Status extends Model
{
	use HasFactory;

	protected $fillable = [
		'code',
		'description'
	];

	public function users()
	{
		return $this->hasMany(User::class);
	}
}