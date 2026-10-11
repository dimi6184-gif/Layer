# Apple Design mit Lila - Komplette Transformation
Write-Host "🍎💜 Converting to Apple Design (Purple Theme)..." -ForegroundColor Magenta

$replacements = @{
    # Comic → Apple Classes
    'comic-card' = 'apple-card'
    'comic-panel' = 'apple-card'
    'comic-button' = 'apple-button'
    'comic-badge' = 'apple-badge'
    'comic-burst' = ''
    'speech-bubble' = 'apple-notification'
    
    # Colors: Yellow → Purple
    'bg-yellow-400' = 'bg-purple-500'
    'bg-yellow-500' = 'bg-purple-600'
    'text-yellow-300' = 'text-purple-400'
    'text-yellow-400' = 'text-purple-500'
    'text-yellow-500' = 'text-purple-600'
    'from-yellow-300' = 'from-purple-400'
    'to-yellow-500' = 'to-purple-600'
    'border-yellow-400' = 'border-purple-500'
    'hover:bg-yellow-400' = 'hover:bg-purple-500'
    'hover:bg-yellow-50' = 'hover:bg-purple-50'
    
    # Borders: Hard → Soft
    'border-4 border-black' = 'border border-gray-200'
    'border-3 border-black' = 'border border-gray-100'
    
    # Backgrounds
    'bg-black' = 'bg-white'
    'bg-white/5' = 'apple-card'
    
    # Text colors
    'text-white' = 'text-gray-900'
    'text-zinc-300' = 'text-gray-600'
    'text-zinc-700' = 'text-gray-700'
    
    # Typography
    'font-black' = 'font-bold'
    'font-extrabold' = 'font-semibold'
    
    # Border radius
    'rounded-2xl' = 'rounded-3xl'
    'rounded-xl' = 'rounded-2xl'
    
    # Shadows - remove hard comic shadows
    'shadow-\[8px_8px_0px_0px_rgba\(0,0,0,1\)\]' = 'shadow-lg'
    'shadow-\[6px_6px_0px_rgba\(0,0,0,1\)\]' = 'shadow-md'
    'shadow-\[4px_4px_0px_#000000\]' = 'shadow-sm'
    'shadow-\[3px_3px_0px_#000000\]' = 'shadow-sm'
    'shadow-\[12px_12px_0px_#000000\]' = 'shadow-xl'
    
    # Animations
    'duration-200' = 'duration-300 ease-out'
    'translate-y-\[-4px\]' = 'translate-y-[-2px]'
    
    # Spacing
    'gap-4' = 'gap-6'
    'p-6' = 'p-8'
}

$files = Get-ChildItem -Path "apps/web/src" -Include *.tsx,*.ts -Recurse -File

$totalChanges = 0

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw -ErrorAction SilentlyContinue
    if (!$content) { continue }
    
    $originalContent = $content
    
    foreach ($old in $replacements.Keys) {
        $new = $replacements[$old]
        $content = $content -replace [regex]::Escape($old), $new
    }
    
    if ($content -ne $originalContent) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        $totalChanges++
        Write-Host "  ✓ $($file.Name)" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "🎉 Conversion Complete!" -ForegroundColor Green
Write-Host "  Files changed: $totalChanges" -ForegroundColor Cyan
Write-Host ""
Write-Host "🔄 Restart dev server to see changes!" -ForegroundColor Yellow
