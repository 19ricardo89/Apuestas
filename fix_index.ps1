$f = "c:\Apuestass\index.html"
$c = Get-Content -LiteralPath $f
if (!$c) { Write-Host "Could not read file"; exit 1 }

# Logic: Keep 0..2588, Insert clean logic, Keep 2770..End
# Note: Get-Content returns array of lines (0-based)
# Line 2589 (1-based "</div>") is index 2588.
# Line 2590 (1-based ")); /*") is index 2589. We SKIP this.
# Line 2770 (1-based "*/ })()}") is index 2769. We SKIP this.
# Line 2771 (1-based "</div>") is index 2770. We KEEP this.

# So we want $c[0..2588] + replacement + $c[2770..End]

$final = $c[0..2588]
$final += "                          ));"
$final += "                      })()}"
$final += $c[2770..($c.Count-1)]

$final | Set-Content -LiteralPath $f -Encoding UTF8
Write-Host "File patched successfully."
