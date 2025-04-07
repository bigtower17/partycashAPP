export const formatEuro = (value: number) =>
    new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2
    }).format(value)
  
  export const formatDate = (iso: string) =>
    new Date(iso).toLocaleString('it-IT')
  