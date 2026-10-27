import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminResourcesClient, {
  NewResourceButton,
} from "@/components/admin/AdminResourcesClient";
import { listAdminResources } from "@/lib/resources/queries";

export default async function AdminResourcesPage() {
  const resources = await listAdminResources();

  return (
    <>
      <AdminPageHeader
        kicker="Audience"
        title="Resources"
        description={`${resources.length} resource${resources.length === 1 ? "" : "s"} (white papers, reports, case studies, webinars).`}
        action={<NewResourceButton />}
      />
      <AdminResourcesClient resources={resources} />
    </>
  );
}
