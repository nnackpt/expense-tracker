export type TransactionType = 'income' | 'expense'

export interface Category {
    id: string
    name: string
    type: TransactionType
    color: string
}

export interface Transaction {
    id: string
    date: string
    description: string
    amount: number
    type: TransactionType
    categoryId: string
}

export interface TransactionWithCategory extends Transaction {
    category: Category
}

export interface DateRange {
    startDate: string
    endDate: string
}

export interface MonthlyDate {
    month: string
    income: number
    expense: number
}

export interface CategorySummary {
    categoryId: string
    categoryName: string
    amount: number
    color: string
}