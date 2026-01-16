
file_path = r"c:\Apuestass\index.html"

# V51 Code to Inject (as a list of lines, handling indentation roughly)
v51_lines = [
    '          {/* CASH OUT MODAL (V51 Global - Restored) */}\n',
    '          {showCashOutModal && cashOutBet && (\n',
    '            <div className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4 animate-fade-in backdrop-blur-md" onClick={() => setShowCashOutModal(false)}>\n',
    '              <div className="bg-slate-900 w-full max-w-sm rounded-xl border border-slate-700 shadow-2xl overflow-hidden animate-scale-in" onClick={e => e.stopPropagation()}>\n',
    '                <div className="p-4 bg-amber-900/20 border-b border-amber-500/30 flex justify-between items-center">\n',
    '                  <h3 className="font-bold text-white uppercase text-sm flex items-center gap-2">\n',
    '                    <DollarSign className="text-amber-500" size={18} /> Cash Out\n',
    '                  </h3>\n',
    '                  <button onClick={() => setShowCashOutModal(false)} className="text-slate-400 hover:text-white"><X size={20} /></button>\n',
    '                </div>\n',
    '                <div className="p-6 space-y-4">\n',
    '                  <div className="bg-slate-950 p-3 rounded border border-slate-800 mb-2">\n',
    '                    <div className="text-xs text-slate-500 font-bold uppercase mb-1">Apuesta Seleccionada</div>\n',
    '                    <div className="text-sm font-bold text-white">{cashOutBet.description}</div>\n',
    '                    <div className="flex justify-between mt-2 text-xs">\n',
    '                      <div className="text-slate-400">Stake: <span className="text-white font-mono">{cashOutBet.stake}€</span></div>\n',
    '                      <div className="text-slate-400">Cuota: <span className="text-emerald-400 font-mono">@{cashOutBet.odds}</span></div>\n',
    '                    </div>\n',
    '                  </div>\n',
    '\n',
    '                  <div>\n',
    '                    <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Importe Recuperado (€)</label>\n',
    '                    <input\n',
    '                      type="number"\n',
    '                      step="0.01"\n',
    '                      autoFocus\n',
    '                      value={cashOutValue}\n',
    '                      onChange={e => setCashOutValue(e.target.value)}\n',
    '                      className="w-full bg-slate-800 border border-slate-600 rounded p-3 text-amber-400 font-bold text-xl focus:border-amber-500 focus:outline-none"\n',
    '                      placeholder="0.00"\n',
    '                    />\n',
    '                  </div>\n',
    '\n',
    '                  <div>\n',
    '                    <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Resultado Real (Si no cerrabas)</label>\n',
    '                    <div className="grid grid-cols-2 gap-2">\n',
    '                      <button onClick={() => setCashOutRealResult(\'win\')} className={`py-2 rounded border text-xs font-bold transition-colors ${cashOutRealResult === \'win\' ? \'bg-emerald-600 text-white border-emerald-500\' : \'bg-slate-800 text-slate-500 border-slate-700 hover:text-white\'}`}>WIN (Hubiera Ganado)</button>\n',
    '                      <button onClick={() => setCashOutRealResult(\'loss\')} className={`py-2 rounded border text-xs font-bold transition-colors ${cashOutRealResult === \'loss\' ? \'bg-red-600 text-white border-red-500\' : \'bg-slate-800 text-slate-500 border-slate-700 hover:text-white\'}`}>LOSS (Hubiera Perdido)</button>\n',
    '                    </div>\n',
    '                  </div>\n',
    '\n',
    '                  {/* PROFIT PREVIEW */}\n',
    '                  {cashOutValue && (\n',
    '                    <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded border border-slate-700 mt-2">\n',
    '                      <span className="text-xs font-bold text-slate-400 uppercase">Resultado Neto</span>\n',
    '                      <span className={`font-mono font-bold text-lg ${(parseFloat(cashOutValue) - cashOutBet.stake) >= 0 ? \'text-emerald-400\' : \'text-red-400\'}`}>\n',
    '                        {(parseFloat(cashOutValue) - cashOutBet.stake) > 0 ? \'+\' : \'\'}{(parseFloat(cashOutValue) - cashOutBet.stake).toFixed(2)}€\n',
    '                      </span>\n',
    '                    </div>\n',
    '                  )}\n',
    '\n',
    '                  <button\n',
    '                    onClick={handleConfirmCashOut}\n',
    '                    className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded shadow-lg shadow-amber-900/20 transition-all transform active:scale-95"\n',
    '                  >\n',
    '                    CONFIRMAR CASH OUT\n',
    '                  </button>\n',
    '                </div>\n',
    '              </div>\n',
    '            </div>\n',
    '          )}\n'
]

start_index = 7246 - 1  # Line 7246 (0-indexed 7245)
end_index = 7273        # Line 7273 (0-indexed 7272). Slice upper bound is exclusive, so 7273 covers up to 7272.

try:
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    # SAFETY CHECK
    target_line = lines[start_index]
    print(f"Target Start Line Content: {repr(target_line)}")
    
    if "CASH OUT MODAL" not in target_line or "V55" not in target_line:
        print("SAFETY CHECK FAILED: Start line does not look like V55 Header.")
        # Try to scan nearby lines to find it?
        found = -1
        for i in range(max(0, start_index - 50), min(len(lines), start_index + 50)):
            if "CASH OUT MODAL" in lines[i] and "V55" in lines[i]:
                found = i
                print(f"Found it shifted at index {i} (Line {i+1})")
                break
        
        if found != -1:
            start_index = found
            # Recalculate end index? Assuming 28 lines length
            end_index = start_index + 28
            print(f"Adjusting target to {start_index+1} - {end_index}")
        else:
             raise Exception("Could not find V55 Modal anchor.")

    # Perform Replacement
    new_lines = lines[:start_index] + v51_lines + lines[end_index:]
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.writelines(new_lines)
    
    print("SUCCESS: Replaced V55 block with V51 code.")

except Exception as e:
    print(f"ERROR: {e}")
