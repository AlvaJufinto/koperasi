<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

use App\Models\LoanStatus;
use App\Models\Role;
use App\Models\Status;
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
  }
}