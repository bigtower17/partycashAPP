import { Button } from '@/components/ui/button'

export function ExportReports() {
  const handleExport = (type: 'csv' | 'pdf', report: 'operations' | 'locations') => {
    const url = `/export/${report}/${type}`
    // Opens in a new tab; adjust if needed for your app.
    window.open(url, '_blank')
  }

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-bold">Export Reports</h2>
      <div>
        <h3 className="font-semibold mb-2">Operations Report</h3>
        <div className="flex gap-2">
          <Button onClick={() => handleExport('csv', 'operations')}>Export CSV</Button>
          <Button onClick={() => handleExport('pdf', 'operations')}>Export PDF</Button>
        </div>
      </div>
      <div>
        <h3 className="font-semibold mb-2">Locations Report</h3>
        <div className="flex gap-2">
          <Button onClick={() => handleExport('csv', 'locations')}>Export CSV</Button>
          <Button onClick={() => handleExport('pdf', 'locations')}>Export PDF</Button>
        </div>
      </div>
    </div>
  )
}
