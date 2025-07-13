<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

use App\Models\LoanStatus;
use App\Models\Role;
use App\Models\SavingType;
use App\Models\Status;
use App\Models\TransactionType;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
	/**
	 * Seed the application's database.
	 */
	public function run(): void
	{
		// \App\Models\User::factory(10)->create();

		Status::insert([
			[
				'code' => 'active',
				'description' => 'anggota aktif'
			],
			[
				'code' => 'inactive',
				'description' => 'anggota yang keluar di tengah-tengah periode'
			],
			[
				'code' => 'quit',
				'description' => 'anggota yang sudah keluar di periode sebelumnya'
			]
		]);

		Role::insert([
			[
				'level' => 1,
				'code' => 'admin',
				'description' => 'highest Authority'
			],
			[
				'level' => 2,
				'code' => 'pengurus',
				'description' => ''
			],
			[
				'level' => 3,
				'code' => 'anggota',
				'description' => ''
			]
		]);

		LoanStatus::insert([
			[
				'code' => 'pending',
				'description' => 'sedang direview'
			],
			[
				'code' => 'approved',
				'description' => 'diterima'
			],
			[
				'code' => 'active',
				'description' => 'sedang diangsur'
			],
			[
				'code' => 'paid_off',
				'description' => 'lunas'
			],
			[
				'code' => 'rejected',
				'description' => 'ditolak'
			],
		]);

		TransactionType::insert([
			[
				'code' => 'SP',
				'description' => 'Simpanan Pokok',
				'is_saving_type' => true
			],
			[
				'code' => 'SW',
				'description' => 'Simpanan Wajib',
				'is_saving_type' => true
			],
			[
				'code' => 'SS',
				'description' => 'Simpanan Sukarela',
				'is_saving_type' => true
			],
			[
				'code' => 'TARIK_SS',
				'description' => 'Tarik Simpanan Sukarela',
				'is_saving_type' => true
			],
			[
				'code' => 'PINJAMAN',
				'description' => 'Pencairan Pinjaman',
				'is_saving_type' => false
			],
			[
				'code' => 'ANGSURAN',
				'description' => 'Nyicil',
				'is_saving_type' => false
			],
			[
				'code' => 'BUNGA',
				'description' => 'Pembayaran Pinjaman',
				'is_saving_type' => false
			],
			[
				'code' => 'ADMIN_FEE',
				'description' => 'Potongan Biaya Admin',
				'is_saving_type' => false
			],
			[
				'code' => 'SHU_SS',
				'description' => 'Pembagian SHU Simpanan',
				'is_saving_type' => false
			],
			[
				'code' => 'SHU_PINJAMAN',
				'description' => 'Pembagian SHU Pinjaman',
				'is_saving_type' => false
			]
		]);

		$this->call(UserSeeder::class);
	}
}
