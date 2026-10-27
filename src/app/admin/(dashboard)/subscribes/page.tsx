import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { deleteSubscriber } from "@/lib/actions/resources";
import {
  formatAdminSourceLabel,
  parseLeadSourceNote,
  type LeadSource,
} from "@/lib/resources/lead-source";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Subscriber } from "@/types/database";

function resolveSource(row: Subscriber): LeadSource | null {
  if (row.source_type) {
    return {
      type: row.source_type,
      slug: row.source_slug ?? null,
      title: row.source_title ?? null,
    };
  }
  return parseLeadSourceNote(row.unsubscribe_reason).source;
}

export default async function AdminSubscribesPage() {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("subscribers")
    .select("*")
    .order("created_at", { ascending: false });

  const rows = (data ?? []) as Subscriber[];

  return (
    <>
      <AdminPageHeader
        kicker="Audience"
        title="Subscribes"
        description={`${rows.length} email${rows.length === 1 ? "" : "s"} captured from the public site.`}
      />

      {error && (
        <p className="admin-empty" style={{ marginBottom: 16 }}>
          Could not load subscribes ({error.message}).
        </p>
      )}

      <div className="admin-card admin-card--flush">
        <div className="admin-table-wrap admin-table-scroll">
          <table className="admin-table admin-table--sticky">
            <thead>
              <tr>
                <th>Email</th>
                <th>Which page</th>
                <th>Status</th>
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
                  <td>{formatAdminSourceLabel(resolveSource(row))}</td>
                  <td>
                    <span
                      className={`admin-badge ${row.unsubscribed_at ? "draft" : "published"}`}
                    >
                      {row.unsubscribed_at ? "Opt out" : "Subscribed"}
                    </span>
                  </td>
                  <td className="admin-td-now">
                    {new Date(row.created_at).toLocaleString()}
                  </td>
                  <td>
                    <form action={deleteSubscriber.bind(null, row.id)}>
                      <button type="submit" className="btn btn-ghost">
                        Delete
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && !error && (
                <tr>
                  <td colSpan={5} className="admin-empty">
                    No subscribes yet.
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
