"use client"

import { useState } from "react"
import { useTransactions } from "@/context/TransactionContext"
import { DateRange } from "@/lib/types"

export default function DateRangePicker() {
    const { setDateRangeFilter, dateRange } = useTransactions()
    const [isOpen, setIsOpen] = useState(false)
    const [localRange, setLocalRange] = useState<DateRange>({
        startDate: dateRange?.startDate || '',
        endDate: dateRange?.endDate || ''
    })

    const handleApply = () => {
        if (localRange.startDate && localRange.endDate) {
            setDateRangeFilter(localRange)
        }
        setIsOpen(false)
    }

    const handleClear = () => {
        setDateRangeFilter(null)
        setLocalRange({ startDate: '', endDate: '' })
        setIsOpen(false)
    }

    const toggleOpen = () => {
        setIsOpen(!isOpen)
    }

    return (
        <div className="relative">
            <button
                onClick={toggleOpen}
                className="flex items-center bg-white border border-gray-300 rounded-md py-2 px-4 hover:bg-gray-50"
            >
                <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                {dateRange ? (
                    <span>
                        {new Date(dateRange.startDate).toLocaleDateString()} - {new Date(dateRange.endDate).toLocaleTimeString()}
                    </span>
                ) : (
                    <span>Filter by Date</span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 bg-white border border-gray-300 rounded-md shadow-lg z-10 p-4 w-72">
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                        <input 
                            type="date"
                            value={localRange.startDate}
                            onChange={(e) => setLocalRange({ ...localRange, startDate: e.target.value })}
                            className="w-full border border-gray-300 rounded-md px-3 py-2" 
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                        <input 
                            type="date"
                            value={localRange.endDate}
                            min={localRange.startDate}
                            onChange={(e) => setLocalRange({ ...localRange, endDate: e.target.value })}
                            className="w-full border border-gray-300 rounded-md px-3 py-2"                    
                        />
                    </div>
                    <div className="flex justify-between">
                        <button
                            onClick={handleClear}
                            className="text-gray-600 hover:text-gray-800 text-sm"
                        >
                            Clear Filter
                        </button>
                        <button
                            onClick={handleApply}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700"
                            disabled={!localRange.startDate || !localRange.endDate}
                        >
                            Apply
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}