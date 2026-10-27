import AdminPageHeader from "@/components/admin/AdminPageHeader";
import ResourceForm from "@/components/admin/ResourceForm";

export default function NewResourcePage() {
  return (
    <>
      <AdminPageHeader
        kicker="Audience"
        title="New resource"
        description="Upload a PDF and cover, then configure the download form."
        backHref="/admin/resources"
        backLabel="Resources"
      />
      <ResourceForm />
    </>
  );
}
