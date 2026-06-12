import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Alert from '../components/ui/Alert';
import PageHeader from '../components/ui/PageHeader';
import { getDashboardStats } from '../services/api';

function StatCard({ label, value, hint, loading }) {
  return (
    <div className="card p-6">
      <p className="text-sm font-medium text-ink-secondary">{label}</p>
      <p className="mt-3 text-3xl font-semibold tracking-tight text-ink">
        {loading ? '—' : value}
      </p>
      {hint && <p className="mt-2 text-xs text-ink-muted">{hint}</p>}
    </div>
  );
}

function Dashboard() {
  const [stats, setStats] = useState({
    total_documents: 0,
    processed_documents: 0,
    failed_documents: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (err) {
        setError(err.response?.data?.detail || 'Failed to load dashboard stats.');
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  return (
    <div className="page-shell">
      <PageHeader
        title="Overview"
        description="Monitor document intake, processing status, and access your contract workspace."
      />

      {error && <Alert variant="error">{error}</Alert>}

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          label="Total documents"
          value={stats.total_documents}
          hint="All uploaded files"
          loading={loading}
        />
        <StatCard
          label="Processed"
          value={stats.processed_documents}
          hint="Ready for AI search"
          loading={loading}
        />
        <StatCard
          label="Failed"
          value={stats.failed_documents}
          hint="Requires reprocessing"
          loading={loading}
        />
      </div>

      <div className="card p-6">
        <h2 className="text-base font-semibold text-ink">Quick actions</h2>
        <p className="mt-1 text-sm text-ink-secondary">Start with a new upload or continue where you left off.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/upload" className="btn-primary">
            Upload document
          </Link>
          <Link to="/documents" className="btn-secondary">
            Browse documents
          </Link>
          <Link to="/chat" className="btn-secondary">
            Open assistant
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
