# Dashboard Light Theme Converter
# Converts all dashboard pages from dark/comic theme to light/blue theme

Write-Host "🎨 Converting Dashboard to Light/Blue Theme..." -ForegroundColor Cyan

$replacements = @(
    # Dark backgrounds to white
    @{ Old = 'bg-zinc-900/50'; New = 'bg-white' }
    @{ Old = 'bg-zinc-900'; New = 'bg-white' }
    @{ Old = 'bg-zinc-800/50'; New = 'bg-white' }
    @{ Old = 'bg-zinc-800'; New = 'bg-white' }
    @{ Old = 'bg-black/50'; New = 'bg-white' }
    
    # Dark borders to gray
    @{ Old = 'border-zinc-800/50'; New = 'border-gray-200' }
    @{ Old = 'border-zinc-800'; New = 'border-gray-200' }
    @{ Old = 'border-zinc-700/50'; New = 'border-gray-200' }
    @{ Old = 'border-zinc-700'; New = 'border-gray-200' }
    
    # Text colors
    @{ Old = 'text-white'; New = 'text-gray-900' }
    @{ Old = 'text-zinc-400'; New = 'text-gray-600' }
    @{ Old = 'text-zinc-500'; New = 'text-gray-600' }
    @{ Old = 'text-zinc-600'; New = 'text-gray-500' }
    @{ Old = 'text-zinc-700'; New = 'text-gray-700' }
    
    # Comic borders to normal
    @{ Old = 'border-3 border-black'; New = 'border-2 border-gray-200' }
    @{ Old = 'border-3'; New = 'border-2' }
    
    # Yellow/Purple to Blue
    @{ Old = 'text-yellow-400'; New = 'text-blue-600' }
    @{ Old = 'text-yellow-500'; New = 'text-blue-600' }
    @{ Old = 'text-purple-400'; New = 'text-blue-600' }
    @{ Old = 'text-purple-500'; New = 'text-blue-600' }
    @{ Old = 'bg-yellow-500/10'; New = 'bg-blue-50' }
    @{ Old = 'bg-purple-500/10'; New = 'bg-blue-50' }
    
    # Headings to gradient
    @{ Old = 'text-3xl font-bold text-white'; New = 'text-3xl font-semibold tracking-tight bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent' }
    @{ Old = 'text-xl font-bold text-white'; New = 'text-xl font-semibold text-gray-900' }
    @{ Old = 'text-xl font-bold'; New = 'text-xl font-semibold text-gray-900' }
    @{ Old = 'text-lg font-bold text-white'; New = 'text-lg font-semibold text-gray-900' }
    @{ Old = 'text-lg font-bold'; New = 'text-lg font-semibold text-gray-900' }
    
    # Remove comic-card class
    @{ Old = 'comic-card '; New = '' }
    @{ Old = ' comic-card'; New = '' }
    
    # Hover effects
    @{ Old = 'hover:border-zinc-600/50'; New = 'hover:border-blue-400' }
    @{ Old = 'hover:bg-zinc-800'; New = 'hover:bg-blue-50' }
)

$files = @(
    "apps\web\src\app\(app)\dashboard\[id]\polls\page.tsx",
    "apps\web\src\app\(app)\dashboard\[id]\giveaways\page.tsx",
    "apps\web\src\app\(app)\dashboard\[id]\socials\page.tsx"
)

foreach ($file in $files) {
    $fullPath = Join-Path $PSScriptRoot $file
    
    if (Test-Path $fullPath) {
        Write-Host "Processing: $file" -ForegroundColor Yellow
        $content = Get-Content $fullPath -Raw -Encoding UTF8
        
        $modified = $false
        foreach ($r in $replacements) {
            if ($content -match [regex]::Escape($r.Old)) {
                $content = $content -replace [regex]::Escape($r.Old), $r.New
                $modified = $true
            }
        }
        
        if ($modified) {
            Set-Content $fullPath -Value $content -Encoding UTF8 -NoNewline
            Write-Host "  ✓ Updated" -ForegroundColor Green
        } else {
            Write-Host "  - No changes needed" -ForegroundColor Gray
        }
    } else {
        Write-Host "  ✗ File not found: $fullPath" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "✅ Dashboard Light Theme Applied!" -ForegroundColor Green
Write-Host "Pages updated: Polls, Giveaways, Socials" -ForegroundColor Cyan
