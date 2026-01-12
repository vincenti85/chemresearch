import { useState } from 'react';
import { fmpApi, StockQuote, CompanyProfile } from '../lib/fmpApi';
import { AlertCircle, CheckCircle, Loader } from 'lucide-react';

/**
 * FMP API Test Component
 * Use this component to test the Financial Modeling Prep API connection
 */
export default function FMPTest() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [symbol, setSymbol] = useState('AAPL');

  const testConnection = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fmpApi.testConnection();
      setResult(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const getQuote = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fmpApi.getQuote(symbol);
      setResult(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const getProfile = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fmpApi.getProfile(symbol);
      setResult(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const getMarketStatus = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fmpApi.getMarketStatus();
      setResult(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">FMP API Test</h2>
        <p className="text-gray-600 mb-6">
          Test your Financial Modeling Prep API connection
        </p>

        {/* Symbol Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Stock Symbol
          </label>
          <input
            type="text"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value.toUpperCase())}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter stock symbol (e.g., AAPL)"
          />
        </div>

        {/* Test Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <button
            onClick={testConnection}
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Test Connection
          </button>
          <button
            onClick={getQuote}
            disabled={loading || !symbol}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Get Quote
          </button>
          <button
            onClick={getProfile}
            disabled={loading || !symbol}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Get Profile
          </button>
          <button
            onClick={getMarketStatus}
            disabled={loading}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Market Status
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center p-8">
            <Loader className="w-8 h-8 animate-spin text-blue-600" />
            <span className="ml-3 text-gray-600">Loading...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
              <div className="mt-3 text-sm text-red-600">
                <p className="font-medium">Common solutions:</p>
                <ul className="list-disc ml-5 mt-1 space-y-1">
                  <li>Verify your API key is set in .env file as VITE_FMP_API_KEY</li>
                  <li>Check if your API subscription is active</li>
                  <li>Ensure you're running in development mode (npm run dev)</li>
                  <li>Try restarting the development server</li>
                  <li>Check browser console for CORS errors</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Success State */}
        {result && !loading && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <h3 className="ml-2 text-sm font-medium text-green-800">Success</h3>
            </div>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded overflow-x-auto text-xs">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>

      {/* Documentation */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-2">Setup Instructions</h3>
        <ol className="list-decimal ml-5 space-y-2 text-sm text-blue-800">
          <li>Copy <code className="bg-blue-100 px-1 rounded">.env.example</code> to <code className="bg-blue-100 px-1 rounded">.env</code></li>
          <li>Add your FMP API key to <code className="bg-blue-100 px-1 rounded">VITE_FMP_API_KEY</code></li>
          <li>Restart the development server: <code className="bg-blue-100 px-1 rounded">npm run dev</code></li>
          <li>Click "Test Connection" to verify the API is working</li>
        </ol>
      </div>
    </div>
  );
}
