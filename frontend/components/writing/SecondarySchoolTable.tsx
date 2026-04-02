import React from 'react';

export default function SecondarySchoolTable() {
    const data = [
        { type: "Specialist Schools", y2000: "12%", y2005: "11%", y2009: "10%" },
        { type: "Grammar Schools", y2000: "24%", y2005: "19%", y2009: "12%" },
        { type: "Voluntary-controlled Schools", y2000: "52%", y2005: "38%", y2009: "20%" },
        { type: "Community Schools", y2000: "12%", y2005: "32%", y2009: "58%" },
    ];

    return (
        <div className="h-full flex flex-col bg-white dark:bg-slate-900">
            <div className="p-4 text-center">
                <h3 className="text-xl font-serif font-bold text-slate-900 dark:text-white mb-2">
                    Secondary School Types
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 font-serif italic">
                    The Proportions of Pupils Attending Four Secondary School Types Between Between 2000 and 2009.
                </p>
            </div>

            <div className="flex-1 w-full flex flex-col justify-center px-4 mb-4">
                <div className="w-full border border-slate-900 dark:border-slate-700 shadow-sm rounded-sm overflow-hidden">
                    <table className="w-full text-left border-collapse table-fixed">
                        <thead>
                            <tr className="border-b border-slate-900 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">
                                <th className="p-3 font-bold text-slate-900 dark:text-gray-100 border-r border-slate-300 dark:border-slate-600 w-[40%] text-sm font-serif">
                                    School Type
                                </th>
                                <th className="p-3 font-bold text-slate-900 dark:text-gray-100 border-r border-slate-300 dark:border-slate-600 w-[20%] text-center text-sm font-serif">
                                    2000
                                </th>
                                <th className="p-3 font-bold text-slate-900 dark:text-gray-100 border-r border-slate-300 dark:border-slate-600 w-[20%] text-center text-sm font-serif">
                                    2005
                                </th>
                                <th className="p-3 font-bold text-slate-900 dark:text-gray-100 w-[20%] text-center text-sm font-serif">
                                    2009
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((row, index) => (
                                <tr
                                    key={row.type}
                                    className={`
                                        ${index === data.length - 1 ? '' : 'border-b border-slate-300 dark:border-slate-700'} 
                                        ${index % 2 === 0 ? 'bg-white dark:bg-slate-900' : 'bg-slate-50 dark:bg-slate-800/30'}
                                    `}
                                >
                                    <td className="p-3 font-bold text-slate-900 dark:text-gray-100 border-r border-slate-300 dark:border-slate-600 font-serif text-base">
                                        {row.type}
                                    </td>
                                    <td className="p-3 text-slate-800 dark:text-gray-200 text-center border-r border-slate-300 dark:border-slate-600 font-serif text-base">
                                        {row.y2000}
                                    </td>
                                    <td className="p-3 text-slate-800 dark:text-gray-200 text-center border-r border-slate-300 dark:border-slate-600 font-serif text-base">
                                        {row.y2005}
                                    </td>
                                    <td className="p-3 text-slate-800 dark:text-gray-200 text-center font-serif text-base">
                                        {row.y2009}
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
