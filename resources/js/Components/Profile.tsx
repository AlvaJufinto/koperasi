import LazyImage from "./LazyImage";

interface User {
  name: string;
  profile_picture?: string | null;
}

interface ProfileProps {
  user?: User;
}

export default function Profile({ user }: ProfileProps) {
  const ASSET_URL = import.meta.env.VITE_PUBLIC_ASSET_URL;

  return (
    <div className="flex items-center font-secondary">
      {user?.profile_picture ? (
        <LazyImage
          className="!size-10 rounded-full mr-2"
          src={`${ASSET_URL}/uploads/${user.profile_picture}`}
          alt=""
        />
      ) : (
        <img
          className="size-10 rounded-full mr-2 object-fill"
          src="https://fisika.uad.ac.id/wp-content/uploads/blank-profile-picture-973460_1280.png"
          alt=""
        />
      )}

      {user?.name}
    </div>
  );
}
