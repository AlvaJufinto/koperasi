import Table from "@/Components/Table";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { formatRupiah } from "@/utils";
import { Head, Link } from "@inertiajs/react";

export default function Index({ auth, users }: any) {
  const getSavingAmount = (user: any, type: string) =>
    user.savings.find((s: any) => s.type === type)?.amount || 0;

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
          Anggota
        </h2>
      }
    >
      <Head title="Anggota" />

      <div className="bg-white p-6 overflow-hidden shadow-sm sm:rounded-lg">
        <div className="p-4">
          <div className="flex justify-between mb-4">
            <h1 className="text-2xl font-bold">Anggota</h1>
            <Link
              href={route("user.create")}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Tambah Anggota
            </Link>
          </div>

          <div className="overflow-x-auto">
            <Table
              data={users.data}
              columns={[
                { label: "No", accessor: "id", render: (_, i) => i + 1 },
                { label: "Kode", accessor: "code" },
                { label: "Nama", accessor: "name" },
                { label: "Status", accessor: "status.code" },
                { label: "Tgl Gabung", accessor: "join_date" },
                {
                  label: "SP",
                  accessor: "sp",
                  align: "right",
                  render: (user) => formatRupiah(getSavingAmount(user, "SP")),
                },
                {
                  label: "SW",
                  accessor: "sw",
                  align: "right",
                  render: (user) => formatRupiah(getSavingAmount(user, "SW")),
                },
                {
                  label: "SS",
                  accessor: "ss",
                  align: "right",
                  render: (user) => formatRupiah(getSavingAmount(user, "SS")),
                },
                {
                  label: "Total Pinj.",
                  accessor: "total_loan",
                  align: "right",
                  render: (user) => formatRupiah(user.total_loan || 0),
                },
                {
                  label: "Sisa Pinj.",
                  accessor: "remaining_loan",
                  align: "right",
                  render: (user) => formatRupiah(user.remaining_loan || 0),
                },
                {
                  label: "Action",
                  accessor: "action",
                  render: (user) => (
                    <div className="space-x-2">
                      <Link
                        href={route("user.show", user.id)}
                        className="text-blue-600 hover:underline"
                      >
                        Detail
                      </Link>
                      <Link
                        href={route("user.edit", user.id)}
                        className="text-green-600 hover:underline"
                      >
                        Edit
                      </Link>
                    </div>
                  ),
                },
              ]}
            />
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
