@echo off
echo ============================================
echo   Sistema de Gestion de RRHH - DEV MODE
echo ============================================
echo.
echo Levantando servicios...
echo.

REM Terminal 1: PHP Artisan Serve
start "Laravel Server" cmd /k "echo [LARAVEL SERVER] && php artisan serve"

REM Esperar 2 segundos
timeout /t 2 /nobreak >nul

REM Terminal 2: NPM Run Dev (Vite)
start "Vite Frontend" cmd /k "echo [VITE FRONTEND] && npm run dev"

REM Esperar 1 segundo
timeout /t 1 /nobreak >nul

REM Terminal 3: Composer Run Dev
start "Composer Dev" cmd /k "echo [COMPOSER DEV] && composer run dev"

REM Esperar 1 segundo
timeout /t 1 /nobreak >nul

REM Terminal 4: Reverb WebSocket
start "Reverb WebSocket" cmd /k "echo [REVERB WEBSOCKET] && php artisan reverb:start"

echo.
echo ============================================
echo   Servicios levantados correctamente!
echo ============================================
echo.
echo [1] Laravel Server    - http://localhost:8000
echo [2] Vite Frontend     - http://localhost:5173
echo [3] Composer Dev      - Ejecutando...
echo [4] Reverb WebSocket  - ws://localhost:8080
echo.
echo Presiona cualquier tecla para cerrar esta ventana...
pause >nul
