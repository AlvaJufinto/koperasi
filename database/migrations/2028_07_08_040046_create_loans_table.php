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
		Schema::create('loans', function (Blueprint $table) {
			$table->id();

			$table->foreignId('user_id')->constrained();

			// jumlah pinjaman yg harus dikembalikan
			$table->bigInteger('principal');
			// admin fee verdasarkan persen-an
			$table->decimal('admin_fee')->default(1.00);
			// admin fee yang real
			$table->bigInteger('admin_fee_amount');
			// jumlah yang yg benar2 dicairkan
			$table->bigInteger('disbursed_amount');
			// persen-an bunga perbulan
			$table->decimal('interest')->default(1.00);
			// lama angsuran dalam bulan
			$table->integer('tenor_months');
			// jumlah yang harus dibayar perbulannya;
			$table->bigInteger('installment_amount');

			// Sisa pinjaman yang belum dibayar
			$table->bigInteger('remaining_amount');

			// tgl persetujuan dan pencairan
			$table->date('approved_date');
			// alasan penolakan, catatan, dll
			$table->text('notes')->nullable();

			$table->timestamps();
		});
	}

	/**
	 * Reverse the migrations.
	 */
	public function down(): void
	{
		Schema::dropIfExists('loans');
	}
};
