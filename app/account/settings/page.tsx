import ProfileUpdateForm from "@/components/account/settings/ProfileUpdateForm";
import { Card, CardContent } from "@/components/ui/card";
import { fetcher } from "@/lib/fetcher";

export default async function ProfilePage() {
  const userData = await fetcher("/user-profile");

  return (
    <div className="px-2">
      <div className="w-full flex justify-center py-2 bg-white rounded-sm max-md:mb-22">
        <Card className="w-full max-w-4xl rounded-2xl shadow-none border-none">
          <CardContent>
            <ProfileUpdateForm user={userData} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
