/**
 * Export -- registered in the main sidebar now; the Sales Report, Items Sold
 * Report and All Reports XLSX downloads are built in the Export step.
 */
export function ExportPage() {
  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Export</h1>
          <p className="page-desc">Download Sales, Items Sold, and combined reports as XLSX for any date range.</p>
        </div>
      </div>
      <div className="banner-not-connected">Report downloads are being set up and will appear here next.</div>
    </div>
  );
}
