<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Role;
use App\Models\Saving;
use App\Models\SavingType;
use App\Models\Status;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
	public function run(): void
	{

		User::create([
			'code' => 'X01',
			'phone' => '123456789',

			'name' => 'admin',
			'email' => 'admin@example.com',

			// 'address' => 'Jl. Test no. 123',
			'status_id' => 1,
			'role_id' => 2,

			'password' => '123',
		]);

		User::create([
			'code' => 'A01',
			'phone' => '089601943530',

			'name' => 'Test User',
			'email' => 'test@example.com',

			'address' => 'Jl. Test no. 123',
			'status_id' => 1,
			'role_id' => 2,

			'password' => '123',
		]);

		$statusId = 1;
		$roleId = 2;
		$password = Hash::make('123');

		$users = [
			['code' => 'S01', 'name' => 'Yuli /Ega'],
			['code' => 'S02', 'name' => 'Yanti'],
			['code' => 'S03', 'name' => 'E.Th Wandriyati (I.Bram)'],
			['code' => 'S04', 'name' => 'Taryoto'],
			['code' => 'S05', 'name' => 'Tuty Ricky'],
			['code' => 'S06', 'name' => 'Anita'],
			['code' => 'S07', 'name' => 'Maria Kanisius'],
			['code' => 'S08', 'name' => 'Dame Petrus'],
			['code' => 'S09', 'name' => 'Lucy'],
			['code' => 'S10', 'name' => 'Yuvita'],
			['code' => 'S11', 'name' => 'Ricky'],
			['code' => 'S12', 'name' => 'Ria'],
			['code' => 'S13', 'name' => 'Ludgardis'],
			['code' => 'S14', 'name' => 'Mikael Marut'],
			['code' => 'S15', 'name' => 'Vania'],
			['code' => 'S16', 'name' => 'Clara'],
			['code' => 'S17', 'name' => 'Clemens'],
			['code' => 'S18', 'name' => 'Debora Tasya'],
			['code' => 'S19', 'name' => 'Arnold'],
			['code' => 'S20', 'name' => 'Tidar'],
			['code' => 'S21', 'name' => 'Bp Djeni'],
			['code' => 'S22', 'name' => 'Randy'],
			['code' => 'S23', 'name' => 'Novi'],
			['code' => 'S24', 'name' => 'Mayer'],
			['code' => 'S25', 'name' => 'Djoko'],
			['code' => 'S26', 'name' => 'Ni Nyoman Sophiani'],
			['code' => 'S27', 'name' => 'Efan Arkian'],
			['code' => 'S28', 'name' => 'Debby'],
			['code' => 'S29', 'name' => 'Sustiwi'],
			['code' => 'S30', 'name' => 'Diah Purwanti'],
			['code' => 'S31', 'name' => 'Agnes'],
			['code' => 'S32', 'name' => 'Herliyana'],
			['code' => 'S33', 'name' => 'Ambarwati'],
			['code' => 'S34', 'name' => 'Agustina'],
		];

		foreach ($users as $user) {
			$newUser = User::create([
				'code' => $user['code'],
				'name' => $user['name'],
				'phone' => '08' . mt_rand(100000000, 999999999),
				'email' => null,
				'address' => "Jl. Apalah no. 123",
				'join_date' => now(),
				'status_id' => $statusId,
				'role_id' => $roleId,
				'password' => $password,
			]);

			Saving::create([
				'user_id' => $newUser['id'],
				'saving_type_id' => 1,
				'amount' => 20000,
				'date' => now(),
				'notes' => 'Simpanan Pokok',
			]);
		}
	}
}
