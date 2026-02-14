import React from 'react';

export default function CropYieldTable() {
    const data = [
        { crop: "Wheat", traditional: 8.2, organic: 5.4, hydroponic: 12.6 },
        { crop: "Corn", traditional: 10.5, organic: 7.2, hydroponic: 15.8 },
        { crop: "Rice", traditional: 7.8, organic: 5.1, hydroponic: 9.4 },
        { crop: "Soy", traditional: 3.2, organic: 2.8, hydroponic: 6.5 },
    ];

    return (
        <div className="h-full flex flex-col bg-white dark:bg-slate-900">
            <div className="p-4 text-center">
                <h3 className="text-xl font-serif font-bold text-slate-900 dark:text-white mb-2">
                    Crop Yields
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 font-serif italic">
                    Yields measured in tonnes per hectare.
                </p>
            </div>

            <div className="flex-1 w-full flex flex-col justify-center">
                <div className="w-full border border-slate-900 dark:border-slate-700">
                    <table className="w-full text-left border-collapse table-fixed">
                        <thead>
                            <tr className="border-b border-slate-900 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">
                                <th className="p-2 font-bold text-slate-900 dark:text-gray-100 border-r border-slate-300 dark:border-slate-600 w-[25%] text-sm font-serif">
                                    Crop
                                </th>
                                <th className="p-2 font-bold text-slate-900 dark:text-gray-100 border-r border-slate-300 dark:border-slate-600 w-[25%] text-center text-sm font-serif">
                                    Traditional
                                </th>
                                <th className="p-2 font-bold text-slate-900 dark:text-gray-100 border-r border-slate-300 dark:border-slate-600 w-[25%] text-center text-sm font-serif">
                                    Organic
                                </th>
                                <th className="p-2 font-bold text-slate-900 dark:text-gray-100 w-[25%] text-center text-sm font-serif">
                                    Hydroponic
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((row, index) => (
                                <tr
                                    key={row.crop}
                                    className={`
                                        ${index === data.length - 1 ? '' : 'border-b border-slate-300 dark:border-slate-700'} 
                                        ${index % 2 === 0 ? 'bg-white dark:bg-slate-900' : 'bg-slate-50 dark:bg-slate-800/30'}
                                    `}
                                >
                                    <td className="p-3 font-bold text-slate-900 dark:text-gray-100 border-r border-slate-300 dark:border-slate-600 font-serif text-base">
                                        {row.crop}
                                    </td>
                                    <td className="p-3 text-slate-800 dark:text-gray-200 text-center border-r border-slate-300 dark:border-slate-600 font-serif text-base">
                                        {row.traditional}
                                    </td>
                                    <td className="p-3 text-slate-800 dark:text-gray-200 text-center border-r border-slate-300 dark:border-slate-600 font-serif text-base">
                                        {row.organic}
                                    </td>
                                    <td className="p-3 text-slate-800 dark:text-gray-200 text-center font-serif text-base">
                                        {row.hydroponic}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
