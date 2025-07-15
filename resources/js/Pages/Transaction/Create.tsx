import { useState } from "react";

import Button from "@/Components/Button";
import InputLabel from "@/Components/InputLabel";
import Select from "@/Components/Select";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";

export default function Create({ auth, transactionTypes, users, loans }: any) {
  const { data, setData, post, processing, errors } = useForm({
    user_id: "",
    transaction_type_id: "",
    loan_id: "",
    date: new Date().toISOString().slice(0, 10),
    amount: "",
    note: "",
  });

  const [selectedType, setSelectedType] = useState("");

  const handleTypeChange = (e: any) => {
    const typeId = e.target.value;
    setData("transaction_type_id", typeId);
    const type = transactionTypes.find((t: any) => t.id == typeId)?.code;
    setSelectedType(type);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    post(route("transaction.store"));
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={<h2 className="text-xl font-semibold">Tambah Transaksi</h2>}
    >
      <Head title="Tambah Transaksi" />

      <div className="max-w-2xl mx-auto mt-8 bg-white p-6 rounded shadow space-y-4">
        <Link href={route("transaction.index")}>
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
            <p className="text-sm text-red-500">{errors.user_id}</p>
          </div>

          <div>
            <InputLabel htmlFor="transaction_type_id" value="Jenis Transaksi" />
            <Select
              id="transaction_type_id"
              value={data.transaction_type_id}
              onChange={handleTypeChange}
            >
              <option value="">Pilih Jenis</option>
              <optgroup label="Simpanan">
                {transactionTypes
                  .filter((t: any) =>
                    ["SP", "SW", "SS", "TARIK_SS"].includes(t.code)
                  )
                  .map((t: any) => (
                    <option key={t.id} value={t.id}>
                      {t.code} - {t.name}
                    </option>
                  ))}
              </optgroup>
              <optgroup label="Pinjaman">
                {transactionTypes
                  .filter((t: any) => ["ANGSURAN", "BUNGA"].includes(t.code))
                  .map((t: any) => (
                    <option key={t.id} value={t.id}>
                      {t.code} - {t.name}
                    </option>
                  ))}
              </optgroup>
            </Select>
            <p className="text-sm text-red-500">{errors.transaction_type_id}</p>
          </div>

          {["ANGSURAN", "BUNGA"].includes(selectedType) && (
            <div>
              <InputLabel htmlFor="loan_id" value="Pinjaman" />
              <Select
                id="loan_id"
                value={data.loan_id}
                onChange={(e) => setData("loan_id", e.target.value)}
              >
                <option value="">Pilih Pinjaman</option>
                {loans
                  .filter((l: any) => l.user_id == data.user_id)
                  .map((l: any) => (
                    <option key={l.id} value={l.id}>
                      Pinjaman #{l.id} - Sisa{" "}
                      {l.remaining_amount.toLocaleString()}
                    </option>
                  ))}
              </Select>
              <p className="text-sm text-red-500">{errors.loan_id}</p>
            </div>
          )}

          <div>
            <InputLabel htmlFor="date" value="Tanggal" />
            <TextInput
              id="date"
              type="date"
              value={data.date}
              onChange={(e) => setData("date", e.target.value)}
              className="w-full"
            />
            <p className="text-sm text-red-500">{errors.date}</p>
          </div>

          <div>
            <InputLabel htmlFor="amount" value="Nominal (Rp)" />
            <TextInput
              id="amount"
              type="number"
              value={data.amount}
              onChange={(e) => setData("amount", e.target.value)}
              className="w-full"
            />
            <p className="text-sm text-red-500">{errors.amount}</p>
          </div>

          <div>
            <InputLabel htmlFor="note" value="Catatan (Opsional)" />
            <textarea
              id="note"
              value={data.note}
              onChange={(e) => setData("note", e.target.value)}
              className="w-full border rounded p-2 text-sm"
              rows={3}
            />
            <p className="text-sm text-red-500">{errors.note}</p>
          </div>

          <div className="flex justify-end">
            <Button type="primary" disabled={processing} isLoading={processing}>
              Simpan Transaksi
            </Button>
          </div>
        </form>
      </div>
    </AuthenticatedLayout>
  );
}
