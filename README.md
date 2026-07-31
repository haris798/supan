# Supabase Dashboard

A modern, dark-themed dashboard application for monitoring your Supabase projects. This app provides real-time insights into your database's performance, size, and user metrics, wrapped in a beautiful UI inspired by Supabase's native design.

## Features

- 📊 **Real-time Metrics**: Monitor database size, active connections, table counts, and authenticated users.
- 🗄️ **Table Insights**: Automatically identifies and lists the largest tables in your PostgreSQL database.
- 📱 **Progressive Web App (PWA)**: Installable on supported browsers for a native-like desktop and mobile experience.
- 🤖 **Android Ready**: Fully configured with Capacitor to wrap the web app into a native Android APK.
- ⚙️ **Automated Builds**: Includes a GitHub Actions workflow to automatically build and output the Android APK upon pushing to the `main` branch.

## Setup Instructions

### 1. Database Preparation
To allow the dashboard to fetch real-time metrics, you need to execute two SQL functions in your Supabase project's SQL Editor. You can find the required SQL commands in the `src/sql_instructions.txt` file.

### 2. Connect Your Project
1. Open the Supabase Dashboard app.
2. Click on the settings/configuration icon in the top right.
3. Enter your Supabase Project URL and Anon Key.
4. The dashboard will automatically begin fetching and displaying your live database metrics.

## Tech Stack

- **Frontend Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Database Client**: `@supabase/supabase-js`
- **Mobile Build**: Capacitor (`@capacitor/android`)
- **PWA**: `vite-plugin-pwa`

## Building for Android

This project is pre-configured with a GitHub Actions workflow to automate APK generation.
1. Push your code to a GitHub repository.
2. Navigate to the **Actions** tab in your GitHub repository.
3. The `Build Android APK` workflow will run automatically on pushes to the `main` branch, or it can be triggered manually.
4. Once the build finishes, you can download the generated `app-debug.apk` from the workflow artifacts.
