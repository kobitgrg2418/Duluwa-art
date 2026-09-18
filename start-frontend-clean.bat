@echo off
echo Clearing Next.js cache...
cd /d "C:\Users\ACER NITRO\Desktop\Duluwa-art\frontend"
if exist .next rmdir /s /q .next
if exist node_modules\.cache rmdir /s /q node_modules\.cache
echo Starting Duluwa Art Gallery frontend...
npm run dev