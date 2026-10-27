"use client";

import ResourceDeleteButton from "@/components/admin/ResourceDeleteButton";
import {
  AdminResourceDrawer,
  NewResourceButton,
  openAdminResourceDrawer,
} from "@/components/admin/AdminResourceDrawer";
import { RESOURCE_CATEGORY_META } from "@/lib/resources/constants";
import type { Resource } from "@/types/database";

export { NewResourceButton };

export default function AdminResourcesClient({
  resources,
}: {
  resources: Resource[];
}) {
  return (
    <>
      <div className="admin-card admin-card--flush">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {resources.map((r) => (
                <tr key={r.id}>
                  <td>
                    <button
                      type="button"
                      className="admin-link-btn"
                      onClick={() =>
                        openAdminResourceDrawer({ mode: "edit", resource: r })
                      }
                    >
                      {r.title}
                    </button>
                    <div className="admin-td-sub">{r.vertical}</div>
                  </td>
                  <td>
                    {RESOURCE_CATEGORY_META[r.category]?.label ?? r.category}
                  </td>
                  <td>
                    <span className={`admin-badge ${r.status}`}>{r.status}</span>
                  </td>
                  <td>
                    <div className="admin-row-actions">
                      <button
                        type="button"
                        className="btn btn-solid"
                        onClick={() =>
                          openAdminResourceDrawer({ mode: "edit", resource: r })
                        }
                      >
                        Edit
                      </button>
                      <ResourceDeleteButton id={r.id} title={r.title} />
                    </div>
                  </td>
                </tr>
              ))}
              {resources.length === 0 && (
                <tr>
                  <td colSpan={4} className="admin-empty">
                    No resources yet.{" "}
                    <NewResourceButton className="admin-link-btn">
                      Create the first one
                    </NewResourceButton>
                    .
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <AdminResourceDrawer />
    </>
  );
}
