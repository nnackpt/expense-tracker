"use client"

import { useState } from "react"
import { useTransactions } from "@/context/TransactionContext"
import { Transaction } from "@/lib/types"

interface TransactionListProps {
    onEdit: (transaction: Transaction) => void
}

export default function TransactionList({ onEdit }: TransactionListProps) {
    const { filteredTransactions, deleteTransaction, categories } = useTransactions()
    const [sortField, setSortField] = useState<keyof Transaction>('date')
    const [sortDirecion, setSortDirection] = useState<'asc' | 'desc'>('desc')

    const getCategoryName = (categoryId: string) => {
        return categories.find(c => c.id === categoryId)?.name || 'Unknown'
    }

    const sortedTransactions = [...filteredTransactions].sort((a, b) => {
        if (sortField === 'amount') {
            return sortDirecion === 'asc'
                ? a.amount - b.amount
                : b.amount - a.amount
        }

        if (sortField === 'date') {
            return sortDirecion === 'asc'
                ? new Date(a.date).getTime() - new Date(b.date).getTime()
                : new Date(b.date).getTime() - new Date(a.date).getTime()
        }

        const aValue = a[sortField]?.toString().toLowerCase() || ''
        const bValue = b[sortField]?.toString().toLowerCase() || ''

        return sortDirecion === 'asc'
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue)
    })

    const toggleSort = (field: keyof Transaction) => {
        if (sortField === field) {
            setSortDirection(sortDirecion === 'asc' ? 'desc' : 'asc')
        } else {
            setSortField(field)
            setSortDirection('asc')
        }
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString()
    }

    if (sortedTransactions.length === 0) {
        return <p className="text-gray-500 text-center py-8">No transactions to display.</p>
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th
                            onClick={() => toggleSort('date')}
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        >
                            <div className="flex items-center">
                                Date
                                {sortField === 'date' && (
                                    <span className="ml-1">
                                        {sortDirecion === 'asc' ? '↑' : '↓'}
                                    </span>
                                )}
                            </div>
                        </th>
                        <th
                            onClick={() => toggleSort('description')}
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        >
                            <div className="flex items-center">
                                Description
                                {sortField === 'description' && (
                                    <span className="ml-1">
                                        {sortDirecion === 'asc' ? '↑' : '↓'}
                                    </span>
                                )}
                            </div>
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Category
                        </th>
                        <th
                            onClick={() => toggleSort('amount')}
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        >
                            <div className="flex items-center">
                                Amount
                                {sortField === 'amount' && (
                                    <span className="ml-1">
                                        {sortDirecion === 'asc' ? '↑' : '↓'}
                                    </span>
                                )}
                            </div>
                        </th>
                        <th
                            onClick={() => toggleSort('type')}
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        >
                            <div className="flex items-center">
                                Type
                                {sortField === 'type' && (
                                    <span className="ml-1">
                                        {sortDirecion === 'asc' ? '↑' : '↓'}
                                    </span>
                                )}
                            </div>
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {sortedTransactions.map((transaction) => (
                        <tr key={transaction.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {formatDate(transaction.date)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {transaction.description}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {getCategoryName(transaction.categoryId)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <span className={transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}>
                                    ${transaction.amount.toFixed(2)}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    transaction.type === 'income' ? 'bg-green-100 text-green-800' :  'bg-red-100 text-red-800'
                                }`}>
                                    {transaction.type === 'income' ? 'Income' : 'Expense'}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button
                                    onClick={() => onEdit(transaction)}
                                    className="text-blue-600 hover:text-blue-800 mr-4"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => deleteTransaction(transaction.id)}
                                    className="text-red-600 hover:text-red-800"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}