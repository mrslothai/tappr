#!/usr/bin/env python3
"""
Full End-to-End Pipeline Test for CaptionCraft Hinglish
Tests: Hindi audio → Sarvam AI → Hinglish → Word-level captions
"""

import os
import asyncio
import json
from dotenv import load_dotenv

# Load environment
load_dotenv()

async def test_sarvam_api():
    """Test Step 1 & 2: Sarvam API connection and transcription"""
    print("\n" + "="*60)
    print("TEST 1: Sarvam API Transcription (Hinglish)")
    print("="*60)
    
    try:
        from sarvam_transcriber import transcribe_audio_sarvam
        
        audio_path = "temp/test_hindi_audio.wav"
        print(f"📁 Audio file: {audio_path}")
        print(f"📏 File size: {os.path.getsize(audio_path)} bytes")
        
        print("\n🔄 Calling Sarvam API with output_script='hinglish'...")
        result = await transcribe_audio_sarvam(
            audio_path, 
            language_code="hi-IN", 
            output_script="hinglish"
        )
        
        print("\n✅ Sarvam API Response Received!")
        print(f"\n📝 Full Transcript:\n{result['text']}")
        
        # Verification checks
        checks = {
            "1. API Response (not 403)": result is not None and 'text' in result,
            "2. Hinglish (Roman script)": has_hinglish_script(result['text']),
            "3. Word-level timestamps present": 'words' in result and len(result.get('words', [])) > 0,
            "4. English words preserved": has_english_words(result['text']),
            "5. Output looks natural": len(result['text']) > 10 and not result['text'].startswith('Error')
        }
        
        print("\n" + "="*60)
        print("VERIFICATION CHECKS:")
        print("="*60)
        for check, passed in checks.items():
            status = "✅ PASS" if passed else "❌ FAIL"
            print(f"{status} - {check}")
        
        # Word-level details
        if 'words' in result:
            print(f"\n📊 Word Count: {len(result['words'])} words")
            print("\n🔤 First 10 words with timestamps:")
            for i, word in enumerate(result['words'][:10]):
                print(f"  {i+1}. '{word.get('word')}' @ {word.get('start', 0):.2f}s - {word.get('end', 0):.2f}s")
        
        return result, all(checks.values())
        
    except Exception as e:
        print(f"\n❌ ERROR: {e}")
        import traceback
        traceback.print_exc()
        return None, False

def has_hinglish_script(text):
    """Check if text is in Roman script (not Devanagari)"""
    if not text:
        return False
    # If text contains Hindi/Devanagari characters, it's NOT Hinglish
    devanagari_range = range(0x0900, 0x097F)
    has_devanagari = any(ord(char) in devanagari_range for char in text)
    # Should have Latin characters
    has_latin = any(ord(char) < 128 and char.isalpha() for char in text)
    return has_latin and not has_devanagari

def has_english_words(text):
    """Check if common English words are present"""
    english_keywords = ['AI', 'tools', 'developer', 'coding', 'code', 'tool']
    text_lower = text.lower()
    found = [word for word in english_keywords if word.lower() in text_lower]
    print(f"\n🔍 English words found: {found if found else 'None'}")
    return len(found) > 0

async def test_processor_pipeline():
    """Test Step 4: Full processor.py pipeline"""
    print("\n" + "="*60)
    print("TEST 2: processor.py Pipeline")
    print("="*60)
    
    try:
        from processor import process_audio_to_captions
        
        audio_path = "temp/test_hindi_audio.wav"
        print(f"📁 Processing: {audio_path}")
        
        print("\n🔄 Running full pipeline (processor.py)...")
        captions = await process_audio_to_captions(
            audio_path,
            language="hi-IN",
            output_script="hinglish"
        )
        
        print(f"\n✅ Pipeline Complete!")
        print(f"📊 Generated {len(captions)} caption segments")
        
        print("\n📝 Sample Captions:")
        for i, caption in enumerate(captions[:5]):
            print(f"  {i+1}. [{caption.get('start', 0):.2f}s - {caption.get('end', 0):.2f}s]: {caption.get('text', '')}")
        
        checks = {
            "Captions generated": len(captions) > 0,
            "Has timestamps": all('start' in c and 'end' in c for c in captions[:5]),
            "Has text content": all('text' in c and len(c['text']) > 0 for c in captions[:5]),
            "Timing is sequential": all(captions[i]['start'] <= captions[i]['end'] for i in range(min(5, len(captions))))
        }
        
        print("\n" + "="*60)
        print("PROCESSOR CHECKS:")
        print("="*60)
        for check, passed in checks.items():
            status = "✅ PASS" if passed else "❌ FAIL"
            print(f"{status} - {check}")
        
        return captions, all(checks.values())
        
    except Exception as e:
        print(f"\n❌ ERROR in processor pipeline: {e}")
        import traceback
        traceback.print_exc()
        return None, False

async def main():
    print("\n🚀 CAPTIONCRAFT HINGLISH PIPELINE - FULL E2E TEST")
    print("="*60)
    
    # Test 1: Sarvam API
    sarvam_result, sarvam_pass = await test_sarvam_api()
    
    # Test 2: Processor pipeline
    processor_result, processor_pass = await test_processor_pipeline()
    
    # Final summary
    print("\n" + "="*60)
    print("FINAL TEST SUMMARY")
    print("="*60)
    
    total_tests = 2
    passed_tests = sum([sarvam_pass, processor_pass])
    
    print(f"Total Tests: {total_tests}")
    print(f"Passed: {passed_tests} ✅")
    print(f"Failed: {total_tests - passed_tests} ❌")
    
    if passed_tests == total_tests:
        print("\n🎉 ✅ SHIP IT — All tests passed! CaptionCraft Hinglish is READY!")
    else:
        print(f"\n⚠️ ❌ NEEDS FIXES — {total_tests - passed_tests}/{total_tests} tests failed")
    
    print("="*60)

if __name__ == "__main__":
    asyncio.run(main())
