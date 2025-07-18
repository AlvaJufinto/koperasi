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
		Schema::create('loan_payments', function (Blueprint $table) {
			$table->id();

			$table->foreignId('loan_id')->constrained();
			$table->foreignId('user_id')->constrained();

			$table->bigInteger('amount');
			$table->bigInteger('installment_number')->default(1);

			// Tanggal pembayaran
			$table->date('date');
			// pelunasan dini
			$table->boolean('is_full_settlement');

			// opsional: pelunasan dini, angsuran ke-5
			$table->text('note')->nullable();

			$table->timestamps();
		});
	}

	/**
	 * Reverse the migrations.
	 */
	public function down(): void
	{
		Schema::dropIfExists('loan_payments');
	}
};
