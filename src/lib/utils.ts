import { Transaction, MonthlyDate, CategorySummary } from "./types";

/**
 * Process transactions into monthly date
 */
export function getMonthlyData(transactions: Transaction[]): MonthlyDate[] {
    const monthlyData: Record<string, MonthlyDate> = {}

    transactions.forEach(transaction => {
        const date = new Date(transaction.date)
        const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`

        if (!monthlyData[monthYear]) {
            monthlyData[monthYear] = {
                month: new Date(date.getFullYear(), date.getMonth(), 1)
                    .toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
                income: 0,
                expense: 0
            }
        }

        if (transaction.type === 'income') {
            monthlyData[monthYear].income += transaction.amount
        } else {
            monthlyData[monthYear].expense += transaction.amount
        }
    })

    return Object.values(monthlyData).sort((a, b) => {
        return new Date(a.month).getTime() - new Date(b.month).getTime()
    })
}

/**
 * Format currency
 */
export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount)
}

/**
 * Formate date
 */
export function formatDate(dateString: string): string {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    })
}

/**
 * Group transactions by category
 */
export function getCategorySummary(
    transactions: Transaction[],
    categoryType: 'income' | 'expense',
    categoryMap: Record<string, { name: string; color: string }>
): CategorySummary[] {
    const filteredTransactions = transactions.filter(t => t.type === categoryType)
    const categorySummary: Record<string, CategorySummary> = {}

    filteredTransactions.forEach(transaction => {
        const category = categoryMap[transaction.categoryId]

        if (!category) return

        if (!categorySummary[transaction.categoryId]) {
            categorySummary[transaction.categoryId] = {
                categoryId: transaction.categoryId,
                categoryName: category.name,
                amount: 0,
                color: category.color
            }
        }

        categorySummary[transaction.categoryId].amount += transaction.amount
    })

    return Object.values(categorySummary).sort((a, b) => b.amount - a.amount)
}

/**
 * Get month range
 * Returns an array of dates for the last x months
 */
export function getMonthRange(months: number): string[] {
    const dates: string[] = []
    const today = new Date()

    for (let i = 0; i < months; i++) {
        const date = new Date(today.getFullYear(), today.getMonth() - i, 1)
        dates.push(date.toISOString().split('T')[0])
    }

    return dates.reverse()
}