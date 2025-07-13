import Button from '@/Components/Button';
import Table from '@/Components/Table';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {
	Head,
	Link,
} from '@inertiajs/react';

export default function Show({ auth, user, monthlyRecords, summary }: any) {
  const columns = [
    { label: "Bulan", accessor: "month" },
    { label: "SP", accessor: "sp", align: "right" },
    { label: "Angs", accessor: "angsuran", align: "right" },
    { label: "Bunga", accessor: "bunga", align: "right" },
    { label: "SW", accessor: "sw", align: "right" },
    { label: "SS", accessor: "ss", align: "right" },
    { label: "Total", accessor: "total", align: "right" },
    { label: "Ambil SS", accessor: "tarik_ss", align: "right" },
  ];

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
          Anggota : {user?.name}
        </h2>
      }
    >
      <Head title={`Detail ${user?.name}`} />

      <Link href={route("user.index")} className="inline-block mb-4">
        <Button type="default">← Kembali</Button>
      </Link>

      <div className="grid grid-cols-3 gap-6 p-4">
        {/* Left Table */}
        <div className="col-span-2">
          <h2 className="text-lg font-semibold mb-2">Rekap Bulanan</h2>
          {/* @ts-ignore */}
          <Table data={monthlyRecords} columns={columns} />
        </div>

        {/* Right Summary */}
        <div className="bg-white border rounded-md p-4 shadow-sm h-fit">
          <h3 className="text-lg font-semibold mb-2">Akumulasi</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Total SW</span>
              <span>{summary.total_sw}</span>
            </div>
            <div className="flex justify-between">
              <span>Total SS</span>
              <span>{summary.total_ss}</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Jumlah</span>
              <span>{summary.total_sw + summary.total_ss}</span>
            </div>
            <hr />
            <div className="flex justify-between mt-2">
              <span>Pinjaman Aktif</span>
              <span>{summary.total_pinjaman}</span>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
