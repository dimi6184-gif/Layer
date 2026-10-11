# Layer AI - Yellow Rebrand Script
# This script replaces all purple/fuchsia colors with yellow

Write-Host "[PAINT] Starting Layer AI Yellow Rebrand..." -ForegroundColor Yellow

$webPath = "apps\web\src"
$filesToUpdate = Get-ChildItem -Path $webPath -Include *.tsx,*.ts,*.jsx,*.js -Recurse

$replacements = @(
    # Gradient combinations
    @{Find = 'from-purple-400 via-fuchsia-400 to-purple-600'; Replace = 'from-yellow-300 via-yellow-400 to-yellow-500'}
    @{Find = 'from-purple-400 to-fuchsia-400'; Replace = 'from-yellow-300 to-yellow-500'}
    @{Find = 'from-purple-500 to-fuchsia-500'; Replace = 'from-yellow-400 to-yellow-500'}
    @{Find = 'from-fuchsia-500 to-purple-500'; Replace = 'from-yellow-400 to-yellow-500'}
    
    # Text colors
    @{Find = 'text-purple-300'; Replace = 'text-yellow-300'}
    @{Find = 'text-purple-400'; Replace = 'text-yellow-400'}
    @{Find = 'text-purple-500'; Replace = 'text-yellow-500'}
    @{Find = 'text-purple-600'; Replace = 'text-yellow-600'}
    @{Find = 'text-fuchsia-300'; Replace = 'text-yellow-300'}
    @{Find = 'text-fuchsia-400'; Replace = 'text-yellow-400'}
    @{Find = 'text-fuchsia-500'; Replace = 'text-yellow-500'}
    
    # Background colors
    @{Find = 'bg-purple-500'; Replace = 'bg-yellow-500'}
    @{Find = 'bg-purple-600'; Replace = 'bg-yellow-600'}
    @{Find = 'bg-purple-700'; Replace = 'bg-yellow-700'}
    @{Find = 'bg-fuchsia-500'; Replace = 'bg-yellow-500'}
    @{Find = 'bg-fuchsia-600'; Replace = 'bg-yellow-600'}
    
    # Background with opacity
    @{Find = 'bg-purple-500/10'; Replace = 'bg-yellow-500/10'}
    @{Find = 'bg-purple-500/20'; Replace = 'bg-yellow-500/20'}
    @{Find = 'bg-fuchsia-500/10'; Replace = 'bg-yellow-500/10'}
    @{Find = 'bg-fuchsia-500/20'; Replace = 'bg-yellow-500/20'}
    
    # Borders
    @{Find = 'border-purple-500'; Replace = 'border-yellow-500'}
    @{Find = 'border-purple-500/30'; Replace = 'border-yellow-500/30'}
    @{Find = 'border-purple-500/20'; Replace = 'border-yellow-500/20'}
    @{Find = 'border-fuchsia-500'; Replace = 'border-yellow-500'}
    @{Find = 'border-fuchsia-500/30'; Replace = 'border-yellow-500/30'}
    
    # Shadows
    @{Find = 'shadow-purple-500'; Replace = 'shadow-yellow-500'}
    @{Find = 'shadow-purple-500/50'; Replace = 'shadow-yellow-500/50'}
    @{Find = 'shadow-purple-500/10'; Replace = 'shadow-yellow-500/10'}
    @{Find = 'shadow-fuchsia-500'; Replace = 'shadow-yellow-500'}
    @{Find = 'shadow-fuchsia-500/50'; Replace = 'shadow-yellow-500/50'}
    
    # Hover states
    @{Find = 'hover:bg-purple-600'; Replace = 'hover:bg-yellow-600'}
    @{Find = 'hover:bg-purple-700'; Replace = 'hover:bg-yellow-700'}
    @{Find = 'hover:border-purple-500'; Replace = 'hover:border-yellow-500'}
    @{Find = 'hover:text-purple-400'; Replace = 'hover:text-yellow-400'}
    
    # Ring colors
    @{Find = 'ring-purple-500'; Replace = 'ring-yellow-500'}
    @{Find = 'focus:ring-purple-500'; Replace = 'focus:ring-yellow-500'}
    
    # Group hover
    @{Find = 'group-hover:bg-purple-500'; Replace = 'group-hover:bg-yellow-500'}
    @{Find = 'group-hover:border-purple-500'; Replace = 'group-hover:border-yellow-500'}
)

$totalChanges = 0

foreach ($file in $filesToUpdate) {
    $content = Get-Content $file.FullName -Raw
    $originalContent = $content
    
    foreach ($replacement in $replacements) {
        $content = $content -replace [regex]::Escape($replacement.Find), $replacement.Replace
    }
    
    if ($content -ne $originalContent) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        $changes = ($originalContent.Length - $content.Replace($originalContent, '').Length)
        $totalChanges++
        Write-Host "[OK] Updated: $($file.Name)" -ForegroundColor Green
    }
}

Write-Host "`n[SUCCESS] Rebrand complete! Updated $totalChanges files." -ForegroundColor Green
Write-Host "[YELLOW] Your brand is now YELLOW!" -ForegroundColor Yellow
Write-Host "`nNext steps:" -ForegroundColor Cyan
Write-Host "1. Restart your dev server (npm run dev)" -ForegroundColor White
Write-Host "2. Check the landing page at http://localhost:3000" -ForegroundColor White
Write-Host "3. Verify dashboard colors look good" -ForegroundColor White
