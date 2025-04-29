"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { v4 as uuidv4 } from 'uuid'
import { Transaction, Category, TransactionType, DateRange } from "@/lib/types";

const defaultCategories: Category[] = [
    { id: 'salary', name: 'Salary', type: 'income', color: '#4CAF50' },
    { id: 'freelance', name: 'Freelance', type: 'income', color: '#8BC34A' },
    { id: 'investmant', name: 'Investment', type: 'income', color: '#CDDC39' },
    { id: 'food', name: 'Food', type: 'expense', color: '#FF5722' },
    { id: 'transport', name: 'Transport', type: 'expense', color: '#FF9800' },
    { id: 'entertainment', name: 'Entertainment', type: 'expense', color: '#F44336' },
    { id: 'utilities', name: 'Utilities', type: 'expense', color: '#9C27B0' },
    { id: 'shopping', name: 'Shopping', type: 'expense', color: '#E91E63' },
]

interface TransactionContextType {
    transactions: Transaction[]
    categories: Category[]
    dateRange: DateRange | null
    addTransaction: (transaction: Omit<Transaction, 'id'>) => void
    updateTransaction: (transaction: Transaction) => void
    deleteTransaction: (id: string) => void
    setDateRangeFilter: (range: DateRange | null) => void
    filteredTransactions: Transaction[]
    totalIncome: number
    totalExpense: number
    balance: number 
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined)

export function TransactionProvider({ children }: { children: ReactNode }) {
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [categories, setCategories] = useState<Category[]>(defaultCategories)
    const [dateRange, setDateRange] = useState<DateRange | null>(null)

    useEffect(() => {
        const savedTransactions = localStorage.getItem('transactions')
        const savedCategories = localStorage.getItem('categories')

        if (savedTransactions) {
            setTransactions(JSON.parse(savedTransactions))
        }

        if (savedCategories) {
            setCategories(JSON.parse(savedCategories))
        } else {
            localStorage.setItem('categories', JSON.stringify(defaultCategories))
        }
    }, [])

    useEffect(() => {
        localStorage.setItem('transactions', JSON.stringify(transactions))
    }, [transactions])

    useEffect(() => {
        localStorage.setItem('categories', JSON.stringify(categories))
    }, [categories])

    const filteredTransactions = dateRange
    ? transactions.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        const start = new Date(dateRange.startDate);
        const end = new Date(dateRange.endDate);
        return transactionDate >= start && transactionDate <= end;
      })
    : transactions;

    const totalIncome = filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)

    const totalExpense = filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)

    const balance = totalIncome - totalExpense

    const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
        const newTransaction = {
            ...transaction,
            id: uuidv4()
        }
        setTransactions(prev => [...prev, newTransaction])
    }

    const updateTransaction = (transaction: Transaction) => {
        setTransactions(prev => 
            prev.map(t => t.id === transaction.id ? transaction : t)
        )
    }

    const deleteTransaction = (id: string) => {
        setTransactions(prev => prev.filter(t => t.id !== id))
    }

    const setDateRangeFilter = (range: DateRange | null) => {
        setDateRange(range)
    }

    const value = {
        transactions,
        categories,
        dateRange,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        setDateRangeFilter,
        filteredTransactions,
        totalIncome,
        totalExpense,
        balance
    }

    return (
        <TransactionContext.Provider value={value}>
            {children}
        </TransactionContext.Provider>
    )
}
 
export function useTransactions() {
    const context = useContext(TransactionContext)
    if (context === undefined) {
        throw new Error('useTransactions must be used within a TransactionProvider')
    }
    return context
}