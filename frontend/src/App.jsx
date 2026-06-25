import { useState, useEffect } from 'react';
import { Plus, LayoutDashboard, BarChart3 } from 'lucide-react';
import { getPortfolio, deleteAsset } from './api/client';
import PortfolioSummary from './components/PortfolioSummary';
import AssetTable from './components/AssetTable';
import AddAssetModal from './components/AddAssetModal';
import PriceChart from './components/PriceChart';
import AnalyticsPage from './components/AnalyticsPage';

function App() {
  const [tab, setTab] = useState('portfolio'); // 'portfolio' | 'analytics'
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const loadPortfolio = async () => {
    try {
      setLoading(true);
      const { data } = await getPortfolio();
      setAssets(data);
      setError(null);
    } catch (err) {
      setError('Не вдалося завантажити портфель. Перевірте, що backend запущений.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPortfolio();
  }, []);

  const handleDelete = async (id) => {
    await deleteAsset(id);
    loadPortfolio();
  };

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
          <h1 className="text-3xl font-bold text-white">Crypto Dashboard</h1>

          <div className="flex items-center gap-3">
            <div className="flex bg-slate-800 rounded-lg p-1 border border-slate-700">
              <button
                onClick={() => setTab('portfolio')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition ${
                  tab === 'portfolio' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <LayoutDashboard size={16} />
                Портфель
              </button>
              <button
                onClick={() => setTab('analytics')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition ${
                  tab === 'analytics' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <BarChart3 size={16} />
                Аналітика
              </button>
            </div>

            {tab === 'portfolio' && (
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 font-medium transition"
              >
                <Plus size={18} />
                Додати актив
              </button>
            )}
          </div>
        </div>

        {tab === 'portfolio' ? (
          <>
            {error && (
              <div className="bg-red-900/30 border border-red-700 text-red-300 rounded-lg p-4 mb-6">
                {error}
              </div>
            )}
            {loading ? (
              <p className="text-slate-400">Завантаження...</p>
            ) : (
              <>
                <div className="mb-6">
                  <PortfolioSummary assets={assets} />
                </div>
                <div className="mb-6">
                  <PriceChart />
                </div>
                <AssetTable assets={assets} onDelete={handleDelete} />
              </>
            )}
          </>
        ) : (
          <AnalyticsPage />
        )}
      </div>

      {showModal && (
        <AddAssetModal
          onClose={() => setShowModal(false)}
          onAdded={loadPortfolio}
        />
      )}
    </div>
  );
}

export default App;