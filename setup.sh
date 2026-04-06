#!/bin/bash

echo "Setup project dimulai..."

echo "Install backend dependencies..."
cd backend
pip install -r requirements.txt

echo "Install frontend dependencies..."
cd ../frontend
npm install

echo "Setup selesai!"