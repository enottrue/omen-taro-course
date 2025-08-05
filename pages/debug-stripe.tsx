import { useEffect, useState } from 'react';

export default function DebugStripe() {
  const [logs, setLogs] = useState<any>({});

  useEffect(() => {
    const checkLogs = () => {
      const stripeDebugLog = localStorage.getItem('stripe_debug_log');
      const stripeInvoiceDebug = localStorage.getItem('stripe_invoice_debug');
      const stripeSuccessDebug = localStorage.getItem('stripe_success_debug');
      const stripeErrorDebug = localStorage.getItem('stripe_error_debug');
      const stripeUserDebug = localStorage.getItem('stripe_user_debug');

      setLogs({
        debugLog: stripeDebugLog ? JSON.parse(stripeDebugLog) : null,
        invoiceDebug: stripeInvoiceDebug ? JSON.parse(stripeInvoiceDebug) : null,
        successDebug: stripeSuccessDebug ? JSON.parse(stripeSuccessDebug) : null,
        errorDebug: stripeErrorDebug ? JSON.parse(stripeErrorDebug) : null,
        userDebug: stripeUserDebug ? JSON.parse(stripeUserDebug) : null,
      });
    };

    checkLogs();
    const interval = setInterval(checkLogs, 1000);
    return () => clearInterval(interval);
  }, []);

  const clearLogs = () => {
    localStorage.removeItem('stripe_debug_log');
    localStorage.removeItem('stripe_invoice_debug');
    localStorage.removeItem('stripe_success_debug');
    localStorage.removeItem('stripe_error_debug');
    setLogs({});
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>🔍 Stripe Debug Logs</h1>
      <button onClick={clearLogs} style={{ marginBottom: '20px' }}>
        Clear Logs
      </button>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>Debug Log:</h3>
        <pre style={{ background: '#f5f5f5', padding: '10px' }}>
          {logs.debugLog ? JSON.stringify(logs.debugLog, null, 2) : 'No debug log'}
        </pre>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Invoice Debug:</h3>
        <pre style={{ background: '#f5f5f5', padding: '10px' }}>
          {logs.invoiceDebug ? JSON.stringify(logs.invoiceDebug, null, 2) : 'No invoice debug'}
        </pre>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Success Debug:</h3>
        <pre style={{ background: '#f5f5f5', padding: '10px' }}>
          {logs.successDebug ? JSON.stringify(logs.successDebug, null, 2) : 'No success debug'}
        </pre>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Error Debug:</h3>
        <pre style={{ background: '#f5f5f5', padding: '10px' }}>
          {logs.errorDebug ? JSON.stringify(logs.errorDebug, null, 2) : 'No error debug'}
        </pre>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>User Debug:</h3>
        <pre style={{ background: '#f5f5f5', padding: '10px' }}>
          {logs.userDebug ? JSON.stringify(logs.userDebug, null, 2) : 'No user debug'}
        </pre>
      </div>
    </div>
  );
} 