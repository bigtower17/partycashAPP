import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import api from '@/lib/api' // usa axios preconfigurato con Bearer token

export function ExportReports() {
  const [loading, setLoading] = useState<string | null>(null)


  const handleExport = async (type: 'csv' | 'pdf', report: 'operations' | 'locations') => {
    try {
      setLoading(`${report}-${type}`)
  
      // Chiedi al backend di generare il link firmato
      const response = await api.post('/export/generate-url', { report, type })
      const downloadUrl = response.data.url
  
      // Apri il link con token già incluso
      window.open(downloadUrl, '_blank')
    } catch (err) {
      console.error('Errore generazione URL firmato:', err)
      alert('Errore durante l\'esportazione')
    } finally {
      setTimeout(() => setLoading(null), 1500)
    }
  }
  

  const isLoading = (report: string, type: string) => loading === `${report}-${type}`

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-bold">Esporta Report</h2>

      <div>
        <h3 className="font-semibold mb-2">Operazioni</h3>
        <div className="flex gap-2">
          <Button onClick={() => handleExport('csv', 'operations')} disabled={isLoading('operations', 'csv')}>
            {isLoading('operations', 'csv') && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            CSV
          </Button>
          <Button onClick={() => handleExport('pdf', 'operations')} disabled={isLoading('operations', 'pdf')}>
            {isLoading('operations', 'pdf') && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            PDF
          </Button>
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-2">Report Postazioni</h3>
        <div className="flex gap-2">
          <Button onClick={() => handleExport('csv', 'locations')} disabled={isLoading('locations', 'csv')}>
            {isLoading('locations', 'csv') && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            CSV
          </Button>
          <Button onClick={() => handleExport('pdf', 'locations')} disabled={isLoading('locations', 'pdf')}>
            {isLoading('locations', 'pdf') && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            PDF
          </Button>
        </div>
      </div>
    </div>
  )
}
