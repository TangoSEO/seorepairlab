import React, { useState, useEffect } from 'react';

const ScoreGauge = ({ score }: { score: number }) => {
  const circumference = 2 * Math.PI * 40; 
  const offset = circumference - (score / 100) * circumference;
  
  // Functional colors: Primary Red, Yellow, Blue/Green
  let colorClass = 'text-red-600';
  if (score >= 90) colorClass = 'text-green-600';
  else if (score >= 50) colorClass = 'text-yellow-600';

  return (
    <div className="relative flex items-center justify-center w-32 h-32 mx-auto">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
        <circle
          className="text-gray-100" // Low contrast track
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
          strokeLinecap="square" // Geometric line cap
          stroke="currentColor"
          fill="transparent"
          r="40"
          cx="50"
          cy="50"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className={`text-3xl font-bold font-mono ${colorClass}`}>{score}</span>
        <span className="text-xs text-black uppercase tracking-widest font-bold mt-1">Score</span>
      </div>
    </div>
  );
};

const ResultCard = ({ title, value, status, description, technicalLabel }: { title: string, value: string, status: string | number, description: string, technicalLabel?: string }) => {
    // Bauhaus: Borders define space. No backgrounds or minimal tints.
    let borderClass = "border-red-600";
    let textClass = "text-red-600";
    
    if (status === 'PASS' || (typeof status === 'number' && status >= 0.9)) { 
         borderClass = "border-green-600";
         textClass = "text-green-600";
    } else if (status === 'AVERAGE' || (typeof status === 'number' && status >= 0.5)) {
         borderClass = "border-yellow-600";
         textClass = "text-yellow-600";
    }

    return (
        <div className={`p-6 border-2 ${borderClass} bg-white transition-all hover:translate-x-1 hover:translate-y-1`}>
            <h4 className="text-lg font-bold text-black uppercase tracking-wide mb-2">{title}</h4>
             {technicalLabel && <span className="text-xs font-mono text-gray-500 mb-4 block border-b border-gray-100 pb-2">{technicalLabel}</span>}
            <div className={`text-4xl font-mono font-bold ${textClass} mb-4`}>{value}</div>
            <p className="text-sm text-gray-800 leading-relaxed font-medium">{description}</p>
        </div>
    )
}

export default function SeoCheckApp() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [honeyPot, setHoneyPot] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
      // ... (logic remains same) ...
      e.preventDefault();
      // ... (honeypot logic)
      if (honeyPot) return; 

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

    let validUrl = url;
    if (!url.startsWith('http')) {
        validUrl = `https://${url}`;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const API_KEY = import.meta.env.PUBLIC_GOOGLE_API_KEY; 
      let apiEndpoint = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(validUrl)}&strategy=mobile`;
      if (API_KEY) {
          apiEndpoint += `&key=${API_KEY}`;
      }
      localStorage.setItem(LAST_SCAN_KEY, Date.now().toString());

      const res = await fetch(apiEndpoint);
      const data = await res.json();

      if (!res.ok) {
        if (data.error?.code === 429 || data.error?.status === 'RESOURCE_EXHAUSTED') {
            throw new Error('Daily scan limit reached. Please try again later or contact support.');
        }
        throw new Error(data.error?.message || 'Failed to fetch data from Google');
      }

      const lighthouse = data.lighthouseResult;
      const score = lighthouse.categories.performance.score * 100; // 0-1
      const audits = lighthouse.audits;
      
      setResult({
        score: Math.round(score),
        lcp: { displayValue: audits['largest-contentful-paint'].displayValue, score: audits['largest-contentful-paint'].score },
        cls: { displayValue: audits['cumulative-layout-shift'].displayValue, score: audits['cumulative-layout-shift'].score },
        tbt: { displayValue: audits['total-blocking-time'].displayValue, score: audits['total-blocking-time'].score }
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto my-16">
      <div className="mb-16 border-l-4 border-black pl-8">
        <h2 className="text-5xl font-bold text-black tracking-tighter mb-4">
          SEO / CHECK
        </h2>
        <p className="text-gray-600 text-xl font-mono">
          Function: Instant Performance Audit
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mb-20">
        <div style={{ display: 'none' }}>
            <input type="text" value={honeyPot} onChange={(e) => setHoneyPot(e.target.value)} />
        </div>

        <div className="flex flex-col md:flex-row gap-0">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Type your domain..."
            className="flex-1 px-8 py-6 text-xl border-2 border-black bg-white text-black placeholder:text-gray-400 focus:outline-none focus:bg-gray-50 uppercase tracking-wider font-bold rounded-none"
            required
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className={`px-12 py-6 text-lg font-bold uppercase tracking-widest border-2 border-black border-l-0 
                ${loading 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-black text-white hover:bg-white hover:text-black transition-colors'
                } rounded-none`}
          >
            {loading ? 'ANALYZING...' : 'RUN AUDIT'}
          </button>
        </div>
        {error && (
            <div className="mt-8 p-6 border-2 border-red-600 bg-red-50 text-red-600 font-bold font-mono">
                ! ERROR: {error}
            </div>
        )}
      </form>

      {result && (
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
            {/* Bauhaus Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
                {/* Score Section - Takes up 4 columns */}
                <div className="lg:col-span-4 border-2 border-black p-8 flex flex-col items-center justify-center bg-white">
                    <h3 className="text-sm font-bold uppercase tracking-widest mb-8 text-center w-full border-b-2 border-black pb-4">Mobile Index</h3>
                    <ScoreGauge score={result.score} />
                </div>

                {/* metrics - Takes up 8 columns */}
                <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                     <ResultCard 
                        title="Loading" 
                        technicalLabel="LCP"
                        value={result.lcp.displayValue}
                        status={result.lcp.score}
                        description="Content visibility delay."
                    />
                    <ResultCard 
                        title="Stability" 
                        technicalLabel="CLS"
                        value={result.cls.displayValue}
                        status={result.cls.score}
                        description="Visual layout shifting."
                    />
                     <ResultCard 
                        title="Response" 
                        technicalLabel="TBT"
                        value={result.tbt.displayValue}
                        status={result.tbt.score}
                        description="Interaction delay metric."
                    />
                </div>
            </div>

            {/* CTA Section - Minimalist */}
            <div className="border-t-4 border-black pt-12 flex flex-col md:flex-row items-baseline justify-between gap-8">
                <div>
                    <h3 className="text-3xl font-bold text-black tracking-tight mb-2">
                        OPTIMIZE YOUR SITE
                    </h3>
                    <p className="text-lg text-gray-600 font-mono">
                        Correct errors. Improve structure.
                    </p>
                </div>
                <a 
                    href="#" 
                    onClick={(e) => {
                        // Optional: Add simple analytic tracking here if needed
                    }}
                    className="group flex items-center gap-4 text-xl font-bold text-black uppercase tracking-widest hover:gap-6 transition-all"
                >
                    Book Consultation
                    <span className="bg-black text-white w-12 h-12 flex items-center justify-center rounded-full group-hover:rotate-45 transition-transform">
                        →
                    </span>
                </a>
            </div>
        </div>
      )}
    </div>
  );
}
