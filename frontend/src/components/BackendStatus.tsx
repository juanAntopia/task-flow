'use client';

import { useEffect, useState } from 'react';
import { api } from '@/services/api';
import { HealthCheckResponse } from '@/types/api';

export function BackendStatus() {
  const [status, setStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [healthData, setHealthData] = useState<HealthCheckResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const checkConnection = async () => {
    setStatus('checking');
    setErrorMessage('');
    try {
      const data = await api.healthCheck();
      setHealthData(data);
      setStatus('connected');
    } catch (err: unknown) {
      setStatus('error');
      setErrorMessage(
        err instanceof Error ? err.message : 'No se pudo conectar con el backend de Laravel'
      );
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  return (
    <div className="w-full max-w-xl rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
        <h3 className="font-semibold text-lg text-zinc-900 dark:text-zinc-100">
          Estado de Conexión con Laravel
        </h3>
        <button
          onClick={checkConnection}
          className="text-xs font-medium px-3 py-1.5 rounded-md bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 transition-colors"
        >
          Reintentar
        </button>
      </div>

      <div className="mt-4">
        {status === 'checking' && (
          <div className="flex items-center gap-3 text-zinc-500">
            <span className="h-3 w-3 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-sm">Comprobando conexión con Laravel en {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}...</span>
          </div>
        )}

        {status === 'connected' && healthData && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-medium">
              <span className="h-3 w-3 rounded-full bg-emerald-500" />
              <span>Conectado exitosamente con Laravel</span>
            </div>
            <div className="rounded-lg bg-zinc-50 dark:bg-zinc-900 p-3 text-xs font-mono text-zinc-700 dark:text-zinc-300">
              <p>Mensaje: {healthData.message}</p>
              <p>Timestamp: {healthData.timestamp}</p>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-medium">
              <span className="h-3 w-3 rounded-full bg-rose-500" />
              <span>Sin conexión con el backend de Laravel</span>
            </div>
            <p className="text-xs text-zinc-500">
              Asegúrate de que el contenedor o servidor de Laravel esté activo en <code>http://localhost:8000</code>.
            </p>
            {errorMessage && (
              <p className="rounded bg-rose-50 dark:bg-rose-950/30 p-2 text-xs font-mono text-rose-700 dark:text-rose-300">
                {errorMessage}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

