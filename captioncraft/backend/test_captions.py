#!/usr/bin/env python3
"""Test script to verify caption generation and burning without API keys."""
import asyncio
import os
import sys

# Add parent to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from models import Word, CaptionStyle, CaptionPosition, FontFamily
from subtitles import generate_ass_subtitle, group_words_into_lines
from processor import extract_audio, burn_captions, get_video_info


# Sample transcript (simulating AssemblyAI output)
SAMPLE_WORDS = [
    Word(text="Hello", start=100, end=500, confidence=0.99),
    Word(text="and", start=520, end=700, confidence=0.98),
    Word(text="welcome", start=720, end=1200, confidence=0.99),
    Word(text="to", start=1220, end=1400, confidence=0.97),
    Word(text="Caption", start=1420, end=1800, confidence=0.99),
    Word(text="Craft", start=1820, end=2200, confidence=0.99),
    Word(text="the", start=2400, end=2600, confidence=0.95),
    Word(text="best", start=2620, end=2900, confidence=0.99),
    Word(text="caption", start=2920, end=3300, confidence=0.98),
    Word(text="tool", start=3320, end=3700, confidence=0.99),
    Word(text="ever", start=3720, end=4100, confidence=0.97),
]


def test_subtitle_generation():
    """Test ASS subtitle generation for all 4 styles."""
    print("🎬 Testing subtitle generation...")
    
    for style in CaptionStyle:
        print(f"\n  Testing style: {style.value}")
        
        ass_content = generate_ass_subtitle(
            words=SAMPLE_WORDS,
            style=style,
            font=FontFamily.MONTSERRAT,
            position=CaptionPosition.BOTTOM,
            words_per_line=4,
            video_width=1080,
            video_height=1920,
        )
        
        # Save to file
        filename = f"temp/test_{style.value}.ass"
        with open(filename, "w") as f:
            f.write(ass_content)
        
        # Verify content
        assert "[Script Info]" in ass_content
        assert "[V4+ Styles]" in ass_content
        assert "[Events]" in ass_content
        assert "Dialogue:" in ass_content
        
        print(f"    ✅ Generated {filename}")
        print(f"    Preview: {ass_content[:200]}...")
    
    print("\n✅ All subtitle styles generated successfully!")


async def test_audio_extraction():
    """Test FFmpeg audio extraction."""
    print("\n🎵 Testing audio extraction...")
    
    video_path = "temp/test_video.mp4"
    audio_path = "temp/test_audio.wav"
    
    if not os.path.exists(video_path):
        print("  ⚠️ No test video found, skipping audio extraction test")
        return False
    
    await extract_audio(video_path, audio_path)
    
    if os.path.exists(audio_path):
        size = os.path.getsize(audio_path)
        print(f"  ✅ Audio extracted: {audio_path} ({size} bytes)")
        return True
    else:
        print("  ❌ Audio extraction failed")
        return False


async def test_caption_burning():
    """Test FFmpeg caption burning."""
    print("\n🔥 Testing caption burning...")
    
    video_path = "temp/test_video.mp4"
    subtitle_path = "temp/test_classic.ass"
    output_path = "output/test_captioned.mp4"
    
    if not os.path.exists(video_path):
        print("  ⚠️ No test video found, skipping caption burning test")
        return False
    
    if not os.path.exists(subtitle_path):
        print("  ⚠️ No subtitle file found, skipping caption burning test")
        return False
    
    # Get video info
    info = get_video_info(video_path)
    print(f"  Video info: {info}")
    
    # Burn captions
    await burn_captions(
        video_path,
        subtitle_path,
        output_path,
        fonts_dir="fonts"
    )
    
    if os.path.exists(output_path):
        size = os.path.getsize(output_path)
        print(f"  ✅ Captioned video created: {output_path} ({size} bytes)")
        return True
    else:
        print("  ❌ Caption burning failed")
        return False


async def main():
    """Run all tests."""
    print("=" * 50)
    print("CaptionCraft Backend Test Suite")
    print("=" * 50)
    
    # Test 1: Subtitle generation
    test_subtitle_generation()
    
    # Test 2: Audio extraction
    await test_audio_extraction()
    
    # Test 3: Caption burning
    success = await test_caption_burning()
    
    print("\n" + "=" * 50)
    if success:
        print("✅ All tests passed!")
        print("\n📺 View the captioned video at: output/test_captioned.mp4")
    else:
        print("⚠️ Some tests skipped (no test video)")
    print("=" * 50)


if __name__ == "__main__":
    asyncio.run(main())
