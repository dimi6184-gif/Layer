# Comic Style: Buttons, Dashboard Cards, and Landing Page Updates
# This script applies bold comic/cartoon styling to all interactive elements

Write-Host "Applying Comic Style to Buttons, Cards, and Landing Page..." -ForegroundColor Yellow

$files = @(
    "apps\web\src\app\(marketing)\page.tsx",
    "apps\web\src\app\(app)\dashboard\[id]\leveling\page.tsx",
    "apps\web\src\app\(app)\dashboard\[id]\page.tsx",
    "apps\web\src\app\(app)\dashboard\[id]\moderation\page.tsx",
    "apps\web\src\app\(app)\dashboard\[id]\ai\page.tsx",
    "apps\web\src\app\(app)\dashboard\[id]\music\page.tsx",
    "apps\web\src\app\(app)\dashboard\[id]\tickets\page.tsx",
    "apps\web\src\app\(app)\dashboard\[id]\welcome\page.tsx",
    "apps\web\src\app\(app)\dashboard\[id]\giveaways\page.tsx",
    "apps\web\src\app\(app)\dashboard\[id]\verification\page.tsx",
    "apps\web\src\app\(app)\dashboard\[id]\logging\page.tsx",
    "apps\web\src\components\ModuleSwitch.tsx",
    "apps\web\src\components\LevelingConfig.tsx"
)

$replacements = @(
    # Replace glass-panel with comic-card
    @{
        Find = 'glass-panel'
        Replace = 'comic-card'
    },
    
    # Update primary buttons to use comic-button
    @{
        Find = 'bg-yellow-400 text-black rounded-xl font-black'
        Replace = 'comic-button rounded-xl'
    },
    
    # Secondary buttons with comic style
    @{
        Find = 'bg-white text-black hover:bg-yellow-400 border-3 border-black'
        Replace = 'comic-button bg-white text-black hover:bg-yellow-400 rounded-xl'
    },
    
    # Update card borders from soft to bold
    @{
        Find = 'border border-white/5'
        Replace = 'border-3 border-black'
    },
    
    # Replace soft shadows with hard comic shadows
    @{
        Find = 'shadow-2xl shadow-yellow-500/50'
        Replace = 'shadow-[8px_8px_0px_#000000]'
    },
    
    @{
        Find = 'shadow-2xl shadow-violet-500/10'
        Replace = 'shadow-[6px_6px_0px_#000000]'
    },
    
    # Update hover shadows
    @{
        Find = 'hover:shadow-\[8px_8px_0px_#000\]'
        Replace = 'hover:shadow-[12px_12px_0px_#000000]'
    },
    
    # Replace backdrop-blur with solid backgrounds
    @{
        Find = 'backdrop-blur-xl'
        Replace = ''
    },
    
    @{
        Find = 'backdrop-blur-sm'
        Replace = ''
    },
    
    # Update badge styles
    @{
        Find = 'px-4 py-2 bg-white/\[0.03\] border-3 border-black rounded-full'
        Replace = 'comic-badge'
    },
    
    # Make fonts bolder
    @{
        Find = 'font-semibold'
        Replace = 'font-black'
    },
    
    @{
        Find = 'font-medium'
        Replace = 'font-bold'
    },
    
    # Update card background to solid white
    @{
        Find = 'bg-\[#0a0a0a\]'
        Replace = 'bg-white'
    },
    
    # Change text colors for white backgrounds
    @{
        Find = 'text-white'
        Replace = 'text-black'
    },
    
    @{
        Find = 'text-zinc-400'
        Replace = 'text-zinc-700'
    },
    
    @{
        Find = 'text-zinc-500'
        Replace = 'text-zinc-600'
    },
    
    # Remove gradient blur effects
    @{
        Find = 'blur-xl'
        Replace = ''
    },
    
    @{
        Find = 'blur-\[50px\]'
        Replace = ''
    },
    
    # Speed up transitions
    @{
        Find = 'transition-all duration-500'
        Replace = 'transition-all duration-200'
    },
    
    @{
        Find = 'transition-all duration-700'
        Replace = 'transition-all duration-200'
    },
    
    @{
        Find = 'transition-transform duration-700'
        Replace = 'transition-transform duration-200'
    },
    
    @{
        Find = 'transition-opacity duration-500'
        Replace = 'transition-opacity duration-200'
    },
    
    # Add comic hover effects
    @{
        Find = 'hover:translate-y-\[-2px\]'
        Replace = 'hover:translate-x-[-2px] hover:translate-y-[-2px]'
    }
)

$totalChanges = 0

foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "`nProcessing: $file" -ForegroundColor Cyan
        $content = Get-Content $file -Raw
        $fileChanges = 0
        
        foreach ($replacement in $replacements) {
            $matches = ([regex]::Matches($content, [regex]::Escape($replacement.Find))).Count
            if ($matches -gt 0) {
                $content = $content -replace [regex]::Escape($replacement.Find), $replacement.Replace
                $fileChanges += $matches
                Write-Host "   Replaced '$($replacement.Find)' - $matches times" -ForegroundColor Green
            }
        }
        
        if ($fileChanges -gt 0) {
            Set-Content $file -Value $content -NoNewline
            $totalChanges += $fileChanges
            Write-Host "   Saved $fileChanges changes" -ForegroundColor Yellow
        } else {
            Write-Host "   No changes needed" -ForegroundColor Gray
        }
    } else {
        Write-Host "   File not found: $file" -ForegroundColor Red
    }
}

Write-Host "`nComic Style Applied!" -ForegroundColor Green
Write-Host "   Total changes: $totalChanges" -ForegroundColor Cyan
Write-Host "   Files processed: $($files.Count)" -ForegroundColor Cyan
Write-Host "`nChanges Made:" -ForegroundColor Yellow
Write-Host "   Buttons to Comic style with bold borders and shadows"
Write-Host "   Cards to White backgrounds with black borders"
Write-Host "   Shadows to Hard 6-8px offset shadows"
Write-Host "   Text to Bolder fonts"
Write-Host "   Transitions to Snappy 200ms animations"
Write-Host "   Removed Blur effects and soft gradients"
Write-Host "`nRestart your dev server to see changes!" -ForegroundColor Magenta
