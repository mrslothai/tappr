"""AssemblyAI transcription integration."""
import asyncio
import httpx
from typing import List, Optional
from models import Word, TranscriptResult
from config import get_settings

ASSEMBLYAI_BASE_URL = "https://api.assemblyai.com/v2"


class TranscriptionError(Exception):
    """Error during transcription."""
    pass


async def upload_audio_to_assemblyai(audio_path: str) -> str:
    """Upload local audio file to AssemblyAI and return the upload URL."""
    settings = get_settings()
    
    async with httpx.AsyncClient() as client:
        with open(audio_path, "rb") as f:
            response = await client.post(
                f"{ASSEMBLYAI_BASE_URL}/upload",
                headers={"Authorization": settings.assemblyai_api_key},
                content=f.read(),
                timeout=300.0,  # 5 min timeout for large files
            )
        
        if response.status_code != 200:
            raise TranscriptionError(f"Upload failed: {response.text}")
        
        return response.json()["upload_url"]


async def start_transcription(
    audio_url: str,
    language: str = "en",
    word_boost: Optional[List[str]] = None,
) -> str:
    """Start a transcription job and return the transcript ID."""
    settings = get_settings()
    
    payload = {
        "audio_url": audio_url,
        "language_code": language,
        "speech_models": ["universal-3-pro", "universal-2"],  # Both for 99 languages
    }
    
    if word_boost:
        payload["word_boost"] = word_boost
    
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{ASSEMBLYAI_BASE_URL}/transcript",
            headers={
                "Authorization": settings.assemblyai_api_key,
                "Content-Type": "application/json",
            },
            json=payload,
            timeout=30.0,
        )
        
        if response.status_code != 200:
            raise TranscriptionError(f"Failed to start transcription: {response.text}")
        
        return response.json()["id"]


async def poll_transcription(transcript_id: str, poll_interval: float = 3.0) -> dict:
    """Poll for transcription completion."""
    settings = get_settings()
    
    async with httpx.AsyncClient() as client:
        while True:
            response = await client.get(
                f"{ASSEMBLYAI_BASE_URL}/transcript/{transcript_id}",
                headers={"Authorization": settings.assemblyai_api_key},
                timeout=30.0,
            )
            
            if response.status_code != 200:
                raise TranscriptionError(f"Failed to get transcript: {response.text}")
            
            result = response.json()
            status = result["status"]
            
            if status == "completed":
                return result
            elif status == "error":
                raise TranscriptionError(f"Transcription failed: {result.get('error', 'Unknown error')}")
            
            # Still processing, wait and poll again
            await asyncio.sleep(poll_interval)


async def transcribe_audio(
    audio_path: str,
    language: str = "en",
    word_boost: Optional[List[str]] = None,
) -> TranscriptResult:
    """
    Complete transcription pipeline:
    1. Upload audio to AssemblyAI
    2. Start transcription
    3. Poll for completion
    4. Return structured result with word timings
    """
    # Step 1: Upload audio
    upload_url = await upload_audio_to_assemblyai(audio_path)
    
    # Step 2: Start transcription
    transcript_id = await start_transcription(upload_url, language, word_boost)
    
    # Step 3: Poll for completion
    result = await poll_transcription(transcript_id)
    
    # Step 4: Parse words
    words = []
    for word_data in result.get("words", []):
        words.append(Word(
            text=word_data["text"],
            start=word_data["start"],
            end=word_data["end"],
            confidence=word_data.get("confidence", 1.0),
        ))
    
    return TranscriptResult(
        words=words,
        text=result.get("text", ""),
        language=result.get("language_code"),
    )


async def transcribe_from_url(
    audio_url: str,
    language: str = "en",
    word_boost: Optional[List[str]] = None,
) -> TranscriptResult:
    """Transcribe audio from a URL (e.g., R2 presigned URL)."""
    # Start transcription directly with URL
    transcript_id = await start_transcription(audio_url, language, word_boost)
    
    # Poll for completion
    result = await poll_transcription(transcript_id)
    
    # Parse words
    words = []
    for word_data in result.get("words", []):
        words.append(Word(
            text=word_data["text"],
            start=word_data["start"],
            end=word_data["end"],
            confidence=word_data.get("confidence", 1.0),
        ))
    
    return TranscriptResult(
        words=words,
        text=result.get("text", ""),
        language=result.get("language_code"),
    )
