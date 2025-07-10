import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";

export default function Index({ auth, users }: any) {
  console.log("🚀 ~ Index ~ users:", users);
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
            <table className="min-w-full text-sm border border-gray-300">
              <thead className="bg-gray-100 text-left">
                <tr>
                  <th className="px-3 py-2 border">No</th>
                  <th className="px-3 py-2 border">Kode</th>
                  <th className="px-3 py-2 border">Nama</th>
                  <th className="px-3 py-2 border">Status</th>
                  <th className="px-3 py-2 border">Tgl Gabung</th>
                  <th className="px-3 py-2 border">SP</th>
                  <th className="px-3 py-2 border">SW</th>
                  <th className="px-3 py-2 border">SS</th>
                  <th className="px-3 py-2 border">Total Pinj.</th>
                  <th className="px-3 py-2 border">Sisa Pinj.</th>
                  <th className="px-3 py-2 border">Action</th>
                </tr>
              </thead>
              <tbody>
                {users?.map((user: any, i: any) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-3 py-2 border">{i + 1}</td>
                    <td className="px-3 py-2 border">{user.code}</td>
                    <td className="px-3 py-2 border">{user.name}</td>
                    <td className="px-3 py-2 border">{user.status.code}</td>
                    <td className="px-3 py-2 border">
                      {user.join_date ?? "-"}
                    </td>
                    <td className="px-3 py-2 border text-right">
                      {getSavingAmount(user, "SP")}
                    </td>
                    <td className="px-3 py-2 border text-right">
                      {getSavingAmount(user, "SW")}
                    </td>
                    <td className="px-3 py-2 border text-right">
                      {getSavingAmount(user, "SS")}
                    </td>
                    <td className="px-3 py-2 border text-right">
                      {user.total_loan ?? 0}
                    </td>
                    <td className="px-3 py-2 border text-right">
                      {user.remaining_loan ?? 0}
                    </td>
                    <td className="px-3 py-2 border">
                      <Link
                        href={route("user.show", user.id)}
                        className="text-blue-600 hover:underline"
                      >
                        Detail
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
