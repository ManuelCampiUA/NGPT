Set-Location $PSScriptRoot
& .venv\Scripts\waitress-serve --port=5000 --call app:create_app