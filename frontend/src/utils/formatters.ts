import { format, formatDistanceToNow, parseISO, isValid } from 'date-fns'

export function formatDate(
  date: string | Date,
  formatStr: string = 'dd/MM/yyyy'
) {
  if (!date) return ''

  const dateObj = typeof date === 'string' ? parseISO(date) : date
  if (!isValid(dateObj)) return ''

  return format(dateObj, formatStr)
}

export function formatRelativeTime(date: string | Date) {
  if (!date) return ''

  const dateObj = typeof date === 'string' ? parseISO(date) : date
  if (!isValid(dateObj)) return ''

  return formatDistanceToNow(dateObj, { addSuffix: true })
}

export function formatCurrency(
  amount: string | number,
  currency: 'USD' | 'INR' = 'INR'
) {
  if (amount === null || amount === undefined) return ''

  const num =
    typeof amount === 'string'
      ? parseFloat(amount.replace(/[^0-9.-]+/g, ''))
      : amount

  if (isNaN(num)) return amount.toString()

  return new Intl.NumberFormat(
    currency === 'INR' ? 'en-IN' : 'en-US',
    {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }
  ).format(num)
}