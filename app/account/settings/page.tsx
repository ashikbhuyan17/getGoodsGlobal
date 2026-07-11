import ProfileUpdateForm from "@/components/account/settings/ProfileUpdateForm";
import { Card, CardContent } from "@/components/ui/card";
import { fetcher } from "@/lib/fetcher";
import { fetchLocations } from "@/lib/locations";

export default async function ProfilePage() {
  const [userData, locations] = await Promise.all([
    fetcher("/user-profile"),
    fetchLocations(),
  ]);

  return (
    <div className="px-2">
      <div className="flex w-full justify-center rounded-sm bg-white py-2 max-md:mb-22">
        <Card className="w-full max-w-4xl rounded-2xl shadow-none border-none">
          <CardContent>
            <ProfileUpdateForm user={userData} locations={locations} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
