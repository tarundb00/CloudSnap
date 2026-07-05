# Gmail Setup Helper Script for CloudSnap OTP
# This script helps you set environment variables for Gmail SMTP

# STEP 1: Get your Gmail App Password
# =====================================
# 1. Open: https://myaccount.google.com/apppasswords
# 2. If prompted, sign in and enable 2-Step Verification
# 3. Select "Mail" and "Windows Computer"
# 4. Copy the 16-character password Google generates
# 5. Replace the value below

$GMAIL_EMAIL = "tarunbasavaj00@gmail.com"
$GMAIL_APP_PASSWORD = "REPLACE_WITH_YOUR_16_CHAR_PASSWORD"

# STEP 2: Set Environment Variables for this session
# =====================================================
Write-Host "Setting environment variables for this PowerShell session..." -ForegroundColor Green
$env:GMAIL_EMAIL = $GMAIL_EMAIL
$env:GMAIL_APP_PASSWORD = $GMAIL_APP_PASSWORD

Write-Host "✓ GMAIL_EMAIL = $GMAIL_EMAIL" -ForegroundColor Green
Write-Host "✓ GMAIL_APP_PASSWORD = [HIDDEN]" -ForegroundColor Green

# STEP 3: Verify they're set
# ===========================
Write-Host "`nVerifying..." -ForegroundColor Yellow
Write-Host "GMAIL_EMAIL in session: $($env:GMAIL_EMAIL)" -ForegroundColor Cyan
Write-Host "GMAIL_APP_PASSWORD in session: $($env:GMAIL_APP_PASSWORD -replace '.', '*')" -ForegroundColor Cyan

# STEP 4: For permanent setup (requires admin)
# =============================================
Write-Host "`nTo make these permanent, run this as Administrator:" -ForegroundColor Yellow
Write-Host "[System.Environment]::SetEnvironmentVariable('GMAIL_EMAIL', '$GMAIL_EMAIL', 'User')" -ForegroundColor Cyan
Write-Host "[System.Environment]::SetEnvironmentVariable('GMAIL_APP_PASSWORD', '$GMAIL_APP_PASSWORD', 'User')" -ForegroundColor Cyan

Write-Host "`nDone! Now restart your Spring Boot application." -ForegroundColor Green
