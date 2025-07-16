// resources/js/Pages/Loan/Create.tsx

import { useEffect, useState } from "react";

import Button from "@/Components/Button";
import InputLabel from "@/Components/InputLabel";
import Select from "@/Components/Select";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";

export default function Create({ auth, users }: any) {
  const { data, setData, post, processing, errors } = useForm({
    user_id: "",
    principal: "",
    admin_fee: "1.00",
    interest: "1.00",
    tenor_months: "12",
    approved_date: new Date().toISOString().slice(0, 10),
    note: "",
  });

  const [adminFeeAmount, setAdminFeeAmount] = useState(0);
  const [disbursedAmount, setDisbursedAmount] = useState(0);
  const [installmentAmount, setInstallmentAmount] = useState(0);

  useEffect(() => {
    const principal = parseInt(data.principal || "0", 10);
    const adminFee = parseFloat(data.admin_fee || "0");
    const interest = parseFloat(data.interest || "0");
    const tenor = parseInt(data.tenor_months || "0", 10);

    const admin = Math.floor(principal * (adminFee / 100));
    const disbursed = principal - admin;
    const installment =
      tenor > 0
        ? Math.ceil((principal * (1 + (interest / 100) * tenor)) / tenor)
        : 0;

    setAdminFeeAmount(admin);
    setDisbursedAmount(disbursed);
    setInstallmentAmount(installment);
  }, [data.principal, data.admin_fee, data.interest, data.tenor_months]);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    post(route("loan.store"));
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={<h2 className="text-xl font-semibold">Tambah Pinjaman</h2>}
    >
      <Head title="Tambah Pinjaman" />

      <div className="max-w-2xl mx-auto mt-6 bg-white p-6 rounded shadow space-y-4">
        <Link href={route("loan.index")}>
          <Button type="default">← Kembali</Button>
        </Link>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <InputLabel htmlFor="user_id" value="Anggota" />
            <Select
              id="user_id"
              value={data.user_id}
              onChange={(e) => setData("user_id", e.target.value)}
            >
              <option value="">Pilih Anggota</option>
              {users.map((u: any) => (
                <option key={u.id} value={u.id}>
                  {u.code} - {u.name}
                </option>
              ))}
            </Select>
            <p className="text-red-500 text-sm">{errors.user_id}</p>
          </div>

          <div>
            <InputLabel htmlFor="principal" value="Jumlah Pinjaman" />
            <TextInput
              id="principal"
              type="number"
              className="w-full"
              value={data.principal}
              onChange={(e) => setData("principal", e.target.value)}
            />
            <p className="text-red-500 text-sm">{errors.principal}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <InputLabel htmlFor="admin_fee" value="Admin Fee (%)" />
              <TextInput
                id="admin_fee"
                type="number"
                step="0.01"
                className="w-full"
                value={data.admin_fee}
                onChange={(e) => setData("admin_fee", e.target.value)}
              />
              <p className="text-red-500 text-sm">{errors.admin_fee}</p>
            </div>

            <div>
              <InputLabel htmlFor="interest" value="Bunga per Bulan (%)" />
              <TextInput
                id="interest"
                type="number"
                step="0.01"
                className="w-full"
                value={data.interest}
                onChange={(e) => setData("interest", e.target.value)}
              />
              <p className="text-red-500 text-sm">{errors.interest}</p>
            </div>
          </div>

          <div>
            <InputLabel htmlFor="tenor_months" value="Tenor (bulan)" />
            <TextInput
              id="tenor_months"
              type="number"
              className="w-full"
              value={data.tenor_months}
              onChange={(e) => setData("tenor_months", e.target.value)}
            />
            <p className="text-red-500 text-sm">{errors.tenor_months}</p>
          </div>

          <div>
            <InputLabel htmlFor="approved_date" value="Tanggal Disetujui" />
            <TextInput
              id="approved_date"
              type="date"
              className="w-full"
              value={data.approved_date}
              onChange={(e) => setData("approved_date", e.target.value)}
            />
            <p className="text-red-500 text-sm">{errors.approved_date}</p>
          </div>

          <div>
            <InputLabel htmlFor="note" value="Catatan" />
            <textarea
              id="note"
              className="w-full border rounded p-2 text-sm"
              rows={3}
              value={data.note}
              onChange={(e) => setData("note", e.target.value)}
            />
            <p className="text-red-500 text-sm">{errors.note}</p>
          </div>

          {/* Real-time Calculations */}
          <div className="bg-gray-100 p-4 rounded text-sm space-y-1">
            <p>
              <strong>Biaya Admin:</strong> Rp {adminFeeAmount.toLocaleString()}
            </p>
            <p>
              <strong>Jumlah Dicairkan:</strong> Rp{" "}
              {disbursedAmount.toLocaleString()}
            </p>
            <p>
              <strong>Angsuran per Bulan:</strong> Rp{" "}
              {installmentAmount.toLocaleString()}
            </p>
          </div>

          <div className="flex justify-end">
            <Button type="primary" isLoading={processing} disabled={processing}>
              Simpan
            </Button>
          </div>
        </form>
      </div>
    </AuthenticatedLayout>
  );
}
