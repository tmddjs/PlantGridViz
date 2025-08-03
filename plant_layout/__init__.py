import os

# Configure Matplotlib to display Hangul characters if available.
try:  # pragma: no cover - font configuration best effort
    import matplotlib
    from matplotlib import font_manager

    font_path = os.environ.get(
        "HANGUL_FONT_PATH", "/usr/share/fonts/truetype/nanum/NanumGothic.ttf"
    )
    if os.path.exists(font_path):
        font_manager.fontManager.addfont(font_path)
        font_name = font_manager.FontProperties(fname=font_path).get_name()
        matplotlib.rcParams["font.family"] = font_name
        matplotlib.rcParams["axes.unicode_minus"] = False
except Exception:
    # Matplotlib might not be installed or the font missing; ignore in that case.
    pass
