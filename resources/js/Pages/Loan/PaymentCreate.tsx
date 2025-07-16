import { useCallback, useEffect, useState } from "react";

import Button from "@/Components/Button";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { formatRupiah } from "@/utils";
import { Head, router, useForm } from "@inertiajs/react";

// Proper TypeScript interfaces
interface User {
  id: number;
  name: string;
  email: string;
}

interface Loan {
  id: number;
  user: User;
  principal: number;
  remaining_amount: number;
  installment_amount: number;
  interest: number;
  duration_months: number;
  created_at: string;
}

interface Auth {
  user: User;
}

interface PaymentFormData {
  date: string;
  amount: string;
  note: string;
}

interface PaymentCreateProps {
  auth: Auth;
  loan: Loan;
  installment_number: number;
}

interface ValidationErrors {
  date?: string;
  amount?: string;
  note?: string;
}

export default function PaymentCreate({
  auth,
  loan,
  installment_number,
}: PaymentCreateProps) {
  const [payoff, setPayoff] = useState<boolean>(false);
  const [monthlyInterest, setMonthlyInterest] = useState<number>(0);
  const [clientErrors, setClientErrors] = useState<ValidationErrors>({});

  const { data, setData, post, processing, errors } = useForm<PaymentFormData>({
    date: new Date().toISOString().slice(0, 10),
    amount: "",
    note: "",
  });

  // Utility function untuk parse number dengan handling decimal yang proper
  const parseAmount = useCallback((value: string): number => {
    const cleanValue = value.replace(/[^\d.-]/g, "");
    const parsed = parseFloat(cleanValue);
    return isNaN(parsed) ? 0 : Math.round(parsed);
  }, []);

  // Hitung interest dari principal (total pinjaman awal), bukan dari sisa
  const calculateInterest = useCallback(
    (principal: number, interestRate: number): number => {
      return Math.round(principal * (interestRate / 100));
    },
    []
  );

  // Hitung bunga bulanan - fixed dari principal
  useEffect(() => {
    const interest = calculateInterest(loan.principal, loan.interest);
    setMonthlyInterest(interest);
  }, [loan.principal, loan.interest, calculateInterest]);

  // Validasi client-side yang disederhanakan
  const validateForm = useCallback((): boolean => {
    const newErrors: ValidationErrors = {};
    const amount = parseAmount(data.amount);

    // Validasi tanggal
    if (!data.date) {
      newErrors.date = "Tanggal wajib diisi";
    } else {
      const selectedDate = new Date(data.date);
      const maxDate = new Date();
      maxDate.setMonth(maxDate.getMonth() + 1);

      if (selectedDate > maxDate) {
        newErrors.date = "Tanggal tidak boleh lebih dari 1 bulan ke depan";
      }
    }

    // Validasi amount
    if (!data.amount || amount <= 0) {
      newErrors.amount = "Nominal harus lebih dari 0";
    } else if (amount > loan.remaining_amount) {
      newErrors.amount = "Nominal tidak boleh melebihi sisa pinjaman";
    } else if (!payoff && amount > loan.installment_amount * 2) {
      newErrors.amount = "Nominal terlalu besar untuk pembayaran reguler";
    }

    // Validasi note length
    if (data.note && data.note.length > 500) {
      newErrors.note = "Catatan maksimal 500 karakter";
    }

    setClientErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [
    data,
    loan.remaining_amount,
    loan.installment_amount,
    payoff,
    parseAmount,
  ]);

  // Auto-fill amount untuk pelunasan
  useEffect(() => {
    if (payoff) {
      setData("amount", loan.remaining_amount.toString());
    } else {
      setData("amount", "");
    }
  }, [payoff, loan.remaining_amount, setData]);

  // Handle form submission
  const submit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (!validateForm()) {
        return;
      }

      // Convert amount to number before sending
      const formData = {
        ...data,
        amount: parseAmount(data.amount).toString(),
      };

      post(route("loan.payment.store", loan.id), {
        data: formData,
        onSuccess: () => {
          console.log("Payment berhasil disimpan");
        },
        onError: (errors) => {
          console.error("Payment gagal:", errors);
        },
      });
    },
    [data, loan.id, post, validateForm, parseAmount]
  );

  // Handle amount change dengan formatting
  const handleAmountChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      // Allow only numbers
      const sanitizedValue = value.replace(/[^\d]/g, "");
      setData("amount", sanitizedValue);
    },
    [setData]
  );

  // Get error message (prioritize client errors over server errors)
  const getErrorMessage = useCallback(
    (field: keyof ValidationErrors): string => {
      return clientErrors[field] || errors[field] || "";
    },
    [clientErrors, errors]
  );

  // Computed values untuk display
  const currentAmount = parseAmount(data.amount);
  const totalWithInterest = currentAmount + monthlyInterest;
  const remainingAfterPayment = loan.remaining_amount - currentAmount;
  const installmentAmountWithoutInterest =
    loan.installment_amount - monthlyInterest;

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <h2 className="text-xl font-semibold">
          Bayar Pinjaman: {loan.user.name}
        </h2>
      }
    >
      <Head title="Bayar Pinjaman" />

      <div className="max-w-xl mx-auto mt-6 bg-white p-6 rounded-lg shadow-lg space-y-6">
        {/* Back Button */}
        <Button
          type="default"
          onClick={() => router.visit(document.referrer || route("loan.index"))}
        >
          ← Kembali
        </Button>

        {/* Loan Information */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-lg mb-3">Informasi Pinjaman</h3>
          <div className="text-sm space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">Nama:</span>
              <span>{loan.user.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Sisa Pinjaman:</span>
              <span className="font-semibold text-red-600">
                {formatRupiah(loan.remaining_amount)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Angsuran Bulanan:</span>
              <span>{formatRupiah(loan.installment_amount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Bunga per Bulan:</span>
              <span>{loan.interest}%</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Pokok Bulanan:</span>
              <span>{formatRupiah(installmentAmountWithoutInterest)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Angsuran ke:</span>
              <span className="font-semibold">{installment_number}</span>
            </div>
          </div>
        </div>

        <form onSubmit={submit} className="space-y-4">
          {/* Payoff Checkbox */}
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
            <input
              id="payoff"
              type="checkbox"
              checked={payoff}
              onChange={(e) => setPayoff(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <label
              htmlFor="payoff"
              className="text-sm font-medium text-blue-900"
            >
              Pelunasan Sekaligus
            </label>
          </div>

          {/* Date Input */}
          <div>
            <InputLabel htmlFor="date" value="Tanggal Pembayaran" />
            <TextInput
              id="date"
              type="date"
              value={data.date}
              onChange={(e) => setData("date", e.target.value)}
              className="w-full"
              max={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                .toISOString()
                .slice(0, 10)}
            />
            {getErrorMessage("date") && (
              <p className="text-sm text-red-600 mt-1">
                {getErrorMessage("date")}
              </p>
            )}
          </div>

          {/* Amount Input */}
          <div>
            <InputLabel htmlFor="amount" value="Nominal Pokok (Rp)" />
            <TextInput
              id="amount"
              type="text"
              value={data.amount}
              onChange={handleAmountChange}
              disabled={payoff}
              className="w-full"
              placeholder="Masukkan nominal pembayaran"
            />
            {getErrorMessage("amount") && (
              <p className="text-sm text-red-600 mt-1">
                {getErrorMessage("amount")}
              </p>
            )}
            {data.amount && !getErrorMessage("amount") && (
              <p className="text-sm text-gray-600 mt-1">
                Nominal: {formatRupiah(currentAmount)}
              </p>
            )}
          </div>

          {/* Payment Summary */}
          {data.amount && currentAmount > 0 && (
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">
                Ringkasan Pembayaran
              </h4>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span>Pokok:</span>
                  <span>{formatRupiah(currentAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Bunga bulan ini:</span>
                  <span>{formatRupiah(monthlyInterest)}</span>
                </div>
                <div className="flex justify-between border-t pt-1 font-semibold">
                  <span>Total harus dibayar:</span>
                  <span className="text-green-700">
                    {formatRupiah(totalWithInterest)}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Sisa setelah bayar:</span>
                  <span>{formatRupiah(remainingAfterPayment)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Note Input */}
          <div>
            <InputLabel htmlFor="note" value="Catatan (Opsional)" />
            <textarea
              id="note"
              value={data.note}
              onChange={(e) => setData("note", e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              placeholder="Tambahkan catatan pembayaran..."
              maxLength={500}
            />
            <div className="flex justify-between items-center mt-1">
              {getErrorMessage("note") && (
                <p className="text-sm text-red-600">
                  {getErrorMessage("note")}
                </p>
              )}
              <p className="text-xs text-gray-500 ml-auto">
                {data.note.length}/500 karakter
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <Button
              type="primary"
              disabled={processing || !data.amount || currentAmount <= 0}
              isLoading={processing}
              className="px-6 py-2"
            >
              {processing ? "Memproses..." : "Bayar Pinjaman"}
            </Button>
          </div>
        </form>
      </div>
    </AuthenticatedLayout>
  );
}
