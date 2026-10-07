import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { selectRoleAction } from "@/app/actions";
import OnboardingFlow from "@/components/OnboardingFlow";

export default async function OnboardingPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");


  return (
    <main className="min-h-[calc(100vh-8rem)] flex items-center justify-center py-10 bg-[#09090b]">
      <OnboardingFlow
        username={user.username}
        onChooseRole={selectRoleAction}
      />
    </main>
  );
}
