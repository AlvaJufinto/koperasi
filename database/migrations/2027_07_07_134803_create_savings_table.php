<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
	/**
	 * Run the migrations.
	 */
	public function up(): void
	{
		Schema::create('savings', function (Blueprint $table) {
			$table->id();

			$table->foreignId('user_id')->constrained()->onDelete('restrict');
			$table->foreignId('saving_type_id')->constrained(
				'transaction_types',
				'id'
			)->onDelete('restrict');

			$table->bigInteger('amount');
			$table->date('date');
			$table->string('note')->nullable();

			$table->timestamps();
		});
	}

	/**
	 * Reverse the migrations.
	 */
	public function down(): void
	{
		Schema::dropIfExists('savings');
	}
};
