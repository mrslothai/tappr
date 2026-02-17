"""Sarvam AI transcription integration for Hinglish."""
import asyncio
import httpx
from typing import List, Optional
from models import Word, TranscriptResult
from config import get_settings

SARVAM_BASE_URL = "https://api.sarvam.ai"

# Flag to indicate Sarvam module is available
SARVAM_AVAILABLE = True


class SarvamTranscriptionError(Exception):
    """Error during Sarvam transcription."""
    pass


async def transcribe_audio_sarvam(
    audio_path: str,
    language_code: str = "hi-IN",  # Hindi/Hinglish
    output_script: str = "hinglish",  # "hinglish" or "devanagari"
) -> TranscriptResult:
    """
    Transcribe audio using Sarvam AI.
    
    Args:
        audio_path: Path to local audio file
        language_code: Language code (default 'hi-IN' for Hindi/Hinglish)
        output_script: "hinglish" for Roman script, "devanagari" for Hindi script
    
    Returns:
        TranscriptResult with word-level timestamps
    """
    settings = get_settings()
    
    if not settings.sarvam_api_key:
        raise SarvamTranscriptionError("SARVAM_API_KEY not configured")
    
    # Import transliterator for Hinglish conversion
    from hinglish_transliterator import devanagari_to_hinglish, transliterate_batch
    
    # Read audio file content first
    with open(audio_path, "rb") as f:
        audio_content = f.read()
    
    async with httpx.AsyncClient() as client:
        # Build multipart form data with file content
        files = {"file": ("audio.wav", audio_content, "audio/wav")}
        data = {"language_code": language_code}
        
        response = await client.post(
            f"{SARVAM_BASE_URL}/speech-to-text",
            headers={
                "api-subscription-key": settings.sarvam_api_key,
            },
            data=data,
            files=files,
            timeout=300.0,
        )
        
        print(f"Sarvam API Response Status: {response.status_code}")
        
        if response.status_code != 200:
            raise SarvamTranscriptionError(
                f"Transcription failed: {response.status_code} - {response.text}"
            )
        
        result = response.json()
        print(f"Sarvam API Response: {result}")
        
        # Parse the response - Sarvam returns transcript with optional timestamps
        full_text = result.get("transcript", result.get("text", ""))
        
        # Convert Devanagari to Hinglish if requested
        if output_script == "hinglish":
            print(f"Converting Devanagari to Hinglish...")
            full_text = devanagari_to_hinglish(full_text)
            print(f"Converted text: {full_text[:100]}...")
        
        # Parse word-level timestamps if available
        words = []
        word_data_list = []
        
        if "timestamped_transcript" in result and result["timestamped_transcript"]:
            # Format with word timestamps
            for item in result["timestamped_transcript"]:
                word_data_list.append({
                    "text": item.get("word", ""),
                    "start": int(item.get("start_time", 0) * 1000),
                    "end": int(item.get("end_time", 0) * 1000),
                    "confidence": item.get("confidence", 1.0),
                })
        elif "words" in result and result["words"]:
            # Alternative format
            for word_data in result["words"]:
                word_data_list.append({
                    "text": word_data.get("word", word_data.get("text", "")),
                    "start": int(word_data.get("start", word_data.get("start_time", 0)) * 1000),
                    "end": int(word_data.get("end", word_data.get("end_time", 0)) * 1000),
                    "confidence": word_data.get("confidence", 1.0),
                })
        
        # Batch transliterate words if Hinglish output requested
        if word_data_list and output_script == "hinglish":
            word_texts = [w["text"] for w in word_data_list]
            transliterated_texts = transliterate_batch(word_texts)
            
            for i, word_data in enumerate(word_data_list):
                words.append(Word(
                    text=transliterated_texts[i],
                    start=word_data["start"],
                    end=word_data["end"],
                    confidence=word_data["confidence"],
                ))
        elif word_data_list:
            # No transliteration needed
            for word_data in word_data_list:
                words.append(Word(
                    text=word_data["text"],
                    start=word_data["start"],
                    end=word_data["end"],
                    confidence=word_data["confidence"],
                ))
        
        # If no word timestamps from API, split the text ourselves
        if not words and full_text:
            import re
            
            # Get actual audio duration if possible
            audio_duration_ms = 60000  # Default 60s fallback
            try:
                import subprocess
                result = subprocess.run(
                    ["ffprobe", "-v", "error", "-show_entries", "format=duration",
                     "-of", "default=noprint_wrappers=1:nokey=1", audio_path],
                    capture_output=True, text=True
                )
                if result.returncode == 0:
                    audio_duration_ms = int(float(result.stdout.strip()) * 1000)
            except Exception:
                pass
            
            # Split into words (handle both Hinglish and Devanagari)
            text_words = re.findall(r'\S+', full_text)
            
            if text_words:
                # Distribute words evenly across duration
                word_duration = audio_duration_ms // len(text_words)
                
                for i, word_text in enumerate(text_words):
                    start_ms = i * word_duration
                    end_ms = min((i + 1) * word_duration, audio_duration_ms)
                    words.append(Word(
                        text=word_text,
                        start=start_ms,
                        end=end_ms,
                        confidence=1.0,
                    ))
        
        if not words:
            # Absolute fallback
            words = [Word(text=full_text or "No transcription", start=0, end=60000, confidence=1.0)]
        
        return TranscriptResult(
            words=words,
            text=full_text,
            language=language_code,
        )


async def transcribe_from_url_sarvam(
    audio_url: str,
    language_code: str = "hi-IN",
    output_script: str = "hinglish",
) -> TranscriptResult:
    """
    Transcribe audio from a URL using Sarvam AI.
    
    Note: Sarvam requires file upload, so we download first then upload.
    """
    # Download the audio file first
    async with httpx.AsyncClient() as client:
        response = await client.get(audio_url, timeout=60.0)
        if response.status_code != 200:
            raise SarvamTranscriptionError(f"Failed to download audio: {response.status_code}")
        
        # Save to temp file
        import tempfile
        import os
        
        with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tmp:
            tmp.write(response.content)
            tmp_path = tmp.name
        
        try:
            # Transcribe
            result = await transcribe_audio_sarvam(tmp_path, language_code, output_script)
        finally:
            # Cleanup
            if os.path.exists(tmp_path):
                os.remove(tmp_path)
        
        return result


async def batch_transcribe_sarvam(
    audio_paths: List[str],
    language_code: str = "hi-IN",
    output_script: str = "hinglish",
) -> List[TranscriptResult]:
    """Transcribe multiple audio files concurrently."""
    tasks = [
        transcribe_audio_sarvam(path, language_code, output_script)
        for path in audio_paths
    ]
    return await asyncio.gather(*tasks, return_exceptions=True)


def correct_common_hinglish_misspellings(text: str) -> str:
    """
    Post-process Hinglish text to fix common misspellings.
    This adds a safety net even with Sarvam's good transcription.
    """
    corrections = {
        # Common transcription errors
        "mein": "main",
        "hoon": "hun",
        "tumhara": "tumara",
        "aapka": "apka",
        "kyun": "kyu",
        "kyunki": "kyuki",
        "kyoki": "kyuki",
        "lekin": "lekin",
        "magar": "magar",
        "par": "par",
        "kyu ki": "kyunki",
        "kyun ki": "kyunki",
        "kya": "kya",
        "hai": "hai",
        "hain": "hain",
        "thi": "thi",
        "the": "the",
        "tha": "tha",
        "raha": "raha",
        "rahi": "rahi",
        "rahe": "rahe",
        "gaya": "gaya",
        "gayi": "gayi",
        "gaye": "gaye",
        "diya": "diya",
        "diye": "diye",
        "liya": "liya",
        "liye": "liye",
        "hua": "hua",
        "hui": "hui",
        "hue": "hue",
        "karna": "karna",
        "karne": "karne",
        "karte": "karte",
        "karti": "karti",
        "karta": "karta",
        "kar raha": "kar raha",
        "kar rahi": "kar rahi",
        "kar rahe": "kar rahe",
        "ho raha": "ho raha",
        "ho rahi": "ho rahi",
        "ho rahe": "ho rahe",
        "chahiye": "chahiye",
        "chahie": "chahiye",
        "zindagi": "zindagi",
        "jindagi": "zindagi",
        "mujhe": "mujhe",
        "mujhse": "mujhse",
        "tujhe": "tujhe",
        "tujhse": "tujhse",
        "isse": "isse",
        "usse": "usse",
        "jisse": "jisse",
        "kaise": "kaise",
        "kab": "kab",
        "kahan": "kahan",
        "kidhar": "kidhar",
        "kisne": "kisne",
        "kisko": "kisko",
        "kisliye": "kisliye",
        "iske": "iske",
        "uske": "uske",
        "jiske": "jiske",
        "iska": "iska",
        "uska": "uska",
        "jiska": "jiska",
        "isko": "isko",
        "usko": "usko",
        "bhi": "bhi",
        "hi": "hi",
        "to": "to",
        "se": "se",
        "ko": "ko",
        "ke": "ke",
        "ka": "ka",
        "ki": "ki",
        "me": "mein",
        "mein": "mein",
        "mai": "main",
        "main": "main",
        "hum": "hum",
        "tum": "tum",
        "aap": "aap",
        "woh": "woh",
        "yeh": "yeh",
        "jab": "jab",
        "tab": "tab",
        "agar": "agar",
        "nahi": "nahi",
        "na": "na",
        "mat": "mat",
        "matlab": "matlab",
        "baat": "baat",
        "sach": "sach",
        "jhooth": "jhooth",
        "achha": "acha",
        "accha": "acha",
        "bura": "bura",
        "bahut": "bahut",
        "zyada": "zyada",
        "jyada": "zyada",
        "kam": "kam",
        "thora": "thora",
        "thoda": "thoda",
        "sab": "sab",
        "kuch": "kuch",
        "koi": "koi",
        "har": "har",
        "ek": "ek",
        "do": "do",
        "dono": "dono",
        "aur": "aur",
        "ya": "ya",
        "phir": "phir",
        "fir": "phir",
        "pehle": "pehle",
        "phle": "pehle",
        "baad": "baad",
        "baad mein": "baad mein",
        "abhi": "abhi",
        "ab": "ab",
        "pehli": "pehli",
        "doosra": "doosra",
        "dusra": "doosra",
        "teesra": "teesra",
        "chautha": "chautha",
        "aakhri": "aakhri",
        "antim": "antim",
        "shuru": "shuru",
        "khatam": "khatam",
        "poora": "poora",
        "adha": "adha",
        "paisa": "paisa",
        "paise": "paise",
        "kaam": "kaam",
        "waqt": "waqt",
        "din": "din",
        "raat": "raat",
        "subah": "subah",
        "shaam": "shaam",
    }
    
    # Apply corrections (case-insensitive but preserve case)
    import re
    
    def replace_word(match):
        word = match.group(0)
        word_lower = word.lower()
        if word_lower in corrections:
            # Preserve original case pattern
            corrected = corrections[word_lower]
            if word.isupper():
                return corrected.upper()
            elif word[0].isupper():
                return corrected.capitalize()
            return corrected
        return word
    
    # Replace whole words only
    pattern = r'\b(' + '|'.join(re.escape(k) for k in corrections.keys()) + r')\b'
    return re.sub(pattern, replace_word, text, flags=re.IGNORECASE)


if __name__ == "__main__":
    # Test
    import asyncio
    
    async def test():
        # Test the correction function
        test_text = "mein tumhara kaam kar raha hoon kyunki yeh zaroori hai"
        print(f"Original: {test_text}")
        print(f"Corrected: {correct_common_hinglish_misspellings(test_text)}")
    
    asyncio.run(test())
