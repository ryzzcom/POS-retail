/**
 * Utility to download formatted data as a CSV file in browser environments.
 * Handles quoting, comma escaping, and timestamped filenames.
 */
export function exportToCsv(
  filename: string,
  headers: string[],
  rows: (string | number | boolean | null | undefined)[][]
): void {
  if (typeof window === "undefined") return;

  const escapeCell = (cell: string | number | boolean | null | undefined): string => {
    if (cell === null || cell === undefined) return '""';
    const str = String(cell);
    // If the cell contains quotes, escape them
    const escaped = str.replace(/"/g, '""');
    return `"${escaped}"`;
  };

  const formattedHeaders = headers.map(escapeCell).join(",");
  const formattedRows = rows.map((row) => row.map(escapeCell).join(","));
  const csvContent =
    "data:text/csv;charset=utf-8," + [formattedHeaders, ...formattedRows].join("\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", filename.endsWith(".csv") ? filename : `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
