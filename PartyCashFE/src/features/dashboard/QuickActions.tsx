import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'

export function QuickActions() {
  const navigate = useNavigate()

  return (
    <div className="flex gap-4">
      <Button size="lg" variant="outline" onClick={() => navigate('/deposit')}>💸 Scarico</Button>
      <Button size="lg"variant="outline" onClick={() => navigate('/quotes')}>📤 Pagamenti</Button>
    </div>
  )
}
