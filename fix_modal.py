
import re
import os

file_path = r"c:\Apuestass\index.html"

# V51 Replacement Content
v51_code = """
          {/* CASH OUT MODAL (V51 Global - Restored) */}
          {showCashOutModal && cashOutBet && (
            <div className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4 animate-fade-in backdrop-blur-md" onClick={() => setShowCashOutModal(false)}>
              <div className="bg-slate-900 w-full max-w-sm rounded-xl border border-slate-700 shadow-2xl overflow-hidden animate-scale-in" onClick={e => e.stopPropagation()}>
                <div className="p-4 bg-amber-900/20 border-b border-amber-500/30 flex justify-between items-center">
                  <h3 className="font-bold text-white uppercase text-sm flex items-center gap-2">
                    <DollarSign className="text-amber-500" size={18} /> Cash Out
                  </h3>
                  <button onClick={() => setShowCashOutModal(false)} className="text-slate-400 hover:text-white"><X size={20} /></button>
                </div>
                <div className="p-6 space-y-4">
                  <div className="bg-slate-950 p-3 rounded border border-slate-800 mb-2">
                    <div className="text-xs text-slate-500 font-bold uppercase mb-1">Apuesta Seleccionada</div>
                    <div className="text-sm font-bold text-white">{cashOutBet.description}</div>
                    <div className="flex justify-between mt-2 text-xs">
                      <div className="text-slate-400">Stake: <span className="text-white font-mono">{cashOutBet.stake}€</span></div>
                      <div className="text-slate-400">Cuota: <span className="text-emerald-400 font-mono">@{cashOutBet.odds}</span></div>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Importe Recuperado (€)</label>
                    <input
                      type="number"
                      step="0.01"
                      autoFocus
                      value={cashOutValue}
                      onChange={e => setCashOutValue(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-600 rounded p-3 text-amber-400 font-bold text-xl focus:border-amber-500 focus:outline-none"
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Resultado Real (Si no cerrabas)</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button onClick={() => setCashOutRealResult('win')} className={`py-2 rounded border text-xs font-bold transition-colors ${cashOutRealResult === 'win' ? 'bg-emerald-600 text-white border-emerald-500' : 'bg-slate-800 text-slate-500 border-slate-700 hover:text-white'}`}>WIN (Hubiera Ganado)</button>
                      <button onClick={() => setCashOutRealResult('loss')} className={`py-2 rounded border text-xs font-bold transition-colors ${cashOutRealResult === 'loss' ? 'bg-red-600 text-white border-red-500' : 'bg-slate-800 text-slate-500 border-slate-700 hover:text-white'}`}>LOSS (Hubiera Perdido)</button>
                    </div>
                  </div>

                  {/* PROFIT PREVIEW */}
                  {cashOutValue && (
                    <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded border border-slate-700 mt-2">
                      <span className="text-xs font-bold text-slate-400 uppercase">Resultado Neto</span>
                      <span className={`font-mono font-bold text-lg ${(parseFloat(cashOutValue) - cashOutBet.stake) >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {(parseFloat(cashOutValue) - cashOutBet.stake) > 0 ? '+' : ''}{(parseFloat(cashOutValue) - cashOutBet.stake).toFixed(2)}€
                      </span>
                    </div>
                  )}

                  <button
                    onClick={handleConfirmCashOut}
                    className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded shadow-lg shadow-amber-900/20 transition-all transform active:scale-95"
                  >
                    CONFIRMAR CASH OUT
                  </button>
                </div>
              </div>
            </div>
          )}
"""

try:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Regex to capture V55 Modal
    # Matches identifying comment start ... through ... identifying footer text ... to closing brackets
    pattern = r"\{\/\* CASH OUT MODAL \(GLOBALIZED V55\) \*\/\}.*?El valor se sumará al Bank.*?\}\)"

    # Check if pattern implies single ')' or '})'
    # The block ends with "          )}" in line 7273.
    # We'll use a slightly looser end match to be safe: closing ')}' after the specific text.
    
    pattern = r"\{\s*/\*\s*CASH OUT MODAL \(GLOBALIZED V55\)\s*\*/\s*\}.*?El valor se sumará al Bank.*?\}\)"
    
    # Debug: Check match
    match = re.search(pattern, content, re.DOTALL)
    if match:
        print("Found V55 Modal Block!")
        new_content = re.sub(pattern, v51_code.strip(), content, flags=re.DOTALL)
        
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print("Successfully replaced V55 with V51.")
    else:
        print("Could not find V55 Modal Block using regex.")
        # Fallback: Try simpler match
        simple_pattern = r"\{\/\* CASH OUT MODAL \(GLOBALIZED V55\) \*\/\}"
        if re.search(simple_pattern, content):
            print("Found Header but not Full Block. Inspecting...")
        else:
            print("Did not find even the Header.")

except Exception as e:
    print(f"Error: {e}")
