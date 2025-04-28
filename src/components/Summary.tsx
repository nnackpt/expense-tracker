"use client"

import { useTransactions } from "@/context/TransactionContext"

export default function Summary() {
    const { totalIncome, totalExpense, balance } = useTransactions()

    const summaryItems = [
        {
            title: 'Total Income',
            amount: totalIncome,
            color: 'bg-gradient-to-r from-green-400 to-green-600',
            icon: (
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
            )
        },
        {
            title: 'Total Expense',
            amount: totalExpense,
            color: 'bg-gradient-to-r from-red-400 to-red-600',
            icon: (
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"></path>
                </svg>
            )
        },
        {
            title: 'Balance',
            amount: balance,
            color: balance >= 0
                ? 'bg-gradient-to-r from-blue-400 to-blue-600'
                : 'bg-gradient-to-r from-purple-400 to-purple-600',
            icon: (
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlBase="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"></path>
                </svg>
            )
        }
    ]

    return (
        <>
            {summaryItems.map((item, index) => (
                <div
                    key={index}
                    className={`${item.color} rounded-lg shadow-lg p-6 text-white`}
                >
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-sm opacity-80">{item.title}</p>
                            <p className="text-2xl font-bold mt-1">
                                ${Math.abs(item.amount).toFixed(2)}
                            </p>
                        </div>
                        <div className="rounded-full p-3 bg-white bg-opacity-20">
                            {item.icon}
                        </div>
                    </div>
                </div>
            ))}
        </>
    )
}