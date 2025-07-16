import { useState } from "react";

import Button from "@/Components/Button";
import Table from "@/Components/Table";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { formatRupiah } from "@/utils";
import { Head, Link, router } from "@inertiajs/react";

export default function Index({ auth, month, records, months }: any) {
  const [selectedMonth, setSelectedMonth] = useState(month);
  const handleFilter = () => {
    router.get(route("saving.index"), { month: selectedMonth });
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={<h2 className="text-xl font-semibold">Simpanan Bulanan</h2>}
    >
      <Head title="Simpanan" />
      <div className="p-4 space-y-4 bg-white shadow rounded-lg">
        <div className="flex justify-between">
          <div className="flex space-x-2">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="border pl-2 pr-10 py-1 rounded"
            >
              {months.map((m: any) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>

            <Button onClick={handleFilter} type="primary">
              Filter
            </Button>
          </div>
          <Link
            href={route("saving.create")}
            className="text-white bg-blue-600 px-4 py-2 rounded text-sm"
          >
            + Setor/Tarik Simpanan
          </Link>
        </div>
        <Table
          data={records}
          columns={[
            { label: "Kode", accessor: "code" },
            { label: "Nama", accessor: "name" },
            {
              label: "SP",
              accessor: "sp",
              align: "right",
              render: (item: any) => formatRupiah(item.sp),
            },
            {
              label: "SW",
              accessor: "sw",
              align: "right",
              render: (item: any) => formatRupiah(item.sw),
            },
            {
              label: "SS",
              accessor: "ss",
              align: "right",
              render: (item: any) => formatRupiah(item.ss),
            },
            {
              label: "Total",
              accessor: "total",
              align: "right",
              render: (item: any) => formatRupiah(item.total),
            },
            {
              label: "Ambil SS",
              accessor: "tarik_ss",
              align: "right",
              render: (item: any) => formatRupiah(item.tarik_ss),
            },
          ]}
        />
      </div>
    </AuthenticatedLayout>
  );
}
