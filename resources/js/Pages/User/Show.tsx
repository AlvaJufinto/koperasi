import { Key } from "react";

import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

export default function Show({ auth, user, monthlyRecords, summary }: any) {
  console.log("🚀 ~ Show ~ user:", user.name);
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

      <div className="grid grid-cols-3 gap-6 p-4">
        {/* Left Table - Monthly Records */}
        <div className="col-span-2">
          <h2 className="text-lg font-semibold mb-2">Rekap Bulanan</h2>
          <table className="min-w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-2 py-1">Bulan</th>
                <th className="border px-2 py-1">SP</th>
                <th className="border px-2 py-1">Angs</th>
                <th className="border px-2 py-1">Bunga</th>
                <th className="border px-2 py-1">SW</th>
                <th className="border px-2 py-1">SS</th>
                <th className="border px-2 py-1">Total</th>
                <th className="border px-2 py-1">Ambil SS</th>
              </tr>
            </thead>
            <tbody>
              {monthlyRecords.map((item: any, i: Number) => (
                <tr key={i as Key}>
                  <td className="border px-2 py-1">{item.month}</td>
                  <td className="border px-2 py-1 text-right">{item.sp}</td>
                  <td className="border px-2 py-1 text-right">
                    {item.angsuran}
                  </td>
                  <td className="border px-2 py-1 text-right">{item.bunga}</td>
                  <td className="border px-2 py-1 text-right">{item.sw}</td>
                  <td className="border px-2 py-1 text-right">{item.ss}</td>
                  <td className="border px-2 py-1 text-right">{item.total}</td>
                  <td className="border px-2 py-1 text-right">
                    {item.tarik_ss}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Right Summary Box */}
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
