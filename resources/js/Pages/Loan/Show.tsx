import Button from "@/Components/Button";
import Table from "@/Components/Table";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { formatRupiah } from "@/utils";
import { Head, router } from "@inertiajs/react";

export default function Show({ auth, loan, summary, monthly_data }: any) {
  const columns = [
    {
      label: "Bulan",
      accessor: "month",
    },
    {
      label: "Angsuran Ke",
      accessor: "installment_count",
      align: "right" as const,
    },
    {
      label: "Bunga",
      accessor: "interest_payment",
      align: "right" as const,
      render: (item: any) => formatRupiah(item.interest_payment),
    },
    {
      label: "Pokok",
      accessor: "principal_payment",
      align: "right" as const,
      render: (item: any) => formatRupiah(item.principal_payment),
    },
    {
      label: "Total Bayar",
      accessor: "total_payment",
      align: "right" as const,
      render: (item: any) => formatRupiah(item.total_payment),
    },
  ];

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <h2 className="text-xl font-semibold">
          Detail Pinjaman #{loan.user.name}
        </h2>
      }
    >
      <Head title="Detail Pinjaman" />

      <div className="p-4 space-y-6">
        <Button
          type="default"
          onClick={() => router.visit(route("loan.index"))}
        >
          ← Kembali
        </Button>

        <div className="p-4 bg-white rounded shadow space-y-2">
          <h3 className="font-semibold text-lg">Informasi Pinjaman</h3>
          <div className="text-sm space-y-1">
            <div className="flex justify-between">
              <span>Anggota</span>
              <span>{loan?.user?.name}</span>
            </div>
            <div className="flex justify-between">
              <span>Pokok Pinjaman</span>
              <span>{formatRupiah(loan?.principal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Sisa Pinjaman</span>
              <span className="text-red-600 font-semibold">
                {formatRupiah(summary?.remaining_amount)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Angsuran Bulanan</span>
              <span>{formatRupiah(loan?.installment_amount)}</span>
            </div>
            <div className="flex justify-between">
              <span>Bunga per Bulan</span>
              <span>{loan?.interest}%</span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-white rounded shadow space-y-2">
          <h3 className="font-semibold text-lg">Ringkasan Periode</h3>
          <div className="text-sm space-y-1">
            <div className="flex justify-between">
              <span>Total Pembayaran Periode Ini</span>
              <span className="font-semibold text-green-700">
                {formatRupiah(summary?.total_paid_in_period)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Total Pembayaran Keseluruhan</span>
              <span>{formatRupiah(summary?.total_paid)}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Bunga Dibayar</span>
              <span>{formatRupiah(summary?.total_interest_paid)}</span>
            </div>
            <div className="flex justify-between">
              <span>Sekarang Angsuran Ke</span>
              <span>{summary?.installment_number}</span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-white rounded shadow space-y-2">
          <h3 className="font-semibold text-lg">
            Histori Pembayaran per Bulan
          </h3>
          <Table data={monthly_data} columns={columns} />
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
