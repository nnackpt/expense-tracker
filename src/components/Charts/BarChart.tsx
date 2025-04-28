"use client"

import { useEffect, useState } from "react"
import { Chart, registerables } from "chart.js"
import { useTransactions } from "@/context/TransactionContext"
import { MonthlyDate } from "@/lib/types"

Chart.register(...registerables)

export default function BarChart() {
    const { filteredTransactions } = useTransactions()
    const [chartInstance, setChartInstance] = useState<Chart | null>(null)

    useEffect(() => {
        if (chartInstance) {
            chartInstance.destroy()
        }

        const monthlyData: Record<string, MonthlyDate> = {}

        filteredTransactions.forEach(transaction => {
            const date = new Date(transaction.date)
            const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`

            if (!monthlyData[monthYear]) {
                monthlyData[monthYear] = {
                    month: new Date(date.getFullYear(), date.getMonth(), 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
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

        const chartData = Object.values(monthlyData).sort((a, b) => {
            return new Date(a.month).getTime() - new Date(b.month).getTime()
        })

        const ctx = document.getElementById('monthly-chart') as HTMLCanvasElement
        if (ctx) {
            const newChartInstance = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: chartData.map(data => data.income),
                    datasets: [
                    {
                        label: 'Income',
                        data: chartData.map(data => data.income),
                        backgroundColor: 'rgba(75, 192, 192, 0.6)',
                        borderColor: 'rgba(75, 192, 192, 1',
                        borderWidth: 1
                    },
                    {
                        label: 'Expenses',
                        data: chartData.map(data => data.expense),
                        backgroundColor: 'rgba(255, 99, 132, 0.6)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Amount ($)'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Month'
                        }
                    }
                }
            }
        })

        setChartInstance(newChartInstance)
    }

    return () => {
        if (chartInstance) {
            chartInstance.destroy()
        }
    }
    }, [filteredTransactions])

    return (
        <div className="w-full h-full">
            <canvas id="monthly-chart"></canvas>
        </div>
    )
}