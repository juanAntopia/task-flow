import Image from "next/image";
import { BackendStatus } from "@/components/BackendStatus";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-8 sm:p-20 bg-zinc-50 dark:bg-black font-sans">
      <header className="flex w-full max-w-4xl items-center justify-between">
        <div className="flex items-center gap-3">
          <Image
            className="dark:invert h-6 w-auto"
            src="/next.svg"
            alt="Next.js logo"
            width={120}
            height={25}
            priority
          />
          <span className="text-zinc-400 font-bold text-xl">+</span>
          <span className="text-xl font-bold text-red-600 tracking-tight">Laravel</span>
        </div>
        <span className="text-xs px-2.5 py-1 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-mono">
          Full Stack Ready
        </span>
      </header>

      <main className="flex flex-col items-center gap-8 text-center sm:text-left w-full max-w-4xl py-12">
        <div className="space-y-3 text-center w-full">
          <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
            Task Flow Architecture
          </h1>
          <p className="text-base text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            Next.js App Router (Frontend) integrado con Laravel API (Backend) y base de datos PostgreSQL en Docker.
          </p>
        </div>

        <div className="w-full flex justify-center">
          <BackendStatus />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full text-left">
          <div className="p-5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
            <h2 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-2">Frontend (Next.js)</h2>
            <ul className="text-sm text-zinc-600 dark:text-zinc-400 space-y-1 font-mono">
              <li>- src/app (App Router)</li>
              <li>- src/components (UI Components)</li>
              <li>- src/services (Cliente HTTP Laravel)</li>
              <li>- src/types (Interfaces TypeScript)</li>
            </ul>
          </div>
          <div className="p-5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
            <h2 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-2">Backend (Laravel)</h2>
            <ul className="text-sm text-zinc-600 dark:text-zinc-400 space-y-1 font-mono">
              <li>- app/Http (Controllers, Requests, Resources)</li>
              <li>- app/Models, Services, Policies</li>
              <li>- routes/api.php con Sanctum</li>
              <li>- database (PostgreSQL migrations & seeders)</li>
            </ul>
          </div>
        </div>
      </main>

      <footer className="text-xs text-zinc-500 text-center py-4">
        Task Flow • Next.js + Laravel + PostgreSQL Stack
      </footer>
    </div>
  );
}
