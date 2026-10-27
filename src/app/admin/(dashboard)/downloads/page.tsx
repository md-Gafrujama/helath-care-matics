import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { deleteResourceDownload } from "@/lib/actions/resources";
import { listResourceDownloads } from "@/lib/resources/queries";

function fieldText(fields: Record<string, unknown>, key: string): string {
  const v = fields?.[key];
  if (typeof v === "string" && v.trim()) return v;
  if (typeof v === "number") return String(v);
  return "-";
}

export default async function AdminDownloadsPage() {
  const rows = await listResourceDownloads();

  return (
    <>
      <AdminPageHeader
        kicker="Audience"
        title="Downloads"
        description={`${rows.length} download${rows.length === 1 ? "" : "s"} of gated resources.`}
      />

      <div className="admin-card admin-card--flush">
        <div className="admin-table-wrap admin-table-scroll">
          <table className="admin-table admin-table--sticky">
            <thead>
              <tr>
                <th>Email</th>
                <th>Resource</th>
                <th>Zip</th>
                <th>Phone</th>
                <th>Date</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td>
                    <a href={`mailto:${row.email}`}>{row.email}</a>
                  </td>
                  <td>{row.resource?.title ?? "Deleted resource"}</td>
                  <td>{fieldText(row.fields, "zip")}</td>
                  <td>{fieldText(row.fields, "phone")}</td>
                  <td className="admin-td-now">
                    {new Date(row.created_at).toLocaleString()}
                  </td>
                  <td>
                    <form action={deleteResourceDownload.bind(null, row.id)}>
                      <button type="submit" className="btn btn-ghost">
                        Delete
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={6} className="admin-empty">
                    No downloads yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
