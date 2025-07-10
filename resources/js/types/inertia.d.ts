// types/inertia.d.ts
import { PageProps as InertiaPageProps } from "@inertiajs/inertia";

export interface PageProps extends InertiaPageProps {
  auth: {
    user: {
      id: number;
      name: string;
      email: string;
      profile_picture?: string | null;
      // ... other fields
    };
  };
  permissions: {
    allowToSeeWartaMinggu: boolean;
    allowToSeeAllTerritorial: boolean;
    allowToSeeAllPengurus: boolean;
    allowToSeeAllBidang: boolean;
    allowToSeeDPH: boolean;
  };
  impersonating?: boolean;
  // tambahkan field lain jika perlu
}
