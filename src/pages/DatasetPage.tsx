import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { DatasetSummary } from '../types';
import { Database, Users, Activity, BarChart3, ChevronLeft, ChevronRight } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const DatasetPage: React.FC = () => {
  const [summary, setSummary] = useState<DatasetSummary | null>(null);
  const [records, setRecords] = useState<any[]>([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDataset() {
      try {
        const [sumData, recData] = await Promise.all([
          api.getDatasetSummary(),
          api.getDatasetRecords(15, 0)
        ]);
        setSummary(sumData);
        setRecords(recData.records);
      } catch (err) {
        console.error('Failed to load dataset:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDataset();
  }, []);

  const handlePageChange = async (newOffset: number) => {
    setOffset(newOffset);
    const res = await api.getDatasetRecords(15, newOffset);
    setRecords(res.records);
  };

  if (loading || !summary) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-12 text-center space-y-3">
        <div className="w-8 h-8 border-3 border-rose-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-sm font-semibold text-slate-700">Loading dataset insights...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <span className="text-xs font-semibold uppercase tracking-wider text-rose-600">
          Cohort Distribution & Empirical Analytics
        </span>
        <h1 className="text-xl font-bold text-slate-900 mt-0.5">UCI Z-Alizadeh Sani CAD Dataset Explorer</h1>
        <p className="text-xs text-slate-500 mt-1 max-w-3xl">
          Clinical dataset from Shaheed Rajaei Cardiovascular Medical and Research Center (Tehran, Iran). Contains 303 patient records, 54 multi-modal clinical variables, and angiographically validated coronary stenosis outcomes.
        </p>
      </div>

      {/* Cohort Key Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white border border-slate-200 rounded-xl">
          <div className="flex items-center gap-1.5 text-slate-500 text-xs mb-1">
            <Users className="w-3.5 h-3.5" />
            <span>Total Cohort Size</span>
          </div>
          <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">303</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Angiography-confirmed records</span>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl">
          <div className="flex items-center gap-1.5 text-slate-500 text-xs mb-1">
            <Activity className="w-3.5 h-3.5 text-rose-500" />
            <span>CAD Prevalence</span>
          </div>
          <span className="text-2xl font-bold font-mono text-rose-600 tabular-nums">71.3%</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">216 CAD / 87 Normal</span>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl">
          <div className="flex items-center gap-1.5 text-slate-500 text-xs mb-1">
            <Database className="w-3.5 h-3.5" />
            <span>Peak Vessel Stenosis</span>
          </div>
          <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">54.5%</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">LAD Artery (165 patients)</span>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl">
          <div className="flex items-center gap-1.5 text-slate-500 text-xs mb-1">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Sex Distribution</span>
          </div>
          <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">65.3% M</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">198 Male / 105 Female</span>
        </div>
      </div>

      {/* Age Distribution Chart & Vessel Stenosis Rates */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Age Histogram */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Age Distribution Across Cohort</h3>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={summary.age_bins}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="bin" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(val) => [`${val} patients`, 'Count']} />
                <Bar dataKey="count" fill="#e11d48" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[11px] text-slate-500 text-center">Peak incidence concentrated between ages 50 and 69.</p>
        </div>

        {/* Vessel Specific Stenosis Frequencies */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Coronary Vessel Stenosis Prevalence</h3>
          <div className="space-y-4 py-2">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>Left Anterior Descending (LAD)</span>
                <span className="font-mono text-rose-600">54.5% (165 / 303)</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-rose-500 h-full rounded-full" style={{ width: '54.5%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>Right Coronary Artery (RCA)</span>
                <span className="font-mono text-amber-600">37.0% (112 / 303)</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: '37.0%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>Left Circumflex (LCX)</span>
                <span className="font-mono text-blue-600">31.0% (94 / 303)</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full rounded-full" style={{ width: '31.0%' }} />
              </div>
            </div>
          </div>
          <p className="text-[11px] text-slate-500 italic text-center">
            Multivessel disease: 42% of CAD patients showed simultaneous multi-vessel stenosis.
          </p>
        </div>
      </div>

      {/* Raw Records Table Browser */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">De-Identified Patient Cohort Records</h3>
            <p className="text-[11px] text-slate-400">Showing records {offset + 1} to {offset + records.length} of 303</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(Math.max(0, offset - 15))}
              disabled={offset === 0}
              className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono text-slate-600">Page {Math.floor(offset / 15) + 1} of 21</span>
            <button
              onClick={() => handlePageChange(Math.min(288, offset + 15))}
              disabled={offset >= 288}
              className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
              <tr>
                <th className="py-2.5 px-3">Patient ID</th>
                <th className="py-2.5 px-3">Age/Sex</th>
                <th className="py-2.5 px-3">BP / PR</th>
                <th className="py-2.5 px-3">EF %</th>
                <th className="py-2.5 px-3">RWMA</th>
                <th className="py-2.5 px-3">LDL / HDL</th>
                <th className="py-2.5 px-3">FBS</th>
                <th className="py-2.5 px-3">LAD (Ground Truth)</th>
                <th className="py-2.5 px-3">LCX</th>
                <th className="py-2.5 px-3">RCA</th>
                <th className="py-2.5 px-3">Cath (CAD)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-slate-800 text-[11px]">
              {records.map((r, i) => (
                <tr key={i} className="hover:bg-slate-50/60">
                  <td className="py-2 px-3 font-semibold text-slate-700">{r.Patient_ID}</td>
                  <td className="py-2 px-3 font-sans">{r.Age}y · {r.Sex}</td>
                  <td className="py-2 px-3">{r.BP}/{r.PR}</td>
                  <td className="py-2 px-3">{r['EF-TTE']}%</td>
                  <td className="py-2 px-3">{r['Region RWMA']}</td>
                  <td className="py-2 px-3">{r.LDL}/{r.HDL}</td>
                  <td className="py-2 px-3">{r.FBS}</td>
                  <td className="py-2 px-3">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] ${r.LAD === 'Stenotic' ? 'bg-rose-100 text-rose-800 font-bold' : 'bg-slate-100 text-slate-600'}`}>
                      {r.LAD}
                    </span>
                  </td>
                  <td className="py-2 px-3">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] ${r.LCX === 'Stenotic' ? 'bg-rose-100 text-rose-800 font-bold' : 'bg-slate-100 text-slate-600'}`}>
                      {r.LCX}
                    </span>
                  </td>
                  <td className="py-2 px-3">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] ${r.RCA === 'Stenotic' ? 'bg-rose-100 text-rose-800 font-bold' : 'bg-slate-100 text-slate-600'}`}>
                      {r.RCA}
                    </span>
                  </td>
                  <td className="py-2 px-3">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${r.Cath === 'CAD' ? 'bg-rose-600 text-white' : 'bg-emerald-100 text-emerald-800'}`}>
                      {r.Cath}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
