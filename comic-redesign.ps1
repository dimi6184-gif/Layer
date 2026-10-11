# Layer AI - Comic Style Redesign Script
# Converts glassmorphism to bold comic style

Write-Host "[COMIC] Starting Comic Style Redesign..." -ForegroundColor Yellow

$webPath = "apps\web\src"
$filesToUpdate = Get-ChildItem -Path $webPath -Include *.tsx,*.ts -Recurse

$replacements = @(
    # Replace glass-panel with comic-card in dashboard
    @{Find = 'glass-panel p-6 rounded-2xl border border-white/5 bg-\[#0a0a0a\]'; Replace = 'comic-card p-6'}
    @{Find = 'glass-panel p-5 rounded-xl border border-white/5 bg-\[#0a0a0a\]'; Replace = 'comic-card p-5'}
    @{Find = 'glass-panel p-8 rounded-3xl'; Replace = 'comic-card p-8'}
    @{Find = 'glass-panel p-4 rounded-xl'; Replace = 'comic-card p-4'}
    
    # Replace gradient buttons with comic buttons (CTA)
    @{Find = 'bg-gradient-to-r from-yellow-400 to-yellow-500.*?rounded-xl'; Replace = 'comic-button bg-yellow-400 text-black rounded-xl'}
    @{Find = 'bg-gradient-to-r from-yellow-500 to-yellow-600'; Replace = 'comic-button bg-yellow-400'}
    
    # Replace soft rounded corners with comic style
    @{Find = 'rounded-3xl'; Replace = 'rounded-2xl'}
    @{Find = 'rounded-\[2rem\]'; Replace = 'rounded-2xl'}
    
    # Replace blur backgrounds with solid
    @{Find = 'backdrop-blur-md'; Replace = ''}
    @{Find = 'backdrop-blur-sm'; Replace = ''}
    @{Find = 'backdrop-blur-xl'; Replace = ''}
    
    # Replace soft shadows with hard shadows
    @{Find = 'shadow-2xl shadow-yellow-500/50'; Replace = 'shadow-\[8px_8px_0px_rgba\(0,0,0,1\)\]'}
    @{Find = 'shadow-2xl shadow-yellow-500/10'; Replace = 'shadow-\[6px_6px_0px_rgba\(0,0,0,1\)\]'}
    @{Find = 'shadow-xl'; Replace = 'shadow-\[6px_6px_0px_#000\]'}
    
    # Replace transparent borders with solid black
    @{Find = 'border border-white/5'; Replace = 'border-3 border-black'}
    @{Find = 'border border-white/10'; Replace = 'border-3 border-black'}
    @{Find = 'border border-white/\[0\.05\]'; Replace = 'border-3 border-black'}
    @{Find = 'border border-white/\[0\.08\]'; Replace = 'border-3 border-black'}
    
    # Replace transparent backgrounds with white/solid
    @{Find = 'bg-white/\[0\.02\]'; Replace = 'bg-white/5'}
    @{Find = 'bg-white/5 hover:bg-white/10'; Replace = 'bg-white/10 hover:bg-yellow-400/20'}
    
    # Replace badges with comic badges
    @{Find = 'px-4 py-2 bg-yellow-500/10 border border-yellow-500/30 rounded-full'; Replace = 'comic-badge'}
    @{Find = 'px-4 py-2 bg-white/\[0\.03\] border border-white/\[0\.08\] rounded-full'; Replace = 'comic-badge bg-white text-black'}
    
    # Make text more bold/comic
    @{Find = 'font-semibold'; Replace = 'font-black'}
    @{Find = 'font-medium'; Replace = 'font-bold'}
    
    # Remove gradient overlays
    @{Find = 'bg-gradient-to-br from-yellow-500/20 via-transparent to-transparent'; Replace = ''}
    @{Find = 'bg-gradient-to-br from-yellow-500/5 to-transparent'; Replace = ''}
    @{Find = 'bg-gradient-to-t from-\[#0a0a0f\]/80 via-transparent to-transparent'; Replace = ''}
    
    # Replace scale hover with translate (comic bounce)
    @{Find = 'hover:scale-105'; Replace = 'hover:translate-y-\[-2px\] hover:shadow-\[8px_8px_0px_#000\]'}
    @{Find = 'hover:scale-110'; Replace = 'hover:translate-y-\[-2px\]'}
    @{Find = 'hover:scale-\[1\.02\]'; Replace = 'hover:translate-y-\[-2px\]'}
    
    # Replace transition duration with snappier comic timing
    @{Find = 'transition-all duration-700'; Replace = 'transition-all duration-200'}
    @{Find = 'transition-all duration-500'; Replace = 'transition-all duration-200'}
    @{Find = 'transition-opacity duration-700'; Replace = 'transition-opacity duration-200'}
    
    # Make buttons more prominent
    @{Find = 'bg-white/5.*?hover:bg-white/10'; Replace = 'bg-white text-black hover:bg-yellow-400'}
)

$totalChanges = 0
$filesChanged = 0

foreach ($file in $filesToUpdate) {
    $content = Get-Content $file.FullName -Encoding UTF8 | Out-String
    $originalContent = $content
    $fileChanged = $false
    
    foreach ($replacement in $replacements) {
        if ($content -match $replacement.Find) {
            $content = $content -replace $replacement.Find, $replacement.Replace
            $fileChanged = $true
        }
    }
    
    if ($content -ne $originalContent) {
        Set-Content -Path $file.FullName -Value $content -NoNewline -Encoding UTF8
        $filesChanged++
        Write-Host "[OK] Updated: $($file.Name)" -ForegroundColor Green
    }
}

Write-Host "`n[SUCCESS] Comic redesign complete!" -ForegroundColor Green
Write-Host "[INFO] Updated $filesChanged files with comic style" -ForegroundColor Cyan
Write-Host "`nComic Style Features:" -ForegroundColor Yellow
Write-Host "- Bold 3px black borders" -ForegroundColor White
Write-Host "- Hard 6px-8px shadows" -ForegroundColor White
Write-Host "- Flat yellow + black colors" -ForegroundColor White
Write-Host "- Comic button effects" -ForegroundColor White
Write-Host "- Snappy animations (200ms)" -ForegroundColor White
Write-Host "`nRestart dev server to see changes!" -ForegroundColor Cyan
