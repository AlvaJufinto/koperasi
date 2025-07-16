<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use App\Models\Status; // Assuming Status model exists
use App\Models\Role;   // Assuming Role model exists
use App\Models\User;   // Assuming User model exists
use App\Models\TransactionType; // Assuming TransactionType model exists
use App\Models\Saving; // Assuming Saving model exists

class UserSeeder extends Seeder
{
	/**
	 * Run the database seeds.
	 */
	public function run(): void
	{
		$activeStatusId = Status::where('code', 'active')->first()->id;
		$memberRoleId = 3;
		$password = Hash::make('password'); // Default password for all users
		$savingDate = '2024-10-01'; // Date for initial savings

		$transactionTypeSP = TransactionType::where('code', 'SP')->first();
		$transactionTypeSW = TransactionType::where('code', 'SW')->first();
		$transactionTypeSS = TransactionType::where('code', 'SS')->first();

		$usersData = [
			['code' => 'S01', 'name' => 'Yuli /Ega', 'SW' => 3230, 'SS' => 6293],
			['code' => 'S02', 'name' => 'Yanti', 'SW' => 3140, 'SS' => 717],
			['code' => 'S03', 'name' => 'E.Th Wandriyati', 'SW' => 3170, 'SS' => 266],
			['code' => 'S04', 'name' => 'Taryoto', 'SW' => 2700, 'SS' => 277],
			['code' => 'S05', 'name' => 'Tuty Ricky', 'SW' => 3010, 'SS' => 900],
			['code' => 'S06', 'name' => 'Anita', 'SW' => 2220, 'SS' => 880],
			['code' => 'S07', 'name' => 'Maria Kanisius', 'SW' => 2600, 'SS' => 260],
			['code' => 'S08', 'name' => 'Dame Petrus', 'SW' => 2600, 'SS' => 5011],
			['code' => 'S09', 'name' => 'Lucy', 'SW' => 2500, 'SS' => 980],
			['code' => 'S10', 'name' => 'Yuvita', 'SW' => 2440, 'SS' => 1110],
			['code' => 'S11', 'name' => 'Ricky', 'SW' => 2060, 'SS' => 900],
			['code' => 'S12', 'name' => 'Ria', 'SW' => 1740, 'SS' => 1045],
			['code' => 'S13', 'name' => 'Ludgardis', 'SW' => 1700, 'SS' => 1475],
			['code' => 'S14', 'name' => 'Mikael Marut', 'SW' => 1720, 'SS' => 150],
			['code' => 'S15', 'name' => 'Vania', 'SW' => 1720, 'SS' => 1390],
			['code' => 'S16', 'name' => 'Clara', 'SW' => 1660, 'SS' => 250],
			['code' => 'S17', 'name' => 'Clemens', 'SW' => 1640, 'SS' => 980],
			['code' => 'S18', 'name' => 'Debora Tasya', 'SW' => 1560, 'SS' => 690],
			['code' => 'S19', 'name' => 'Arnold', 'SW' => 1460, 'SS' => 870],
			['code' => 'S20', 'name' => 'Tidar', 'SW' => 1380, 'SS' => 540],
			['code' => 'S21', 'name' => 'Bp Djeni', 'SW' => 1400, 'SS' => 1650],
			['code' => 'S22', 'name' => 'Randy', 'SW' => 1360, 'SS' => 660],
			['code' => 'S23', 'name' => 'Novi', 'SW' => 1400, 'SS' => 480],
			['code' => 'S24', 'name' => 'Mayer', 'SW' => 1400, 'SS' => 600],
			['code' => 'S25', 'name' => 'Djoko', 'SW' => 680, 'SS' => 1020],
			['code' => 'S26', 'name' => 'Ni Nyoman Sophiani', 'SW' => 260, 'SS' => 2015],
			['code' => 'S27', 'name' => 'Efan Arkian', 'SW' => 200, 'SS' => 300],
			['code' => 'S28', 'name' => 'Debby', 'SW' => 200, 'SS' => 160],
			['code' => 'S29', 'name' => 'Sustiwi', 'SW' => 140, 'SS' => 610],
			['code' => 'S30', 'name' => 'Diah Purwanti', 'SW' => 40, 'SS' => 110],
			['code' => 'S31', 'name' => 'Agnes Amelia', 'SW' => 20, 'SS' => 30],
			['code' => 'S32', 'name' => 'Herliyana', 'SW' => 0, 'SS' => 0], // Added from new list, assumed 0 for SW/SS
			['code' => 'S33', 'name' => 'Ambarwati', 'SW' => 0, 'SS' => 0], // Added from new list, assumed 0 for SW/SS
			['code' => 'S34', 'name' => 'Agustina', 'SW' => 0, 'SS' => 0], // Added from new list, assumed 0 for SW/SS
			['code' => 'T01', 'name' => 'Simanjuntak Lasma', 'SW' => 1450, 'SS' => 647],
			['code' => 'T02', 'name' => 'Parhusip', 'SW' => 1730, 'SS' => 957],
			['code' => 'T03', 'name' => 'Rosdiana Parhusip', 'SW' => 180, 'SS' => 158],
			['code' => 'T04', 'name' => 'Fasihati', 'SW' => 2360, 'SS' => 385],
			['code' => 'T05', 'name' => 'Anthoy Dolog', 'SW' => 2100, 'SS' => 731],
			['code' => 'T06', 'name' => 'Agnes', 'SW' => 0, 'SS' => 0], // Handle '-' as 0
			['code' => 'T07', 'name' => 'Lina', 'SW' => 1030, 'SS' => 479],
			['code' => 'T08', 'name' => 'Suli', 'SW' => 2170, 'SS' => 345],
			['code' => 'T09', 'name' => 'Mama Ivan', 'SW' => 2140, 'SS' => 2450],
			['code' => 'T10', 'name' => 'Jopy', 'SW' => 2160, 'SS' => 305],
			['code' => 'T11', 'name' => 'Loi', 'SW' => 1160, 'SS' => 97],
			['code' => 'T12', 'name' => 'Yanita Piran', 'SW' => 1680, 'SS' => 1115],
			['code' => 'T13', 'name' => 'Maria Elisabeth', 'SW' => 1560, 'SS' => 415],
			['code' => 'T14', 'name' => 'Jimmy', 'SW' => 160, 'SS' => 4300],
			['code' => 'M01', 'name' => 'Y Hartiningsih', 'SW' => 3200, 'SS' => 2331],
			['code' => 'M02', 'name' => 'Papulele', 'SW' => 3000, 'SS' => 79],
			['code' => 'M03', 'name' => 'Piet', 'SW' => 2790, 'SS' => 145],
			['code' => 'M04', 'name' => 'Susy', 'SW' => 540, 'SS' => 1563],
			['code' => 'M05', 'name' => 'Lucia Djamijanto', 'SW' => 3050, 'SS' => 1325],
			['code' => 'M06', 'name' => 'Siburian', 'SW' => 3210, 'SS' => 30314],
			['code' => 'M07', 'name' => 'Petrus Pasaribu', 'SW' => 3100, 'SS' => 8940],
			['code' => 'M08', 'name' => 'Fransiska', 'SW' => 3100, 'SS' => 390],
			['code' => 'M09', 'name' => 'Rosa', 'SW' => 3040, 'SS' => 6783],
			['code' => 'M10', 'name' => 'Basawati', 'SW' => 3080, 'SS' => 4559],
			['code' => 'M11', 'name' => 'Ferry', 'SW' => 2930, 'SS' => 2607],
			['code' => 'M12', 'name' => 'Nainggolan', 'SW' => 1760, 'SS' => 10302],
			['code' => 'M13', 'name' => 'Atiek', 'SW' => 0, 'SS' => 0],
			['code' => 'M14', 'name' => 'Romauli', 'SW' => 2860, 'SS' => 1386],
			['code' => 'M15', 'name' => 'Frieda', 'SW' => 0, 'SS' => 0],
			['code' => 'M16', 'name' => 'Yuni', 'SW' => 2500, 'SS' => 2305],
			['code' => 'M17', 'name' => 'Bpk Jamiyanto', 'SW' => 2280, 'SS' => 500],
			['code' => 'M18', 'name' => 'Bpk Agus', 'SW' => 2380, 'SS' => 1935],
			['code' => 'M19', 'name' => 'Yuven', 'SW' => 2360, 'SS' => 235],
			['code' => 'M20', 'name' => 'Jenny', 'SW' => 2360, 'SS' => 1725],
			['code' => 'M21', 'name' => 'Jefry', 'SW' => 0, 'SS' => 0],
			['code' => 'M22', 'name' => 'Priyati', 'SW' => 2300, 'SS' => 900],
			['code' => 'M23', 'name' => 'Sunny', 'SW' => 1660, 'SS' => 230],
			['code' => 'M24', 'name' => 'Maykel', 'SW' => 1460, 'SS' => 870],
			['code' => 'M25', 'name' => 'Ucce', 'SW' => 1520, 'SS' => 845],
			['code' => 'M26', 'name' => 'Tesa', 'SW' => 1560, 'SS' => 1480],
			['code' => 'M27', 'name' => 'Widya', 'SW' => 1560, 'SS' => 1540],
			['code' => 'M28', 'name' => 'Anto', 'SW' => 1560, 'SS' => 1850],
			['code' => 'M29', 'name' => 'Yanti Esterlina', 'SW' => 1400, 'SS' => 510],
			['code' => 'M30', 'name' => 'Erna Ria Barus', 'SW' => 1280, 'SS' => 1445],
			['code' => 'M31', 'name' => 'Rosliwanti', 'SW' => 1360, 'SS' => 1545],
			['code' => 'M32', 'name' => 'Rafael Nainggolan', 'SW' => 1140, 'SS' => 6040],
			['code' => 'M33', 'name' => 'John Pasaribu', 'SW' => 1140, 'SS' => 742],
			['code' => 'M34', 'name' => 'Robert Sirait', 'SW' => 1180, 'SS' => 4585],
			['code' => 'M35', 'name' => 'B. Simanjuntak', 'SW' => 1140, 'SS' => 1709],
			['code' => 'M36', 'name' => 'Vincentius Pasaribu', 'SW' => 1120, 'SS' => 1718],
			['code' => 'M37', 'name' => 'Andreas Alexander', 'SW' => 1100, 'SS' => 275],
			['code' => 'M38', 'name' => 'Pipit', 'SW' => 1120, 'SS' => 2060],
			['code' => 'M39', 'name' => 'Toni', 'SW' => 1120, 'SS' => 1980],
			['code' => 'M40', 'name' => 'Yati', 'SW' => 1120, 'SS' => 405],
			['code' => 'M41', 'name' => 'Novita Angela', 'SW' => 1220, 'SS' => 13685],
			['code' => 'M42', 'name' => 'Christmas N', 'SW' => 1100, 'SS' => 23289],
			['code' => 'M43', 'name' => 'Novita', 'SW' => 1040, 'SS' => 3030],
			['code' => 'M44', 'name' => 'Yati Didik', 'SW' => 680, 'SS' => 215],
			['code' => 'M45', 'name' => 'Risa', 'SW' => 680, 'SS' => 1820],
			['code' => 'M46', 'name' => 'Senen', 'SW' => 620, 'SS' => 1675],
			['code' => 'M47', 'name' => 'Sutinah', 'SW' => 620, 'SS' => 1645],
			['code' => 'M48', 'name' => 'Ade Christin', 'SW' => 560, 'SS' => 705],
			['code' => 'M49', 'name' => 'Helen', 'SW' => 560, 'SS' => 3710],
			['code' => 'M50', 'name' => 'Mensi', 'SW' => 480, 'SS' => 1126],
			['code' => 'M51', 'name' => 'Anet Sitompul', 'SW' => 420, 'SS' => 3805],
			['code' => 'M52', 'name' => 'Erika', 'SW' => 420, 'SS' => 1284],
			['code' => 'M53', 'name' => 'Johnson', 'SW' => 420, 'SS' => 180],
			['code' => 'M54', 'name' => 'Brigita Natasya', 'SW' => 400, 'SS' => 11995],
			['code' => 'M55', 'name' => 'Maria (Rini)', 'SW' => 400, 'SS' => 15],
			['code' => 'M56', 'name' => 'Rachel', 'SW' => 360, 'SS' => 755],
			['code' => 'M57', 'name' => 'Ferdinand Samosir', 'SW' => 260, 'SS' => 440],
			['code' => 'M58', 'name' => 'Dewi Sartika', 'SW' => 260, 'SS' => 440],
			['code' => 'M59', 'name' => 'Asna Sianipar', 'SW' => 0, 'SS' => 0],
			['code' => 'M60', 'name' => 'Sarno', 'SW' => 240, 'SS' => 360],
			['code' => 'M61', 'name' => 'Tarsisius', 'SW' => 240, 'SS' => 910],
			['code' => 'M62', 'name' => 'Donald Ambarita', 'SW' => 200, 'SS' => 750],
			['code' => 'M63', 'name' => 'Agnes Hasian', 'SW' => 200, 'SS' => 750],
			['code' => 'M64', 'name' => 'Jefri Sihombing', 'SW' => 200, 'SS' => 2670],
			['code' => 'M65', 'name' => 'Robert Pasaribu', 'SW' => 200, 'SS' => 1130],
			['code' => 'M66', 'name' => 'Juliana', 'SW' => 180, 'SS' => 4500],
			['code' => 'M67', 'name' => 'Arta Banjarnahor', 'SW' => 160, 'SS' => 800],
			['code' => 'M68', 'name' => 'Berta', 'SW' => 160, 'SS' => 890],
			['code' => 'M69', 'name' => 'Melda Nainggolan', 'SW' => 160, 'SS' => 5500],
			['code' => 'M70', 'name' => 'Sahala Pasaribu', 'SW' => 140, 'SS' => 810],
			['code' => 'M71', 'name' => 'Panca Marpaung', 'SW' => 140, 'SS' => 600],
			['code' => 'M72', 'name' => 'Yanto', 'SW' => 140, 'SS' => 230],
			['code' => 'M73', 'name' => 'Hendricus Mau', 'SW' => 140, 'SS' => 360],
			['code' => 'M74', 'name' => 'Royke Ngilo', 'SW' => 140, 'SS' => 35],
			['code' => 'M75', 'name' => 'Lasma', 'SW' => 140, 'SS' => 35],
			['code' => 'M76', 'name' => 'Theresia Gita', 'SW' => 100, 'SS' => 400],
			['code' => 'M77', 'name' => 'Marcela', 'SW' => 80, 'SS' => 300],
			['code' => 'E01', 'name' => 'Niniek Angwarmase', 'SW' => 3120, 'SS' => 2022],
			['code' => 'E02', 'name' => 'Dawami', 'SW' => 3240, 'SS' => 6141],
			['code' => 'E03', 'name' => 'Sardi', 'SW' => 3190, 'SS' => 1105],
			['code' => 'E04', 'name' => 'Alior', 'SW' => 3220, 'SS' => 7536],
			['code' => 'E05', 'name' => 'Menuk Sartono', 'SW' => 3240, 'SS' => 1855],
			['code' => 'E06', 'name' => 'Ediyati', 'SW' => 3240, 'SS' => 9143],
			['code' => 'E07', 'name' => 'Alijo', 'SW' => 3200, 'SS' => 5005],
			['code' => 'E08', 'name' => 'Vero', 'SW' => 3160, 'SS' => 965],
			['code' => 'E09', 'name' => 'Anna Gultom', 'SW' => 580, 'SS' => 628],
			['code' => 'E10', 'name' => 'Sumardi', 'SW' => 1020, 'SS' => 547],
			['code' => 'E11', 'name' => 'Yulius', 'SW' => 1800, 'SS' => 1005],
			['code' => 'E12', 'name' => 'Sukaryani', 'SW' => 3220, 'SS' => 1187],
			['code' => 'E13', 'name' => 'Sita', 'SW' => 850, 'SS' => 1684],
			['code' => 'E14', 'name' => 'Elis', 'SW' => 600, 'SS' => 929],
			['code' => 'E15', 'name' => 'Yanti Anang', 'SW' => 810, 'SS' => 1034],
			['code' => 'E16', 'name' => 'Ika Sakeng', 'SW' => 2830, 'SS' => 2433],
			['code' => 'E17', 'name' => 'Yovita', 'SW' => 2990, 'SS' => 1521],
			['code' => 'E18', 'name' => 'Nina', 'SW' => 2090, 'SS' => 595],
			['code' => 'E19', 'name' => 'Eviani', 'SW' => 2940, 'SS' => 1297],
			['code' => 'E20', 'name' => 'Nila', 'SW' => 2730, 'SS' => 580],
			['code' => 'E21', 'name' => 'Nining', 'SW' => 2400, 'SS' => 2365],
			['code' => 'E22', 'name' => 'Kartono', 'SW' => 2380, 'SS' => 1195],
			['code' => 'E23', 'name' => 'Pater', 'SW' => 2300, 'SS' => 1400],
			['code' => 'E24', 'name' => 'Egi', 'SW' => 2300, 'SS' => 1230],
			['code' => 'E25', 'name' => 'Y. Sartono', 'SW' => 2160, 'SS' => 1855],
			['code' => 'E26', 'name' => 'Galuh', 'SW' => 1960, 'SS' => 4855],
			['code' => 'E27', 'name' => 'Gusti', 'SW' => 1880, 'SS' => 4855],
			['code' => 'E28', 'name' => 'Martin', 'SW' => 1880, 'SS' => 14074],
			['code' => 'E29', 'name' => 'Ursula Devani', 'SW' => 1840, 'SS' => 908],
			['code' => 'E30', 'name' => 'Ringan', 'SW' => 0, 'SS' => 0],
			['code' => 'E31', 'name' => 'Victoria', 'SW' => 1640, 'SS' => 1460],
			['code' => 'E32', 'name' => 'Anita Yenny', 'SW' => 1640, 'SS' => 1460],
			['code' => 'E33', 'name' => 'J Deka A', 'SW' => 1560, 'SS' => 1170],
			['code' => 'E34', 'name' => 'N. Suparno', 'SW' => 1660, 'SS' => 1040],
			['code' => 'E35', 'name' => 'Edward Oka', 'SW' => 1640, 'SS' => 5345],
			['code' => 'E36', 'name' => 'Fr Bonita', 'SW' => 1620, 'SS' => 10657],
			['code' => 'E37', 'name' => 'Anitasari', 'SW' => 1560, 'SS' => 1465],
			['code' => 'E38', 'name' => 'P. Ari Ingan', 'SW' => 1600, 'SS' => 294],
			['code' => 'E39', 'name' => 'R.M Yuventa', 'SW' => 1400, 'SS' => 219],
			['code' => 'E40', 'name' => 'Am Yuvensia', 'SW' => 1620, 'SS' => 5415],
			['code' => 'E41', 'name' => 'A. Vincent V', 'SW' => 1500, 'SS' => 1620],
			['code' => 'E42', 'name' => 'Noang', 'SW' => 1340, 'SS' => 3062],
			['code' => 'E43', 'name' => 'Y. Herry O', 'SW' => 1180, 'SS' => 560],
			['code' => 'E44', 'name' => 'A Niken', 'SW' => 1120, 'SS' => 6052],
			['code' => 'E45', 'name' => 'Kris Lara', 'SW' => 980, 'SS' => 1595],
			['code' => 'E46', 'name' => 'Sadar W Gultom', 'SW' => 840, 'SS' => 2180],
			['code' => 'E47', 'name' => 'Chr Rosiana D', 'SW' => 680, 'SS' => 155],
			['code' => 'E48', 'name' => 'Agung Gede', 'SW' => 680, 'SS' => 610],
			['code' => 'E49', 'name' => 'Wati', 'SW' => 220, 'SS' => 45],
			['code' => 'E50', 'name' => 'Diana', 'SW' => 200, 'SS' => 650],
			['code' => 'E51', 'name' => 'Laurensus Hutahaean', 'SW' => 200, 'SS' => 1000],
			['code' => 'E52', 'name' => 'Nelpitauli Damanik', 'SW' => 200, 'SS' => 1000],
			['code' => 'E53', 'name' => 'Astuti Romasta S.', 'SW' => 200, 'SS' => 800],
			['code' => 'E54', 'name' => 'Christian B.Julio', 'SW' => 200, 'SS' => 800],
			['code' => 'E55', 'name' => 'Pingkan C.Baran', 'SW' => 200, 'SS' => 800],
			['code' => 'E56', 'name' => 'Silvi', 'SW' => 100, 'SS' => 790],
			['code' => 'E57', 'name' => 'Wiwit', 'SW' => 120, 'SS' => 1530],
		];

		foreach ($usersData as $userData) {
			$newUser = User::create([
				'code' => $userData['code'],
				'name' => $userData['name'],
				'phone' => '08' . mt_rand(100000000, 999999999),
				'email' => null,
				'address' => "Jl. Apalah no. 123",
				'join_date' => now()->subMonths(rand(1, 12)), // Random join date within last year
				'status_id' => $activeStatusId,
				'role_id' => $memberRoleId,
				'password' => $password,
			]);

			// Seed Simpanan Pokok (SP) - default 20000
			Saving::create([
				'user_id' => $newUser->id,
				'saving_type_id' => $transactionTypeSP->id,
				'amount' => 20000,
				'date' => $savingDate,
				'note' => 'Simpanan Pokok Awal',
			]);

			// Seed Simpanan Wajib (SW) if available
			if (isset($userData['SW']) && $userData['SW'] > 0) {
				Saving::create([
					'user_id' => $newUser->id,
					'saving_type_id' => $transactionTypeSW->id,
					'amount' => $userData['SW'] * 1000, // Multiply by 1000
					'date' => $savingDate,
					'note' => 'Simpanan Wajib Awal',
				]);
			}

			// Seed Simpanan Sukarela (SS) if available
			if (isset($userData['SS']) && $userData['SS'] > 0) {
				Saving::create([
					'user_id' => $newUser->id,
					'saving_type_id' => $transactionTypeSS->id,
					'amount' => $userData['SS'] * 1000, // Multiply by 1000
					'date' => $savingDate,
					'note' => 'Simpanan Sukarela Awal',
				]);
			}
		}
	}
}
