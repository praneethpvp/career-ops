#!/bin/bash
# Career-Ops Setup Script for Praneeth Varma
# This script clones the career-ops repo and merges your personalized config files.

set -e

echo "🚀 Career-Ops Setup for Praneeth Varma"
echo "========================================="
echo ""

# Get the directory where this script lives
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Check prerequisites
echo "📋 Checking prerequisites..."

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Install it: https://nodejs.org/"
    exit 1
fi
echo "✅ Node.js $(node -v)"

# Check npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm not found."
    exit 1
fi
echo "✅ npm $(npm -v)"

# Check git
if ! command -v git &> /dev/null; then
    echo "❌ git not found."
    exit 1
fi
echo "✅ git $(git --version | cut -d' ' -f3)"

# Check Claude Code
if command -v claude &> /dev/null; then
    echo "✅ Claude Code found"
else
    echo "⚠️  Claude Code not found. Install it: https://docs.claude.com/en/docs/claude-code"
    echo "   (You can still set up the repo, but won't be able to run career-ops commands)"
fi

echo ""
echo "📦 Cloning career-ops repository..."

# Clone into a temp location, then merge
TEMP_DIR=$(mktemp -d)
git clone https://github.com/praneethpvp/career-ops.git "$TEMP_DIR/career-ops"

echo ""
echo "📁 Merging repo with your personalized files..."

# Copy repo contents to script directory (preserving our custom files)
# First, copy all repo files
rsync -a --ignore-existing "$TEMP_DIR/career-ops/" "$SCRIPT_DIR/"

# Now overwrite with our personalized versions (these take priority)
cp "$SCRIPT_DIR/config/profile.yml" "$SCRIPT_DIR/config/profile.yml"  # Already in place
cp "$SCRIPT_DIR/cv.md" "$SCRIPT_DIR/cv.md"  # Already in place
cp "$SCRIPT_DIR/portals.yml" "$SCRIPT_DIR/portals.yml"  # Already in place
cp "$SCRIPT_DIR/_profile.md" "$SCRIPT_DIR/_profile.md"  # Already in place

# Clean up
rm -rf "$TEMP_DIR"

echo ""
echo "📥 Installing dependencies..."
cd "$SCRIPT_DIR"
npm install

echo ""
echo "🎭 Installing Playwright (for PDF generation)..."
npx playwright install chromium

echo ""
echo "🏥 Running doctor check..."
npm run doctor || echo "⚠️  Some checks may need attention (see above)"

echo ""
echo "========================================="
echo "✅ Career-Ops is ready!"
echo ""
echo "Next steps:"
echo "  1. cd \"$SCRIPT_DIR\""
echo "  2. Run 'claude' to open Claude Code"
echo "  3. Paste a job URL or type /career-ops to get started"
echo ""
echo "Your personalized files are already configured:"
echo "  - config/profile.yml  (your contact info, target roles, narrative)"
echo "  - cv.md               (your full CV in markdown)"
echo "  - portals.yml         (60+ companies to scan)"
echo "  - _profile.md         (your career context & scoring adjustments)"
echo ""
echo "Happy job hunting! 🎯"
