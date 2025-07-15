import { useState } from "react";

import Button from "@/Components/Button";
import Table from "@/Components/Table";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { formatRupiah } from "@/utils";
import { Head, router } from "@inertiajs/react";

export default function Index({ auth, month, records }: any) {
  const [selectedMonth, setSelectedMonth] = useState(month);

  const handleFilter = () => {
    router.get(route("transaction.index"), { month: selectedMonth });
  };

  const columns = [
    { label: "Kode", accessor: "code" },
    { label: "Nama", accessor: "name" },
    {
      label: "Angsuran",
      accessor: "angsuran",
      align: "right",
      render: (item: any) => formatRupiah(item.angsuran),
    },
    { label: "Bunga", accessor: "bunga", align: "right" },
    { label: "SW", accessor: "sw", align: "right" },
    { label: "SS", accessor: "ss", align: "right" },
    { label: "Total", accessor: "total", align: "right" },
    { label: "Ambil SS", accessor: "tarik_ss", align: "right" },
  ];

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={<h2 className="text-xl font-semibold">Transaksi Bulanan</h2>}
    >
      <Head title="Transaksi" />

      <div className="p-4 space-y-4 bg-white shadow rounded-lg">
        <div className="flex justify-between">
          <div className="flex space-x-2">
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="border px-2 py-1 rounded"
            />
            <Button onClick={handleFilter} type="primary">
              Filter
            </Button>
          </div>
          {/*<Link
            href={route("transaction.create")}
            className="text-white bg-blue-600 px-4 py-2 rounded text-sm"
          >
            + Tambah Transaksi
          </Link>*/}
        </div>
        {/* @ts-ignore */}
        <Table data={records} columns={columns} />
      </div>
    </AuthenticatedLayout>
  );
}
