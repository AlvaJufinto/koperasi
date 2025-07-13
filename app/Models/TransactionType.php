<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TransactionType extends Model
{
	use HasFactory;

	protected $fillable = [
		'code',
		'description',
		'is_saving_type',
	];

	public const SP = 1;
	public const SW = 2;
	public const SS = 3;
	public const TARIK_SS = 4;
}