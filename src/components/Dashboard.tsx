"use client"

import { useState } from "react"
import TransactionForm from "./TransactionForm"
import TransactionList from "./TransactionList"
import Summary from "./Summary"
import BarChart from "./Charts/BarChart"
import PieChart from "./Charts/PieChart"
import DateRangePicker from "./DateRangePicker"
import { useTransactions } from "@/context/TransactionContext"

export default function Dashboard() {
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingTransaction, setEditingTransaction] = useState(null)
    const { filteredTransactions } = useTransactions()

    const openForm = (transaction = null) => {
        setEditingTransaction(transaction)
        setIsFormOpen(true)
    }

    const closeForm = () => {
        setEditingTransaction(null)
        setIsFormOpen(false)
    }

    return (
        <div className="max-w-7xl mx-auto">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-blue-700">Expense Tracker</h1>
                <p className="text-gray-600">Keep track of your income expenses</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <Summary />
            </div>

            <div className="mb-6 flex flex-wrap gap-4 justify-between items-center">
                <button
                    onClick={() => openForm()}
                    className="bg-blue-600 hober:bg-blue-700 text-white font-medium py-2 px-4 rounded-md flex items-center"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                    </svg>
                    Add Transaction
                </button>
                <DateRangePicker />
            </div>

            {isFormOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
                        <TransactionForm 
                            onClose={closeForm}
                            transaction={editingTransaction}
                        />
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4">Monthly Overview</h2>
                    <div className="h-64">
                        <BarChart />
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4">Category Breakdown</h2>
                    <div className="h-64">
                        <PieChart />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
                <h2 className="text-xl font-semibold mb-4">Transactions</h2>
                <TransactionList onEdit={openForm} />
            </div>
        </div>
    )
}