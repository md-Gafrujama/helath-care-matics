export default function AdminLoading() {
  return (
    <div className="admin-route-loading" aria-busy="true" aria-live="polite">
      <div className="admin-route-loading-card">
        <span className="hm-spinner" aria-hidden />
        <p>Loading…</p>
      </div>
      <div className="admin-route-skeleton">
        <div className="admin-skel admin-skel-lg" />
        <div className="admin-skel" />
        <div className="admin-skel" />
        <div className="admin-skel admin-skel-wide" />
      </div>
    </div>
  );
}
