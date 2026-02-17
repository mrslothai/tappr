"""Test Sarvam AI Hinglish transcription."""
import asyncio
import os
import sys

# Add backend to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from sarvam_transcriber import (
    transcribe_audio_sarvam,
    correct_common_hinglish_misspellings,
)
from config import get_settings


def test_correction_function():
    """Test the misspelling correction."""
    print("=" * 60)
    print("Testing Hinglish Correction Function")
    print("=" * 60)
    
    test_cases = [
        "mein tumhara kaam kar raha hoon",
        "kyu ki yeh zaroori hai",
        "aapka naam kya hai",
        "main yahan par hun",
        "kya aap mujhse baat kar sakte ho",
    ]
    
    for text in test_cases:
        corrected = correct_common_hinglish_misspellings(text)
        print(f"\nOriginal:  {text}")
        print(f"Corrected: {corrected}")
    
    print("\n" + "=" * 60)


async def test_sarvam_api():
    """Test actual Sarvam API call (requires API key)."""
    settings = get_settings()
    
    print("=" * 60)
    print("Testing Sarvam API")
    print("=" * 60)
    
    if not settings.sarvam_api_key:
        print("\n❌ SARVAM_API_KEY not found in .env")
        print("Add it to test the actual API:")
        print("SARVAM_API_KEY=your_key_here")
        return
    
    print(f"\n✓ API key found: {settings.sarvam_api_key[:10]}...")
    
    # Create a test audio file (you need to provide one)
    test_audio = "test_audio.wav"
    
    if not os.path.exists(test_audio):
        print(f"\n⚠️  Test audio not found: {test_audio}")
        print("Place a test WAV file at: test_audio.wav")
        print("Skipping API test...")
        return
    
    print(f"\n🎙️  Transcribing: {test_audio}")
    
    try:
        result = await transcribe_audio_sarvam(test_audio, language_code="hi-en")
        
        print(f"\n✅ Transcription successful!")
        print(f"\nFull text: {result.text}")
        print(f"\nWord count: {len(result.words)}")
        print("\nFirst 5 words:")
        for word in result.words[:5]:
            print(f"  - {word.text} ({word.start}ms - {word.end}ms)")
        
        # Apply correction
        corrected_text = correct_common_hinglish_misspellings(result.text)
        print(f"\nCorrected: {corrected_text}")
        
    except Exception as e:
        print(f"\n❌ Error: {e}")


def check_environment():
    """Check if environment is properly configured."""
    print("=" * 60)
    print("Environment Check")
    print("=" * 60)
    
    settings = get_settings()
    
    print(f"\nSarvam API Key: {'✓ Set' if settings.sarvam_api_key else '✗ Not set'}")
    print(f"AssemblyAI Key: {'✓ Set' if settings.assemblyai_api_key else '✗ Not set'}")
    print(f"R2 Bucket: {settings.r2_bucket_name}")
    
    # Check dependencies
    try:
        import httpx
        print(f"\n✓ httpx installed")
    except ImportError:
        print(f"\n✗ httpx not installed")
    
    try:
        from sarvam_transcriber import SARVAM_AVAILABLE
        print(f"✓ Sarvam transcriber module loaded")
    except ImportError as e:
        print(f"✗ Failed to load Sarvam transcriber: {e}")


async def main():
    """Run all tests."""
    print("\n🦥 CaptionCraft - Sarvam Hinglish Test")
    print("=" * 60)
    
    check_environment()
    print()
    
    test_correction_function()
    print()
    
    await test_sarvam_api()
    
    print("\n" + "=" * 60)
    print("Test complete!")
    print("=" * 60)


if __name__ == "__main__":
    asyncio.run(main())
