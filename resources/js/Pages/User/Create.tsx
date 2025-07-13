import Button from '@/Components/Button';
import InputLabel from '@/Components/InputLabel';
import Select from '@/Components/Select';
import TextInput from '@/Components/TextInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {
	Head,
	Link,
	useForm,
} from '@inertiajs/react';

export default function Create({ auth, statuses, roles }: any) {
  const { data, setData, post, processing, errors } = useForm({
    code: "",
    phone: "",
    name: "",
    email: "",
    address: "",
    join_date: "",
    status_id: "",
    role_id: 1,
    password: "",
  });

  const handleSubmit = (e: any) => {
    e.preventDefault();
    post(route("user.store"));
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={<h2 className="text-xl font-semibold">Tambah Anggota</h2>}
    >
      <Head title="Tambah Anggota" />

      <div
        className="max-w-4xl mx-auto space-y-6 mt-10 bg-white p-6 rounded
        shadow"
      >
        <Link href={route("user.index")} className="w-full h-full">
          <Button type="default">← Kembali</Button>
        </Link>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <InputLabel htmlFor="code" value="Kode" />
              <TextInput
                id="code"
                value={data.code}
                onChange={(e) => setData("code", e.target.value)}
              />
              <p className="text-red-500 text-sm">{errors.code}</p>
            </div>

            <div>
              <InputLabel htmlFor="phone" value="No HP" />
              <TextInput
                id="phone"
                value={data.phone}
                onChange={(e) => setData("phone", e.target.value)}
              />
              <p className="text-red-500 text-sm">{errors.phone}</p>
            </div>

            <div className="col-span-2">
              <InputLabel htmlFor="name" value="Nama Lengkap" />
              <TextInput
                id="name"
                className="w-1/2"
                value={data.name}
                onChange={(e) => setData("name", e.target.value)}
              />
              <p className="text-red-500 text-sm">{errors.name}</p>
            </div>

            <div className="col-span-2">
              <InputLabel htmlFor="email" value="Email (Opsional)" />
              <TextInput
                id="email"
                value={data.email}
                className="w-1/2"
                onChange={(e) => setData("email", e.target.value)}
              />
              <p className="text-red-500 text-sm">{errors.email}</p>
            </div>

            <div className="col-span-2">
              <InputLabel htmlFor="address" value="Alamat" />
              <TextInput
                id="address"
                value={data.address}
                className="w-1/2"
                onChange={(e) => setData("address", e.target.value)}
              />
              <p className="text-red-500 text-sm">{errors.address}</p>
            </div>

            <div>
              <InputLabel htmlFor="join_date" value="Tanggal Bergabung" />
              <TextInput
                id="join_date"
                type="date"
                value={data.join_date}
                className="w-1/2"
                onChange={(e) => setData("join_date", e.target.value)}
              />
              <p className="text-red-500 text-sm">{errors.join_date}</p>
            </div>

            <div>
              <InputLabel htmlFor="status_id" value="Status" />
              <Select
                id="status_id"
                value={data.status_id}
                onChange={(e) => setData("status_id", e.target.value)}
              >
                <option value="">Pilih Status</option>
                {statuses.map((s: any) => (
                  <option key={s.id} value={s.id}>
                    {s.code}
                  </option>
                ))}
              </Select>
              <p className="text-red-500 text-sm">{errors.status_id}</p>
            </div>
            {/*
          <div>
            <InputLabel htmlFor="role_id" value="Role" />
            <Select
              id="role_id"
              value={data.role_id}
              onChange={(e) => setData("role_id", e.target.value)}
            >
              <option value="">Pilih Role</option>
              {roles.map(
                (role: any) =>
                  role.id != 1 && (
                    <option key={role.id} value={role.id}>
                      {role.code}
                    </option>
                  )
              )}
            </Select>
            <p className="text-red-500 text-sm">{errors.role_id}</p>
          </div>*/}

            <div>
              <InputLabel htmlFor="password" value="Password" />
              <TextInput
                id="password"
                type="password"
                value={data.password}
                className="w-full"
                onChange={(e) => setData("password", e.target.value)}
              />
              <p className="text-red-500 text-sm">{errors.password}</p>
            </div>
          </div>
          <div className="flex justify-end">
            <Button type="primary" disabled={processing} isLoading={processing}>
              Simpan
            </Button>
          </div>
        </form>
      </div>
    </AuthenticatedLayout>
  );
}
