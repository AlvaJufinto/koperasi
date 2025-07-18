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
		Schema::create('transactions', function (Blueprint $table) {
			$table->id();

			$table->foreignId('user_id')->constrained()->onDelete('cascade');

			$table->foreignId('transaction_type_id')->constrained()->onDelete('restrict');

			$table->date('date');
			$table->bigInteger('amount');

			$table->string('note')->nullable();

			$table->timestamps();
		});
	}

	/**
	 * Reverse the migrations.
	 */
	public function down(): void
	{
		Schema::dropIfExists('transactions');
	}
};
