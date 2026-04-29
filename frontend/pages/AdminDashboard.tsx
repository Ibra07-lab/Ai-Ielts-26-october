import React, { useEffect, useState } from 'react';
import backend from '@/backend';
import { TrendingUp, Users, MessageSquare, FileText, AlertCircle, RefreshCw } from 'lucide-react';

interface TopUser {
  id: string;
  email: string;
  plan: string;
  cumulative_api_cost: number;
  current_month_cost: number;
  reading_credits_used: number;
  essays_used: number;
}

interface AdminStats {
  totalUsers: number;
  totalEssaysUsed: number;
  totalReadingMessages: number;
  totalApiCostUsd: number;
  currentMonthApiCostUsd: number;
  topExpensiveUsers: TopUser[];
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await backend.admin.getAdminStats();
      setStats(response);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch admin stats. Ensure you have the "admin" role in Supabase.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading && !stats) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 pt-24 dark:bg-gray-900 md:p-12 md:pt-28">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Analytics</h1>
            <p className="text-gray-500 dark:text-gray-400">Track unit economics, user usage, and LLM API costs.</p>
          </div>
          <button 
            onClick={fetchStats}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl bg-white px-4 py-2 font-semibold text-gray-700 shadow-sm border border-gray-200 hover:bg-gray-50 disabled:opacity-50 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-750"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {error && (
          <div className="mb-8 rounded-xl bg-red-50 p-4 border border-red-100 flex items-start gap-3 dark:bg-red-900/20 dark:border-red-800/30">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
            <p className="text-red-800 dark:text-red-300 font-medium">{error}</p>
          </div>
        )}

        {stats && (
          <>
            {/* KPI Cards */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
              <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
                <div className="flex items-center gap-4">
                  <div className="rounded-xl bg-blue-100 p-3 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total API Cost</p>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">${stats.totalApiCostUsd.toFixed(2)}</h3>
                  </div>
                </div>
                <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold text-blue-600 dark:text-blue-400">${stats.currentMonthApiCostUsd.toFixed(2)}</span> this month
                </div>
              </div>

              <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
                <div className="flex items-center gap-4">
                  <div className="rounded-xl bg-emerald-100 p-3 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                    <Users className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Users</p>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalUsers}</h3>
                  </div>
                </div>
                <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                  Average cost/user: <span className="font-semibold text-gray-700 dark:text-gray-300">${(stats.totalApiCostUsd / Math.max(1, stats.totalUsers)).toFixed(2)}</span>
                </div>
              </div>

              <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
                <div className="flex items-center gap-4">
                  <div className="rounded-xl bg-purple-100 p-3 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                    <MessageSquare className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Reading Messages</p>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalReadingMessages.toLocaleString()}</h3>
                  </div>
                </div>
                <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                  Total interactive messages sent
                </div>
              </div>

              <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
                <div className="flex items-center gap-4">
                  <div className="rounded-xl bg-amber-100 p-3 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Essays Evaluated</p>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalEssaysUsed.toLocaleString()}</h3>
                  </div>
                </div>
                <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                  Total writing tasks evaluated
                </div>
              </div>
            </div>

            {/* Top Expensive Users Table */}
            <div className="rounded-2xl bg-white shadow-sm border border-gray-100 dark:bg-gray-800 dark:border-gray-700 overflow-hidden">
              <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Top 5% Most Expensive Users</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Users ordered by cumulative API cost. Monitor for abuse.</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
                  <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700/50 dark:text-gray-300">
                    <tr>
                      <th scope="col" className="px-6 py-4">User</th>
                      <th scope="col" className="px-6 py-4">Plan</th>
                      <th scope="col" className="px-6 py-4">Reading Msgs</th>
                      <th scope="col" className="px-6 py-4">Essays</th>
                      <th scope="col" className="px-6 py-4 font-semibold text-gray-900 dark:text-white">Lifetime Cost</th>
                      <th scope="col" className="px-6 py-4 text-blue-600 dark:text-blue-400">Month Cost</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    {stats.topExpensiveUsers.map((user, index) => (
                      <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/20">
                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                          <div className="flex flex-col">
                            <span>{user.email}</span>
                            <span className="text-xs text-gray-400">{user.id}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                            user.plan === 'pro_plus' ? 'bg-purple-50 text-purple-700 ring-purple-600/20 dark:bg-purple-900/30 dark:text-purple-400 dark:ring-purple-500/20' :
                            user.plan === 'pro' ? 'bg-blue-50 text-blue-700 ring-blue-600/20 dark:bg-blue-900/30 dark:text-blue-400 dark:ring-blue-500/20' :
                            'bg-gray-50 text-gray-600 ring-gray-500/10 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700'
                          }`}>
                            {user.plan}
                          </span>
                        </td>
                        <td className="px-6 py-4">{user.reading_credits_used}</td>
                        <td className="px-6 py-4">{user.essays_used}</td>
                        <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">
                          ${user.cumulative_api_cost.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 font-semibold text-blue-600 dark:text-blue-400">
                          ${user.current_month_cost.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                    {stats.topExpensiveUsers.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                          No user data available yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
