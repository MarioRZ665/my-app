"use client";

import React, { useState, useEffect } from "react";

export default function LoanSimulationPage() {
  const [formData, setFormData] = useState({
    amount: "",
    interest_rate: "",
    total_payment: "",
    term_months: "",
    start_date: "",
  });

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [simulations, setSimulations] = useState<any[]>([]);
  const [loadingSimulations, setLoadingSimulations] = useState(true);
  const [selectedSimulation, setSelectedSimulation] = useState<any>(null);

  const fetchSimulations = async () => {
    setLoadingSimulations(true);
    try {
      const response = await fetch(`${apiUrl}/api/simulations`, {
        headers: {
          Accept: "application/json",
        },
      });
      const data = await response.json().catch(() => null);
      if (response.ok) {
        if (Array.isArray(data)) {
          setSimulations(data);
        } else if (data && Array.isArray(data.data)) {
          setSimulations(data.data);
        } else if (data && Array.isArray(data.simulations)) {
          setSimulations(data.simulations);
        } else {
          setSimulations([]);
        }
      }
    } catch (err) {
      console.error("Error al obtener historial:", err);
    } finally {

      setLoadingSimulations(false);
    }
  };

  useEffect(() => {
    fetchSimulations();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      let parsedValue: string | number = value;

      if (name !== "start_date") {
        if (value.startsWith('0') && value.length > 1 && !value.includes('.')) {
          parsedValue = value.replace(/^0+/, '');
        }
      }

      return {
        ...prev,
        [name]: name === "start_date" ? parsedValue : (parsedValue === "" ? "" : Number(parsedValue)),
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(`${apiUrl}/api/simulations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(data?.message || `Error ${response.status}: Error al procesar la simulación.`);
      }

      setResult(data || { success: true, message: "Simulación creada exitosamente" });

      // Refresh the table
      fetchSimulations();
    } catch (err: any) {
      setError(err.message || "Ocurrió un error");
    } finally {
      e.preventDefault();
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-indigo-50 to-slate-100 dark:from-slate-200 bg-white dark:bg-black p-6 font-sans">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-8 my-auto py-8">

        {/* Form Container */}
        <div className="lg:col-span-5 bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/20 dark:border-slate-800/50 p-8 transition-all h-fit">
          <div className="mb-6">
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2 tracking-tight">
              Simulador de Préstamos
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Crea un nuevo modelo de simulación.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Monto
                </label>
                <div className="relative group">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium group-focus-within:text-indigo-500">$</span>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    required
                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-lg pl-8 pr-3 py-2.5 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Tasa
                </label>
                <div className="relative group">
                  <input
                    type="number"
                    name="interest_rate"
                    step="0.01"
                    value={formData.interest_rate}
                    onChange={handleChange}
                    required
                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-lg pl-3 pr-8 py-2.5 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-sm"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium group-focus-within:text-indigo-500">%</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Pago
                </label>
                <div className="relative group">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium group-focus-within:text-indigo-500">$</span>
                  <input
                    type="number"
                    name="total_payment"
                    step="0.01"
                    value={formData.total_payment}
                    onChange={handleChange}
                    required
                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-lg pl-8 pr-3 py-2.5 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Plazo
                </label>
                <div className="relative group">
                  <input
                    type="number"
                    name="term_months"
                    value={formData.term_months}
                    onChange={handleChange}
                    required
                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-lg pl-3 pr-12 py-2.5 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-sm"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-medium group-focus-within:text-indigo-500">meses</span>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Fecha de Inicio
              </label>
              <input
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                required
                className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-lg px-3 py-2.5 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-sm [color-scheme:light] dark:[color-scheme:dark]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 relative overflow-hidden rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-md hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed active:scale-[0.98]"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Procesando...
                  </>
                ) : (
                  "Enviar solicitud"
                )}
              </span>
            </button>
          </form>

          {error && (
            <div className="mt-5 p-3 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-xs animate-[fadeIn_0.3s_ease-out]">
              <span className="font-bold">Error:</span> {error}
            </div>
          )}

          {result && (
            <div className="mt-5 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/50 shadow-inner overflow-hidden">
              <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 mb-3">Última Simulación</p>

              {result.details && result.details.length > 0 ? (
                <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-900/50">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                        <th className="px-2 py-2 font-semibold border-b border-slate-200 dark:border-slate-700">#</th>
                        <th className="px-2 py-2 font-semibold border-b border-slate-200 dark:border-slate-700">Cuota</th>
                        <th className="px-2 py-2 font-semibold border-b border-slate-200 dark:border-slate-700">Capital</th>
                        <th className="px-2 py-2 font-semibold border-b border-slate-200 dark:border-slate-700">Interés</th>
                        <th className="px-2 py-2 font-semibold border-b border-slate-200 dark:border-slate-700">Saldo</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                      {result.details.map((detail: any) => (
                        <tr key={detail.id || detail.installment_number} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                          <td className="px-2 py-1.5 font-medium text-slate-900 dark:text-slate-200">{detail.installment_number}</td>
                          <td className="px-2 py-1.5 text-slate-600 dark:text-slate-300">${Number(detail.payment).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                          <td className="px-2 py-1.5 text-slate-600 dark:text-slate-300">${Number(detail.principal).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                          <td className="px-2 py-1.5 text-slate-600 dark:text-slate-300">${Number(detail.interest).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                          <td className="px-2 py-1.5 text-slate-600 dark:text-slate-300">${Number(detail.balance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-xs text-slate-600 dark:text-slate-400">
                  <span className="font-semibold block mb-1">Resumen:</span>
                  Monto: ${Number(result.amount).toLocaleString()} <br />
                  Pago Mensual: ${Number(result.monthly_payment || result.payment || 0).toLocaleString()} <br />
                  Plazo: {result.term_months} meses a {result.interest_rate}%
                </div>
              )}
            </div>
          )}
        </div>

        {/* Table Container */}
        <div className="lg:col-span-7 bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/20 dark:border-slate-800/50 p-6 sm:p-8 flex flex-col h-full overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Historial de Simulaciones</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Simulaciones registradas previamente.</p>
            </div>
            <button
              onClick={fetchSimulations}
              className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-full transition-colors"
              title="Actualizar registros"
            >
              <svg className={`w-5 h-5 ${loadingSimulations ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-auto rounded-xl border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-800/30">
            {loadingSimulations && simulations.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 text-slate-400 dark:text-slate-500">
                <svg className="animate-spin h-8 w-8 mb-4 border-t-2 border-indigo-500 rounded-full" viewBox="0 0 24 24"></svg>
                <p className="text-sm">Cargando registros...</p>
              </div>
            ) : simulations.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 text-center h-full">
                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 text-slate-400">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-slate-900 dark:text-white font-medium mb-1">Sin simulaciones</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs">Ejecuta una nueva simulación usando el formulario para que aparezca aquí.</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">
                    <th className="px-4 py-3 font-semibold border-b border-slate-200 dark:border-slate-700">Monto</th>
                    <th className="px-4 py-3 font-semibold border-b border-slate-200 dark:border-slate-700">Tasa</th>
                    <th className="px-4 py-3 font-semibold border-b border-slate-200 dark:border-slate-700">Plazo</th>
                    <th className="px-4 py-3 font-semibold border-b border-slate-200 dark:border-slate-700">Pago</th>
                    <th className="px-4 py-3 font-semibold border-b border-slate-200 dark:border-slate-700 text-right">Fecha de Inicio</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                  {simulations.map((sim, i) => (
                    <React.Fragment key={sim.id || i}>
                      <tr
                        onClick={() => setSelectedSimulation(selectedSimulation?.id === sim.id ? null : sim)}
                        className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors cursor-pointer group"
                      >
                        <td className="px-4 py-3.5 font-medium text-slate-900 dark:text-slate-200">
                          ${Number(sim.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-4 py-3.5 text-slate-600 dark:text-slate-300">
                          {sim.interest_rate}%
                        </td>
                        <td className="px-4 py-3.5 text-slate-600 dark:text-slate-300 text-center sm:text-left">
                          {sim.term_months} meses
                        </td>
                        <td className="px-4 py-3.5 text-slate-600 dark:text-slate-300">
                          ${Number(sim.monthly_payment || sim.payment || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-4 py-3.5 text-slate-500 dark:text-slate-400 text-right whitespace-nowrap text-xs flex items-center justify-end gap-2">
                          {new Date(sim.created_at).toLocaleString('es-ES')}
                          <svg className={`w-4 h-4 transition-transform ${selectedSimulation?.id === sim.id ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </td>
                      </tr>
                      {selectedSimulation?.id === sim.id && sim.details && (
                        <tr>
                          <td colSpan={5} className="p-0 border-b border-slate-200 dark:border-slate-700">
                            <div className="bg-slate-50 dark:bg-slate-800/80 p-4 border-t border-slate-100 dark:border-slate-700/50">
                              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-3">Tabla de Amortización</h4>
                              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-900/50">
                                <table className="w-full text-left border-collapse text-xs">
                                  <thead>
                                    <tr className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                                      <th className="px-3 py-2 font-semibold border-b border-slate-200 dark:border-slate-700">#</th>
                                      <th className="px-3 py-2 font-semibold border-b border-slate-200 dark:border-slate-700">Cuota</th>
                                      <th className="px-3 py-2 font-semibold border-b border-slate-200 dark:border-slate-700">Capital</th>
                                      <th className="px-3 py-2 font-semibold border-b border-slate-200 dark:border-slate-700">Interés</th>
                                      <th className="px-3 py-2 font-semibold border-b border-slate-200 dark:border-slate-700">Saldo</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                                    {sim.details.map((detail: any) => (
                                      <tr key={detail.id || detail.installment_number} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="px-3 py-2 font-medium text-slate-900 dark:text-slate-200">{detail.installment_number}</td>
                                        <td className="px-3 py-2 text-slate-600 dark:text-slate-300">${Number(detail.payment).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                        <td className="px-3 py-2 text-slate-600 dark:text-slate-300">${Number(detail.principal).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                        <td className="px-3 py-2 text-slate-600 dark:text-slate-300">${Number(detail.interest).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                        <td className="px-3 py-2 text-slate-600 dark:text-slate-300">${Number(detail.balance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
