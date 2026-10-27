import { notFound } from "next/navigation";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import ResourceForm from "@/components/admin/ResourceForm";
import { getAdminResource } from "@/lib/resources/queries";

export default async function EditResourcePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const resource = await getAdminResource(id);
  if (!resource) notFound();

  return (
    <>
      <AdminPageHeader
        kicker="Audience"
        title="Edit resource"
        description={resource.title}
        backHref="/admin/resources"
        backLabel="Resources"
      />
      <ResourceForm resource={resource} />
    </>
  );
}
