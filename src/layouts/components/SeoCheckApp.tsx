
import React, { useState } from 'react';

// Simple gauge component for the score
const ScoreGauge = ({ score }: { score: number }) => {
  const circumference = 2 * Math.PI * 40; // radius 40
  const offset = circumference - (score / 100) * circumference;
  
  let colorClass = 'text-red-500';
  if (score >= 90) colorClass = 'text-green-500';
  else if (score >= 50) colorClass = 'text-yellow-500';

  return (
    <div className="relative flex items-center justify-center w-32 h-32 mx-auto">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
        <circle
          className="text-gray-200 dark:text-gray-700"
          strokeWidth="8"
          stroke="currentColor"
          fill="transparent"
          r="40"
          cx="50"
          cy="50"
        />
        <circle
          className={`${colorClass} transition-all duration-1000 ease-out`}
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r="40"
          cx="50"
          cy="50"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className={`text-3xl font-bold ${colorClass}`}>{score}</span>
        <span className="text-xs text-gray-500 uppercase font-semibold">Score</span>
      </div>
    </div>
  );
};

const ResultCard = ({ title, value, status, description, technicalLabel }: { title: string, value: string, status: string | number, description: string, technicalLabel?: string }) => {
    let bgClass = "bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800";
    let textClass = "text-red-700 dark:text-red-400";
    
    // Lighthouse uses 0.9+ for pass (green), 0.5-0.9 for average (orange), <0.5 for fail (red)
    if (status === 'PASS' || (typeof status === 'number' && status >= 0.9)) { 
         bgClass = "bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800";
         textClass = "text-green-700 dark:text-green-400";
    } else if (status === 'AVERAGE' || (typeof status === 'number' && status >= 0.5)) {
         bgClass = "bg-yellow-50 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-800";
         textClass = "text-yellow-700 dark:text-yellow-400";
    }

    return (
        <div className={`p-6 rounded-xl border ${bgClass} transition-all duration-300 hover:shadow-md`}>
            <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{title}</h4>
             {technicalLabel && <span className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-3 block">Technical term: {technicalLabel}</span>}
            <div className={`text-3xl font-bold ${textClass} mb-3`}>{value}</div>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{description}</p>
        </div>
    )
}


export default function SeoCheckApp() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [honeyPot, setHoneyPot] = useState(''); // Hidden field state

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. Security: Honeypot Check
    // If the hidden field has any value, it's likely a bot.
    if (honeyPot) {
        console.log("Bot detected via honeypot.");
        // Fake a loading delay and return success to trick the bot, or just return.
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            // Optionally set a fake error or just do nothing
        }, 1500);
        return;
    }

    if (!url) return;
    
    // 2. Security: Rate Limiting
    const LAST_SCAN_KEY = 'seo_check_last_scan';
    const COOLDOWN_SECONDS = 60;
    const lastScan = localStorage.getItem(LAST_SCAN_KEY);
    
    if (lastScan) {
        const timeDiff = (Date.now() - parseInt(lastScan)) / 1000;
        if (timeDiff < COOLDOWN_SECONDS) {
            const remaining = Math.ceil(COOLDOWN_SECONDS - timeDiff);
            setError(`Please wait ${remaining} seconds before your next scan.`);
            return;
        }
    }

    // Basic URL validation
    let validUrl = url;
    if (!url.startsWith('http')) {
        validUrl = `https://${url}`;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      // Direct call to Google PageSpeed Insights API
      // Using 'mobile' strategy by default.
      // TODO: Replace with your own Google PageSpeed Insights API Key to avoid quota limits
      // Get one here: https://developers.google.com/speed/docs/insights/v5/get-started
      const API_KEY = 'AIzaSyB4CK4Xr3gLCGagiWGyDtzOPiIe2V5tozI'; 
      
      let apiEndpoint = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(validUrl)}&strategy=mobile`;
      if (API_KEY) {
          apiEndpoint += `&key=${API_KEY}`;
      }
      
      // Update last scan timestamp
      localStorage.setItem(LAST_SCAN_KEY, Date.now().toString());

      const res = await fetch(apiEndpoint);
      const data = await res.json();

      if (!res.ok) {
        if (data.error?.code === 429 || data.error?.status === 'RESOURCE_EXHAUSTED') {
            throw new Error('Daily scan limit reached. Please try again later or contact support.');
        }
        throw new Error(data.error?.message || 'Failed to fetch data from Google');
      }

      // Process Data client-side
      const lighthouse = data.lighthouseResult;
      const score = lighthouse.categories.performance.score * 100; // 0-1
      
      const audits = lighthouse.audits;
      const lcp = audits['largest-contentful-paint'];
      const cls = audits['cumulative-layout-shift'];
      const tbt = audits['total-blocking-time'];

      setResult({
        score: Math.round(score),
        lcp: {
            displayValue: lcp.displayValue,
            score: lcp.score,
            value: lcp.numericValue
        },
        cls: {
            displayValue: cls.displayValue,
            score: cls.score,
            value: cls.numericValue
        },
        tbt: {
             displayValue: tbt.displayValue,
             score: tbt.score,
             value: tbt.numericValue
        }
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 md:p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 my-10">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 mb-4">
          Free Instant SEO Audit
        </h2>
        <p className="text-gray-600 dark:text-gray-300 text-lg">
          Check your website's performance and Core Web Vitals in seconds.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mb-12">
        {/* Honeypot Field - Invisible to users */}
        <div style={{ display: 'none' }}>
            <label htmlFor="confirm_email">Please leave this field blank</label>
            <input 
                type="text" 
                name="confirm_email" 
                id="confirm_email" 
                value={honeyPot}
                onChange={(e) => setHoneyPot(e.target.value)}
                tabIndex={-1} 
                autoComplete="off"
            />
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter your website URL (e.g., example.com)"
            className="flex-1 px-6 py-4 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400"
            required
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className={`px-8 py-4 rounded-xl font-bold text-white shadow-lg shadow-blue-500/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0
                ${loading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
                }`}
          >
            {loading ? (
                <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing...
                </span>
            ) : 'Analyze Now'}
          </button>
        </div>
        {error && (
            <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-center">
                {error}
            </div>
        )}
      </form>

      {result && (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Score Section */}
            <div className="flex flex-col items-center justify-center">
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Your Mobile Speed Score</h3>
                <ScoreGauge score={result.score} />
                <p className="mt-6 text-center text-gray-600 dark:text-gray-300 max-w-lg mx-auto text-lg leading-relaxed">
                    This score shows how Google sees your website on mobile phones. <br/>
                    <strong className="text-gray-900 dark:text-white">Higher is better.</strong> Low scores can hurt your ranking and lose customers.
                </p>
            </div>

            {/* Metrics Grid */}
            <div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-8 text-center">Why did I get this score?</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <ResultCard 
                        title="Loading Speed" 
                        technicalLabel="Largest Contentful Paint (LCP)"
                        value={result.lcp.displayValue}
                        status={result.lcp.score}
                        description="How long it takes for the main content to show up. If this is slow, visitors might leave before seeing what you offer."
                    />
                    <ResultCard 
                        title="Visual Stability" 
                        technicalLabel="Cumulative Layout Shift (CLS)"
                        value={result.cls.displayValue}
                        status={result.cls.score}
                        description="Does your page jump around while loading? A stable page feels more professional and trustworthy."
                    />
                     <ResultCard 
                        title="Responsiveness" 
                        technicalLabel="Total Blocking Time (TBT)"
                        value={result.tbt.displayValue}
                        status={result.tbt.score}
                        description="Can customers click buttons immediately? If this is 'Red', your site feels frozen or broken to users."
                    />
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 rounded-2xl p-8 md:p-12 text-center border border-indigo-100 dark:border-indigo-800/30 shadow-sm">
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    Want to turn these "Reds" into "Greens"?
                </h3>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                    A slow website costs you customers every day. I can help you fix these technical issues so you rank higher and sell more.
                </p>
                <a 
                    href="#" 
                    onClick={(e) => {
                        // Optional: Add simple analytic tracking here if needed
                    }}
                    className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all bg-indigo-600 rounded-xl hover:bg-indigo-700 hover:shadow-lg hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Book a Free 20-Min Strategy Call
                    <svg className="w-5 h-5 ml-2 -mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                    </svg>
                </a>
            </div>
        </div>
      )}
    </div>
  );
}
