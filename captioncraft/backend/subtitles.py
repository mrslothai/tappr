"""ASS subtitle generation with multiple caption styles."""
from typing import List
from models import Word, CaptionStyle, CaptionPosition, FontFamily


# ASS style definitions for each caption style
# Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, 
#         Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, 
#         Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding

STYLE_DEFINITIONS = {
    CaptionStyle.CLASSIC: {
        "name": "Classic",
        "desc": "Bold white with black outline",
        "fontsize": 72,
        "primary_color": "&H00FFFFFF",  # White
        "secondary_color": "&H000000FF",
        "outline_color": "&H00000000",  # Black
        "back_color": "&H80000000",
        "bold": 1,
        "border_style": 1,
        "outline": 4,
        "shadow": 2,
    },
    CaptionStyle.HIGHLIGHT: {
        "name": "Highlight",
        "desc": "Yellow highlight TikTok style",
        "fontsize": 68,
        "primary_color": "&H0000D4FF",  # Yellow (BGR format)
        "secondary_color": "&H000000FF",
        "outline_color": "&H00000000",
        "back_color": "&H00000000",
        "bold": 1,
        "border_style": 3,  # Opaque box
        "outline": 0,
        "shadow": 0,
    },
    CaptionStyle.COLORFUL: {
        "name": "Colorful",
        "desc": "Gradient pink/purple style",
        "fontsize": 70,
        "primary_color": "&H00FF88FF",  # Pink (BGR)
        "secondary_color": "&H0088FFFF",
        "outline_color": "&H00000000",
        "back_color": "&H80000000",
        "bold": 1,
        "border_style": 1,
        "outline": 3,
        "shadow": 2,
    },
    CaptionStyle.MINIMAL: {
        "name": "Minimal",
        "desc": "Small, clean, subtle",
        "fontsize": 48,
        "primary_color": "&H00FFFFFF",
        "secondary_color": "&H000000FF",
        "outline_color": "&H00333333",
        "back_color": "&H00000000",
        "bold": 0,
        "border_style": 1,
        "outline": 2,
        "shadow": 1,
    },
}

# Position to ASS alignment mapping
# ASS alignments: 1-3 bottom, 4-6 middle, 7-9 top (left/center/right)
POSITION_ALIGNMENT = {
    CaptionPosition.TOP: 8,      # Top center
    CaptionPosition.CENTER: 5,   # Middle center
    CaptionPosition.BOTTOM: 2,   # Bottom center
}

POSITION_MARGIN_V = {
    CaptionPosition.TOP: 80,
    CaptionPosition.CENTER: 10,
    CaptionPosition.BOTTOM: 100,
}


def ms_to_ass_time(ms: int) -> str:
    """Convert milliseconds to ASS timestamp format (H:MM:SS.cc)."""
    hours = ms // 3600000
    minutes = (ms % 3600000) // 60000
    seconds = (ms % 60000) // 1000
    centiseconds = (ms % 1000) // 10
    return f"{hours}:{minutes:02d}:{seconds:02d}.{centiseconds:02d}"


def group_words_into_lines(words: List[Word], words_per_line: int = 4) -> List[dict]:
    """Group words into subtitle lines based on timing and word count."""
    if not words:
        return []
    
    lines = []
    current_words = []
    
    for word in words:
        current_words.append(word)
        
        # Create a new line when we hit the word limit or detect a natural pause
        if len(current_words) >= words_per_line:
            lines.append({
                "text": " ".join(w.text for w in current_words),
                "start": current_words[0].start,
                "end": current_words[-1].end,
            })
            current_words = []
    
    # Don't forget remaining words
    if current_words:
        lines.append({
            "text": " ".join(w.text for w in current_words),
            "start": current_words[0].start,
            "end": current_words[-1].end,
        })
    
    return lines


def generate_ass_subtitle(
    words: List[Word],
    style: CaptionStyle = CaptionStyle.CLASSIC,
    font: FontFamily = FontFamily.MONTSERRAT,
    position: CaptionPosition = CaptionPosition.BOTTOM,
    words_per_line: int = 4,
    video_width: int = 1080,
    video_height: int = 1920,
) -> str:
    """Generate a complete ASS subtitle file."""
    
    style_def = STYLE_DEFINITIONS[style]
    alignment = POSITION_ALIGNMENT[position]
    margin_v = POSITION_MARGIN_V[position]
    
    # Build the ASS header
    ass_content = f"""[Script Info]
Title: CaptionCraft Subtitles
ScriptType: v4.00+
PlayResX: {video_width}
PlayResY: {video_height}
WrapStyle: 0

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,{font.value},{style_def['fontsize']},{style_def['primary_color']},{style_def['secondary_color']},{style_def['outline_color']},{style_def['back_color']},{style_def['bold']},0,0,0,100,100,0,0,{style_def['border_style']},{style_def['outline']},{style_def['shadow']},{alignment},20,20,{margin_v},1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""
    
    # Group words into lines and create dialogue events
    lines = group_words_into_lines(words, words_per_line)
    
    for line in lines:
        start_time = ms_to_ass_time(line["start"])
        end_time = ms_to_ass_time(line["end"])
        text = line["text"].replace("\n", "\\N")
        
        ass_content += f"Dialogue: 0,{start_time},{end_time},Default,,0,0,0,,{text}\n"
    
    return ass_content


def get_style_info(style: CaptionStyle) -> dict:
    """Get information about a caption style for preview."""
    style_def = STYLE_DEFINITIONS[style]
    return {
        "name": style_def["name"],
        "description": style_def["desc"],
        "preview_color": style_def["primary_color"],
        "font_default": "Montserrat",
    }


# All 4 styles ready for use
AVAILABLE_STYLES = [
    {"id": "classic", "name": "Classic", "description": "Bold white with black outline - timeless look"},
    {"id": "highlight", "name": "Highlight", "description": "Yellow highlight box - TikTok/Reels style"},
    {"id": "colorful", "name": "Colorful", "description": "Pink gradient with glow - eye-catching"},
    {"id": "minimal", "name": "Minimal", "description": "Small and clean - let the video shine"},
]
