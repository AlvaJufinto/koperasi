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
		Schema::create('users', function (Blueprint $table) {
			$table->id();
			$table->string('code');
			$table->string('phone')->nullable()->unique();

			$table->string('name');
			$table->string('email')->nullable()->unique();
			$table->timestamp('email_verified_at')->nullable();

			$table->string('address')->nullable();
			$table->date('join_date')->nullable();
			$table->foreignId('status_id')->constrained()->onDelete('restrict');
			$table->foreignId('role_id')->constrained()->onDelete('restrict');

			$table->string('password');

			$table->rememberToken();
			$table->timestamps();
		});
	}

	/**
	 * Reverse the migrations.
	 */
	public function down(): void
	{
		Schema::dropIfExists('users');
	}
};
