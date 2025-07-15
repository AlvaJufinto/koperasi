import { useCallback, useEffect, useMemo, useState } from "react";

import Button from "@/Components/Button";
import InputLabel from "@/Components/InputLabel";
import Select from "@/Components/Select";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { formatRupiah } from "@/utils";
import { Head, Link, useForm } from "@inertiajs/react";

// TypeScript Interfaces
interface User {
  id: number;
  code: string;
  name: string;
  email: string;
}

interface SavingType {
  id: number;
  code: string;
  name: string;
  description?: string;
  is_withdrawal?: boolean;
  minimum_amount?: number;
  maximum_amount?: number;
}

interface Balance {
  user_id: number;
  ss: number;
  sp: number;
  sw: number;
  total: number;
}

interface Auth {
  user: User;
}

interface SavingFormData {
  user_id: string;
  saving_type_id: string;
  date: string;
  amount: string;
  note: string;
}

interface CreateProps {
  auth: Auth;
  users: User[];
  savingTypes: SavingType[];
  balances: Balance[];
}

interface ValidationErrors {
  user_id?: string;
  saving_type_id?: string;
  date?: string;
  amount?: string;
  note?: string;
}

// Saving type codes enum
enum SavingTypeCodes {
  SS = "SS",
  SP = "SP",
  SW = "SW",
  TARIK_SS = "TARIK_SS",
  TARIK_SP = "TARIK_SP",
  TARIK_SW = "TARIK_SW",
}

export default function Create({
  auth,
  users,
  savingTypes,
  balances,
}: CreateProps) {
  const [selectedType, setSelectedType] = useState<string>("");
  const [clientErrors, setClientErrors] = useState<ValidationErrors>({});
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const { data, setData, post, processing, errors } = useForm<SavingFormData>({
    user_id: "",
    saving_type_id: "",
    date: new Date().toISOString().slice(0, 10),
    amount: "",
    note: "",
  });

  const parseAmount = useCallback((value: string): number => {
    const cleanValue = value.replace(/[^\d.-]/g, "");
    const parsed = parseFloat(cleanValue);
    return isNaN(parsed) ? 0 : Math.round(parsed);
  }, []);

  // Get current user balance
  const currentBalance = useMemo(() => {
    if (!data.user_id) return { ss: 0, sp: 0, sw: 0, total: 0 };

    const userBalance = balances.find(
      (b) => b.user_id === parseInt(data.user_id)
    );
    return userBalance || { ss: 0, sp: 0, sw: 0, total: 0 };
  }, [balances, data.user_id]);

  // Get selected saving type details
  const selectedSavingType = useMemo(() => {
    if (!data.saving_type_id) return null;
    return (
      savingTypes.find((t) => t.id === parseInt(data.saving_type_id)) || null
    );
  }, [savingTypes, data.saving_type_id]);

  // Check saving type characteristics
  const savingTypeInfo = useMemo(() => {
    return {
      isTarikSS: selectedType === SavingTypeCodes.TARIK_SS,
      isTarikSP: selectedType === SavingTypeCodes.TARIK_SP,
      isTarikSW: selectedType === SavingTypeCodes.TARIK_SW,
      isSS: selectedType === SavingTypeCodes.SS,
      isSP: selectedType === SavingTypeCodes.SP,
      isSW: selectedType === SavingTypeCodes.SW,
      isWithdrawal: selectedType.includes("TARIK_"),
      isDeposit: !selectedType.includes("TARIK_") && selectedType !== "",
    };
  }, [selectedType]);

  // Get available balance for withdrawal
  const getAvailableBalance = useCallback((): number => {
    switch (selectedType) {
      case SavingTypeCodes.TARIK_SS:
        return currentBalance.ss;
      case SavingTypeCodes.TARIK_SP:
        return currentBalance.sp;
      case SavingTypeCodes.TARIK_SW:
        return currentBalance.sw;
      default:
        return 0;
    }
  }, [selectedType, currentBalance]);

  // Validation function
  const validateForm = useCallback((): boolean => {
    const newErrors: ValidationErrors = {};
    const amount = parseAmount(data.amount);
    const availableBalance = getAvailableBalance();

    // Validate user selection
    if (!data.user_id) {
      newErrors.user_id = "Anggota harus dipilih";
    }

    // Validate saving type
    if (!data.saving_type_id) {
      newErrors.saving_type_id = "Jenis simpanan harus dipilih";
    }

    // Validate date
    if (!data.date) {
      newErrors.date = "Tanggal harus diisi";
    } else {
      const selectedDate = new Date(data.date);
      const today = new Date();
      const futureLimit = new Date();
      futureLimit.setMonth(futureLimit.getMonth() + 1);

      if (selectedDate > futureLimit) {
        newErrors.date = "Tanggal tidak boleh lebih dari 1 bulan ke depan";
      }
    }

    // Validate amount
    if (!data.amount || amount <= 0) {
      newErrors.amount = "Nominal harus lebih dari 0";
    } else {
      // Check minimum amount if specified
      if (
        selectedSavingType?.minimum_amount &&
        amount < selectedSavingType.minimum_amount
      ) {
        newErrors.amount = `Nominal minimal ${formatRupiah(
          selectedSavingType.minimum_amount
        )}`;
      }

      // Check maximum amount if specified
      if (
        selectedSavingType?.maximum_amount &&
        amount > selectedSavingType.maximum_amount
      ) {
        newErrors.amount = `Nominal maksimal ${formatRupiah(
          selectedSavingType.maximum_amount
        )}`;
      }

      // Check withdrawal limits
      if (savingTypeInfo.isWithdrawal) {
        if (amount > availableBalance) {
          newErrors.amount = `Saldo tidak mencukupi. Maksimal ${formatRupiah(
            availableBalance
          )}`;
        }
        if (availableBalance === 0) {
          newErrors.amount = "Saldo tidak mencukupi untuk penarikan";
        }
      }

      // Check reasonable limits for deposits
      if (savingTypeInfo.isDeposit && amount > 100000000) {
        // 100 juta
        newErrors.amount = "Nominal terlalu besar untuk sekali setor";
      }
    }

    // Validate note length
    if (data.note && data.note.length > 500) {
      newErrors.note = "Catatan maksimal 500 karakter";
    }

    setClientErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [
    data,
    selectedSavingType,
    savingTypeInfo,
    getAvailableBalance,
    parseAmount,
    formatRupiah,
  ]);

  // Handle type change
  const handleTypeChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const typeId = e.target.value;
      setData("saving_type_id", typeId);

      if (typeId) {
        const type = savingTypes.find((t) => t.id === parseInt(typeId));
        setSelectedType(type?.code || "");
      } else {
        setSelectedType("");
      }

      // Clear amount when changing type
      setData("amount", "");
    },
    [savingTypes, setData]
  );

  // Handle user change
  const handleUserChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const userId = e.target.value;
      setData("user_id", userId);

      if (userId) {
        const user = users.find((u) => u.id === parseInt(userId));
        setSelectedUser(user || null);
      } else {
        setSelectedUser(null);
      }
    },
    [users, setData]
  );

  // Handle amount change with formatting
  const handleAmountChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      const sanitizedValue = value.replace(/[^\d]/g, "");
      setData("amount", sanitizedValue);
    },
    [setData]
  );

  // Handle form submission
  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (!validateForm()) {
        return;
      }

      const formData = {
        ...data,
        amount: parseAmount(data.amount).toString(),
      };

      post(route("saving.store"), {
        data: formData,
        onSuccess: () => {
          console.log("Simpanan berhasil disimpan");
        },
        onError: (errors) => {
          console.error("Simpanan gagal:", errors);
        },
      });
    },
    [data, post, validateForm, parseAmount]
  );

  // Get error message (prioritize client errors)
  const getErrorMessage = useCallback(
    (field: keyof ValidationErrors): string => {
      return clientErrors[field] || errors[field] || "";
    },
    [clientErrors, errors]
  );

  // Get transaction label
  const getTransactionLabel = useCallback((): string => {
    if (savingTypeInfo.isWithdrawal) {
      return "Penarikan";
    } else if (savingTypeInfo.isDeposit) {
      return "Setoran";
    }
    return "Simpanan";
  }, [savingTypeInfo]);

  // Effect to validate on data changes
  useEffect(() => {
    if (data.user_id || data.saving_type_id || data.amount || data.date) {
      validateForm();
    }
  }, [data, validateForm]);

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={<h2 className="text-xl font-semibold">Setor/Tarik Simpanan</h2>}
    >
      <Head title="Tambah Simpanan" />

      <div className="max-w-2xl mx-auto mt-8 bg-white p-6 rounded-lg shadow-lg space-y-6">
        {/* Back Button */}
        <div>
          <Link href={route("saving.index")}>
            <Button type="default" className="flex items-center gap-2">
              <span>←</span> Kembali
            </Button>
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* User Selection */}
          <div>
            <InputLabel htmlFor="user_id" value="Anggota" />
            <Select
              id="user_id"
              value={data.user_id}
              onChange={handleUserChange}
              className="w-full"
            >
              <option value="">Pilih Anggota</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.code} - {user.name}
                </option>
              ))}
            </Select>
            {getErrorMessage("user_id") && (
              <p className="text-sm text-red-600 mt-1">
                {getErrorMessage("user_id")}
              </p>
            )}
          </div>

          {/* Saving Type Selection */}
          <div>
            <InputLabel htmlFor="saving_type_id" value="Jenis Simpanan" />
            <Select
              id="saving_type_id"
              value={data.saving_type_id}
              onChange={handleTypeChange}
              className="w-full"
            >
              <option value="">Pilih Jenis</option>
              {savingTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.code} - {type.name}
                </option>
              ))}
            </Select>
            {getErrorMessage("saving_type_id") && (
              <p className="text-sm text-red-600 mt-1">
                {getErrorMessage("saving_type_id")}
              </p>
            )}
          </div>

          {/* Balance Information for Withdrawals */}
          {savingTypeInfo.isWithdrawal && selectedUser && (
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">
                Informasi Saldo
              </h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Saldo SS:</span>
                  <span className="font-semibold">
                    {formatRupiah(currentBalance.ss)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Saldo SP:</span>
                  <span className="font-semibold">
                    {formatRupiah(currentBalance.sp)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Saldo SW:</span>
                  <span className="font-semibold">
                    {formatRupiah(currentBalance.sw)}
                  </span>
                </div>
                <div className="flex justify-between border-t pt-1">
                  <span>Saldo yang dapat ditarik:</span>
                  <span className="font-bold text-blue-700">
                    {formatRupiah(getAvailableBalance())}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Date Input */}
          <div>
            <InputLabel htmlFor="date" value="Tanggal Transaksi" />
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
            <InputLabel
              htmlFor="amount"
              value={`Nominal ${getTransactionLabel()} ${
                selectedType ? `(${selectedType})` : ""
              }`}
            />
            <TextInput
              id="amount"
              type="text"
              value={data.amount}
              onChange={handleAmountChange}
              className="w-full"
              placeholder={`Masukkan nominal ${getTransactionLabel().toLowerCase()}`}
            />
            {getErrorMessage("amount") && (
              <p className="text-sm text-red-600 mt-1">
                {getErrorMessage("amount")}
              </p>
            )}

            {/* Amount formatting preview */}
            {data.amount && !getErrorMessage("amount") && (
              <p className="text-sm text-gray-600 mt-1">
                Nominal: {formatRupiah(parseAmount(data.amount))}
              </p>
            )}

            {/* Withdrawal limits */}
            {savingTypeInfo.isWithdrawal && (
              <p className="text-xs text-gray-500 mt-1">
                Penarikan maksimal {formatRupiah(getAvailableBalance())}
              </p>
            )}

            {/* Saving type limits */}
            {selectedSavingType && (
              <div className="text-xs text-gray-500 mt-1 space-y-1">
                {selectedSavingType.minimum_amount && (
                  <p>
                    Minimal: {formatRupiah(selectedSavingType.minimum_amount)}
                  </p>
                )}
                {selectedSavingType.maximum_amount && (
                  <p>
                    Maksimal: {formatRupiah(selectedSavingType.maximum_amount)}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Transaction Summary */}
          {data.amount && parseAmount(data.amount) > 0 && selectedUser && (
            <div
              className={`p-4 rounded-lg ${
                savingTypeInfo.isWithdrawal
                  ? "bg-red-50 border border-red-200"
                  : "bg-green-50 border border-green-200"
              }`}
            >
              <h4
                className={`font-semibold mb-2 ${
                  savingTypeInfo.isWithdrawal
                    ? "text-red-900"
                    : "text-green-900"
                }`}
              >
                Ringkasan {getTransactionLabel()}
              </h4>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span>Anggota:</span>
                  <span>
                    {selectedUser.code} - {selectedUser.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Jenis:</span>
                  <span>{selectedSavingType?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Nominal:</span>
                  <span className="font-semibold">
                    {formatRupiah(parseAmount(data.amount))}
                  </span>
                </div>
                {savingTypeInfo.isWithdrawal && (
                  <div className="flex justify-between">
                    <span>Saldo setelah penarikan:</span>
                    <span className="font-semibold">
                      {formatRupiah(
                        getAvailableBalance() - parseAmount(data.amount)
                      )}
                    </span>
                  </div>
                )}
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
              placeholder="Tambahkan catatan untuk transaksi ini..."
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
              disabled={
                processing ||
                !data.user_id ||
                !data.saving_type_id ||
                !data.amount ||
                parseAmount(data.amount) <= 0
              }
              isLoading={processing}
              className="px-6 py-2"
            >
              {processing
                ? "Memproses..."
                : `${getTransactionLabel()} Simpanan`}
            </Button>
          </div>
        </form>
      </div>
    </AuthenticatedLayout>
  );
}
