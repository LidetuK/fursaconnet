import { useState, useEffect } from "react";

export function GoogleBusinessPerformance({ accessToken }: { accessToken: string }) {
  const [locations, setLocations] = useState<any[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [performance, setPerformance] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch locations on mount
  useEffect(() => {
    const fetchLocations = async () => {
      setLoading(true);
      setError(null);
      try {
        let res = await fetch("https://premium-promospace-production.up.railway.app/auth/google/business-locations", {
          method: "GET",
          credentials: "include",
        });
        let data = await res.json();
        if (data.locations && data.locations.locations) {
          setLocations(data.locations.locations);
          if (data.locations.locations.length > 0) {
            setSelectedLocation(data.locations.locations[0].name);
          }
        } else {
          setError("No locations found.");
        }
      } catch (e: any) {
        setError(e.message);
      }
      setLoading(false);
    };
    if (accessToken) fetchLocations();
  }, [accessToken]);

  const fetchPerformance = async () => {
    if (!selectedLocation) return;
    setLoading(true);
    setError(null);
    setPerformance(null);
    try {
      // Call your NestJS backend endpoint for Google business performance
      const res = await fetch("https://premium-promospace-production.up.railway.app/auth/google/business-performance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Optionally, you can send the access token in the body or as a Bearer token if your backend expects it
          // "Authorization": `Bearer ${accessToken}`
        },
        credentials: "include",
        body: JSON.stringify({ access_token: accessToken, location_id: selectedLocation }),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setPerformance(data);
      }
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const getSelectedLocationName = () => {
    const location = locations.find(loc => loc.name === selectedLocation);
    return location?.title || location?.name || selectedLocation;
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Google Business Profile</h1>
      </div>
      
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg border border-gray-200 p-8">
        <div className="text-center mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Manage Your Google Business Profile</h2>
          <p className="text-gray-600">Connect your Google Business account to manage your business profile, posts, reviews, and photos all in one place.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="text-center p-6 border border-gray-200 rounded-lg">
            <div className="w-12 h-12 bg-[#f59e3e] rounded-lg flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Manage Locations</h3>
            <p className="text-sm text-gray-600">Update your business information</p>
          </div>
          
          <div className="text-center p-6 border border-gray-200 rounded-lg">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-[#f59e3e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Handle Reviews</h3>
            <p className="text-sm text-gray-600">Respond to customer reviews</p>
          </div>
          
          <div className="text-center p-6 border border-gray-200 rounded-lg">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-[#f59e3e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Track Insights</h3>
            <p className="text-sm text-gray-600">Monitor performance metrics</p>
          </div>
        </div>

        <div className="text-center">
          <button 
            onClick={fetchPerformance}
            disabled={loading || !selectedLocation}
            className="bg-[#f59e3e] hover:bg-[#e8913a] disabled:bg-gray-400 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200 mb-4"
          >
            <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            {loading ? "Connecting..." : "Connect Google Business Profile"}
          </button>
          <p className="text-sm text-gray-600">Connect your account to unlock all Google Business Profile management features.</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Google Business Performance</h2>
        <div className="flex items-center space-x-4">
          {locations.length > 0 && (
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Location:</label>
              <select
                value={selectedLocation}
                onChange={e => setSelectedLocation(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-skilllink-green focus:border-transparent"
              >
                {locations.map(loc => (
                  <option key={loc.name} value={loc.name}>
                    {loc.title || loc.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          <button 
            onClick={fetchPerformance} 
            disabled={loading || !selectedLocation} 
            className="bg-skilllink-green hover:bg-green-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
          >
            {loading ? "Loading..." : "Fetch Data"}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">{error}</div>
            </div>
          </div>
        </div>
      )}

      {!locations.length && !loading && !error && (
        <div className="text-center py-8">
          <div className="text-gray-500">No business locations found. Please check your Google Business Profile setup.</div>
        </div>
      )}

      {performance && (
        <div className="space-y-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Performance Data for: {getSelectedLocationName()}
            </h3>
            <p className="text-sm text-gray-600">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {performance.metrics && performance.metrics.map((metric: any, index: number) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 capitalize">
                      {metric.metric.replace(/([A-Z])/g, ' $1').trim()}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatNumber(metric.totalValue?.value || 0)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Total</p>
                    <p className="text-xs text-gray-500">
                      {metric.totalValue?.timeDimension?.timeRange?.startDate} - {metric.totalValue?.timeDimension?.timeRange?.endDate}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Time Series Data */}
          {performance.timeSeries && performance.timeSeries.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Performance Over Time</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      {performance.timeSeries[0].metricValues && performance.timeSeries[0].metricValues.map((metric: any, index: number) => (
                        <th key={index} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {metric.metric.replace(/([A-Z])/g, ' $1').trim()}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {performance.timeSeries.map((timePoint: any, index: number) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {timePoint.timeDimension?.timeRange?.startDate}
                        </td>
                        {timePoint.metricValues && timePoint.metricValues.map((metric: any, metricIndex: number) => (
                          <td key={metricIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatNumber(metric.value || 0)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Raw Data Toggle */}
          <details className="bg-gray-50 rounded-lg p-4">
            <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
              View Raw Data
            </summary>
            <div className="mt-4">
              <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto text-xs max-h-96">
                {JSON.stringify(performance, null, 2)}
              </pre>
            </div>
          </details>
        </div>
      )}
      </div>
    </div>
  );
} 