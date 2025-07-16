import Table from "@/Components/Table";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";

export default function Index({ auth, loans }: any) {
  console.log("🚀 ~ Index ~ loans:", loans);
  const columns = [
    {
      label: "Kode",
      accessor: "user.code",
      render: (loan: any) => loan.user.code,
    },
    {
      label: "Nama",
      accessor: "user.name",
      render: (loan: any) => loan.user.name,
    },
    {
      label: "Pinjaman",
      accessor: "principal",
      align: "right",
      render: (loan: any) => loan.principal.toLocaleString(),
    },
    {
      label: "Angsuran",
      accessor: "installment_amount",
      align: "right",
      render: (loan: any) => loan.installment_amount.toLocaleString(),
    },
    {
      label: "Bunga",
      accessor: "interest",
      align: "right",
      render: (loan: any) => `${loan.interest}%`,
    },
    {
      label: "Sisa",
      accessor: "remaining_amount",
      align: "right",
      render: (loan: any) => loan.remaining_amount.toLocaleString(),
    },
    {
      label: "Tenor",
      accessor: "tenor_months",
      align: "right",
      render: (loan: any) => `${loan.tenor_months} bulan`,
    },
    {
      label: "Aksi",
      accessor: "aksi",
      render: (loan: any) => (
        <div className="space-x-2">
          <Link
            href={route("loan.show", loan.id)}
            className="text-blue-600 hover:underline text-sm"
          >
            Detail
          </Link>
          <Link
            href={route("loan.payment.create", loan.id)}
            className="text-green-600 hover:underline text-sm"
          >
            Bayar
          </Link>
        </div>
      ),
    },
  ];

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={<h2 className="text-xl font-semibold">Daftar Pinjaman</h2>}
    >
      <Head title="Pinjaman" />

      <div className="p-4 space-y-4 bg-white shadow rounded-lg min-h-full">
        <div className="flex justify-end">
          <Link
            href={route("loan.create")}
            className="text-white bg-blue-600 px-4 py-2 rounded text-sm"
          >
            + Tambah Pinjaman
          </Link>
        </div>
        {/* @ts-ignore */}
        <Table data={loans} columns={columns} />
      </div>
    </AuthenticatedLayout>
  );
}
