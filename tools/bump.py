#!/usr/bin/env python3
"""更新 version.json、sw.js、app.js 的版本號（讓已安裝的手機自動換新版）。"""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from update import bump_version
print(bump_version())
