"use client"

import { useState, useEffect } from "react"
import { useTransactions } from "@/context/TransactionContext"
import { Transaction, TransactionType } from "@/lib/types"

interface TransactionFormProps {
    onClose: () => void
    transaction?: Transaction | null
}

export default function TransactionForm({ onClose, transaction }: TransactionFormProps) {
    const { addTransaction, updateTransaction, categories } = useTransactions()
    const [date, setDate] = useState(transaction?.date || new Date().toISOString().substring(0, 10))
    const [description, setDescription] = useState(transaction?.description || '')
    const [amount, setAmount] = useState(transaction?.amount.toString() || '')
    const [type, setType] = useState<TransactionType>(transaction?.type || 'expense')
    const [categoryId, setCategoryId] = useState(transaction?.categoryId || '')
    const [errors, setErrors] = useState<Record<string, string>>({})
    const filteredCategories = categories.filter(category => category.type === type)

    useEffect(() => {
        const firstMathingCategory = categories.find(cat => cat.type === type)?.id
        if (firstMathingCategory) {
            setCategoryId(firstMathingCategory)
        }
    }, [type, categories])

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {}

        if (!date) newErrors.date = 'Date is required'
        if (!description) newErrors.description = 'Description is required'
        if (!amount) {
            newErrors.amount = 'Amount is required'
        } else if (isNaN(Number(amount)) || Number(amount) <= 0) {
            newErrors.amount = 'Amount must be a positive number'
        }
        if (!categoryId) newErrors.categoryId = 'Category is required'

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (!validate()) {
            return
        }

        const transactionData = {
            date,
            description,
            amount: Number(amount),
            type,
            categoryId
        }

        if (transaction) {
            updateTransaction({ ...transactionData, id: transaction.id })
        } else {
            addTransaction(transactionData)
        }

        onClose()
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                    {transaction ? 'Edit Transaction' : 'Add Transaction'}
                </h2>
                <button
                    onClick={onClose}
                    className="text-gray-500 hover:text-gray-700"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium mb-1">Type</label>
                    <div className="flex gap-4">
                        <label className="flex items-center">
                            <input 
                                type="radio"
                                value="income"
                                checked={type === 'income'}
                                onChange={() => setType('income')}
                                className="mr-2"
                            />
                            Income
                        </label>
                        <label className="flex items-center">
                            <input 
                                type="radio"
                                value="expense"
                                checked={type === 'expense'}
                                onChange={() => setType('expense')}
                                className="mr-2"
                            />
                            Expense
                        </label>
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium mb-1">Date</label>
                    <input 
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className={`w-full p-2 border rounded ${errors.date ? 'border-red-500' : 'border-gray-300'}`}    
                    />
                    {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium mb-1">Description</label>
                    <input 
                        type="text"
                        placeholder="Enter description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className={`w-full p-2 border rounded ${errors.description ? 'border-red-500' : 'border-gray-300'}`}    
                    />
                    {errors.description && <p className="text-red-500 text-xs mt-1">{errors.descripsion}</p>}
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium mb-1">Amount</label>
                    <input 
                        type="number"
                        step="0.01"
                        placeholder="Enter amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className={`w-full p-2 border rounded ${errors.amount ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount}</p>}
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-medium mb-1">Category</label>
                    <select 
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                        className={`w-full p-2 border rounded ${errors.categoryId ? 'border-red-500' : 'border-gray-300'}`}
                    >
                        <option value="">Select a category</option>
                        {filteredCategories.map(category => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                    {errors.categoryId && <p className="text-red-500 text-xs mt-1">{errors.categoryId}</p>}
                </div>

                <div className="flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        {transaction ? 'Update' : 'Add'}
                    </button>
                </div>
            </form>
        </div>
    )
}