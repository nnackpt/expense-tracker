"use client"

import { useEffect, useState } from "react"
import { Chart, registerables } from "chart.js"
import { useTransactions } from "@/context/TransactionContext"
import { CategorySummary } from "@/lib/types"

Chart.register(...registerables)

export default function PieChart() {
    const { filteredTransactions, categories } = useTransactions()
    const [chartInstance, setChartInstance] = useState<Chart | null>(null)
    const [chartType, setChartType] = useState<'expense' | 'income'>('expense')

    useEffect(() => {
        if (chartInstance) {
            chartInstance.destroy()
        }

        const typeFilteredTransactions = filteredTransactions.filter(
            transaction => transaction.type === chartType
        )

        const categorySummary: Record<string, CategorySummary> = {}

        typeFilteredTransactions.forEach(transaction => {
            const category = categories.find(c => c.id === transaction.categoryId)

            if (!category) return

            if (!categorySummary[category.id]) {
                categorySummary[category.id] = {
                    categoryId: category.id,
                    categoryName: category.name,
                    amount: 0,
                    color: category.color,
                }
            }

            categorySummary[category.id].amount += transaction.amount
        })

        const chartData = Object.values(categorySummary)

        const ctx = document.getElementById('categor-chart') as HTMLCanvasElement
        if (ctx) {
            const newChartInstance = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: chartData.map(data => data.categoryName),
                    datasets: [
                        {
                            data: chartData.map(data => data.amount),
                            backgroundColor: chartData.map(data => data.color),
                            borderWidth: 1
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'right',
                            labels: {
                                boxWidth: 15
                            }
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    const value = context.raw as number
                                    const total = (context.chart.data.datasets[0].data as number[]).reduce(
                                        (a, b) => (a as number) + (b as number), 0
                                    )
                                    const percentage = Math.round((value / total) * 100)
                                    return `${context.label}: $${value.toFixed(2)} (${percentage}%)`
                                }
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
    }, [filteredTransactions, categories, chartType])

    return (
        <div className="w-full h-full">
            <div className="mb-4 flex justify-center space-x-4">
                <button
                    onClick={() => setChartType('expense')}
                    className={`px-3 py-1 rounded-md text-sm ${
                        chartType === 'expense'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
                    }`}
                >
                    Expenses
                </button>
                <button
                    onClick={() => setChartType('income')}
                    className={`px-3 py-1 rounded-md text-sm ${
                        chartType === 'income'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
                    }`}
                >
                    Income
                </button>
            </div>
            <div className="h-52">
                <canvas id="category-chart"></canvas>
            </div>
        </div>
    )
}