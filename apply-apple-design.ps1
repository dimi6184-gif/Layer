# ═══════════════════════════════════════════════════════════════
# 🍎 APPLE DESIGN SYSTEM - Clean & Minimal Transformation
# ═══════════════════════════════════════════════════════════════

Write-Host "🍎 Converting to Apple Design System..." -ForegroundColor Yellow
Write-Host ""

$replacements = @(
    # Comic → Apple Card
    @{
        Old = 'comic-card'
        New = 'apple-card'
        Desc = 'Card components'
    },
    @{
        Old = 'comic-panel'
        New = 'apple-card'
        Desc = 'Panel components'
    },
    
    # Comic → Apple Button
    @{
        Old = 'comic-button'
        New = 'apple-button'
        Desc = 'Primary buttons'
    },
    @{
        Old = 'bg-gradient-to-r from-yellow-400 to-yellow-500'
        New = 'apple-button'
        Desc = 'Gradient buttons → Apple buttons'
    },
    
    # Border & Shadow conversions
    @{
        Old = 'border-4 border-black'
        New = 'border border-gray-200/20'
        Desc = 'Thick borders → Subtle borders'
    },
    @{
        Old = 'border-3 border-black'
        New = 'border border-gray-200/20'
        Desc = 'Comic borders → Apple borders'
    },
    @{
        Old = 'shadow-\[8px_8px_0px_0px_rgba\(0,0,0,1\)\]'
        New = 'shadow-lg'
        Desc = 'Hard shadows → Soft shadows'
    },
    @{
        Old = 'shadow-\[6px_6px_0px_0px_rgba\(0,0,0,1\)\]'
        New = 'shadow-md'
        Desc = 'Hard shadows → Soft shadows'
    },
    @{
        Old = 'shadow-\[4px_4px_0px_0px_rgba\(0,0,0,1\)\]'
        New = 'shadow-sm'
        Desc = 'Hard shadows → Soft shadows'
    },
    
    # Background conversions
    @{
        Old = 'bg-black'
        New = 'apple-blur-dark'
        Desc = 'Solid black → Glass dark'
    },
    @{
        Old = 'bg-white'
        New = 'apple-blur'
        Desc = 'Solid white → Glass light'
    },
    @{
        Old = 'bg-yellow-400'
        New = 'bg-yellow-500/10 backdrop-blur-sm'
        Desc = 'Solid yellow → Subtle yellow'
    },
    
    # Border radius
    @{
        Old = 'rounded-2xl'
        New = 'rounded-3xl'
        Desc = 'More rounded corners'
    },
    @{
        Old = 'rounded-xl'
        New = 'rounded-2xl'
        Desc = 'More rounded corners'
    },
    
    # Text styling
    @{
        Old = 'font-black'
        New = 'font-bold'
        Desc = 'Less aggressive font weight'
    },
    @{
        Old = 'font-extrabold'
        New = 'font-semibold'
        Desc = 'Subtle font weight'
    },
    
    # Hover effects
    @{
        Old = 'hover:translate-y-\[-4px\]'
        New = 'hover:translate-y-[-2px]'
        Desc = 'Subtle hover movement'
    },
    @{
        Old = 'active:translate-y-\[2px\]'
        New = 'active:scale-[0.98]'
        Desc = 'Scale down on press'
    },
    
    # Remove comic elements
    @{
        Old = 'wiggle'
        New = 'scale-in'
        Desc = 'Wiggle → Scale animation'
    },
    @{
        Old = 'speech-bubble'
        New = 'apple-notification'
        Desc = 'Speech bubble → Notification'
    },
    @{
        Old = 'comic-badge'
        New = 'apple-badge'
        Desc = 'Comic badge → Apple badge'
    },
    
    # Gap & spacing (more generous)
    @{
        Old = 'gap-4'
        New = 'gap-6'
        Desc = 'More whitespace'
    },
    @{
        Old = 'gap-6'
        New = 'gap-8'
        Desc = 'More whitespace'
    },
    @{
        Old = 'p-6'
        New = 'p-8'
        Desc = 'More padding'
    },
    
    # Transitions
    @{
        Old = 'transition-all duration-200'
        New = 'transition-all duration-300 ease-out'
        Desc = 'Smoother transitions'
    }
)

$files = Get-ChildItem -Path "apps/web/src" -Include *.tsx,*.ts,*.jsx,*.js -Recurse

$totalFiles = $files.Count
$processedFiles = 0
$changesCount = 0

foreach ($file in $files) {
    $processedFiles++
    $content = Get-Content $file.FullName -Raw -ErrorAction SilentlyContinue
    
    if ($null -eq $content) { continue }
    
    $originalContent = $content
    $fileChanges = 0
    
    foreach ($replacement in $replacements) {
        if ($content -match [regex]::Escape($replacement.Old)) {
            $content = $content -replace [regex]::Escape($replacement.Old), $replacement.New
            $fileChanges++
        }
    }
    
    if ($content -ne $originalContent) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        $changesCount += $fileChanges
        Write-Host "  ✓ $($file.Name) - $fileChanges changes" -ForegroundColor Green
    }
    
    $progress = [math]::Round(($processedFiles / $totalFiles) * 100)
    Write-Progress -Activity "Converting to Apple Design" -Status "$progress% Complete" -PercentComplete $progress
}

Write-Progress -Activity "Converting to Apple Design" -Completed

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "🍎 Apple Design Conversion Complete!" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "  📊 Files processed: $totalFiles" -ForegroundColor White
Write-Host "  ✨ Changes applied: $changesCount" -ForegroundColor Yellow
Write-Host ""
Write-Host "🎨 Design Features:" -ForegroundColor Cyan
Write-Host "  • Glassmorphism & Frosted Glass" -ForegroundColor White
Write-Host "  • Soft shadows & subtle borders" -ForegroundColor White
Write-Host "  • Clean Inter typography" -ForegroundColor White
Write-Host "  • Generous whitespace" -ForegroundColor White
Write-Host "  • Smooth animations (300ms ease-out)" -ForegroundColor White
Write-Host "  • Yellow accent with subtlety" -ForegroundColor White
Write-Host ""
Write-Host "🔄 Restart the dev server to see changes!" -ForegroundColor Yellow
Write-Host ""
