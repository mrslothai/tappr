"""
Permanent Hinglish Transliteration: Devanagari → Natural WhatsApp-style Roman Hindi.

Uses indic-transliteration library (ITRANS scheme) as base, then applies
Hindi phonological rules to produce output matching how Indians type on WhatsApp.

Key insight: ITRANS uses uppercase for long vowels (A=आ, I=ई, U=ऊ) and 
lowercase 'a' for schwa. We use markers to distinguish them, apply schwa 
deletion only on true schwas, then convert markers to casual vowels.
"""

import re
from typing import List
from indic_transliteration import sanscript
from indic_transliteration.sanscript import transliterate as _transliterate


def is_devanagari(text: str) -> bool:
    return bool(re.search(r'[\u0900-\u097F]', text))


def _process_itrans_word(w: str) -> str:
    """Convert one ITRANS word to casual Hinglish."""
    if not w:
        return w
    
    # Separate punctuation
    punct = ''
    while w and not w[-1].isalnum():
        punct = w[-1] + punct
        w = w[:-1]
    if not w:
        return punct
    
    # ── 1. Mark long vowels with placeholders ──
    # Protect diphthongs first
    w = w.replace('ai', '\x01')
    w = w.replace('au', '\x02')
    w = w.replace('A', '§')   # long aa
    w = w.replace('I', '£')   # long ee
    w = w.replace('U', '¥')   # long oo
    w = w.replace('\x01', 'ai')
    w = w.replace('\x02', 'au')
    
    # ── 2. Consonant conversions ──
    # Anusvara
    w = re.sub(r'M(?=[pbm])', 'm', w)
    w = w.replace('M', 'n')
    # Chandrabindu / visarga
    w = w.replace('~N', 'n'); w = w.replace('.n', 'n'); w = w.replace('.N', 'n')
    w = w.replace('H', 'h')
    # Retroflex dots
    w = w.replace('.Dh', 'dh'); w = w.replace('.D', 'd'); w = w.replace('.T', 't')
    # Danda
    w = w.replace('|', '.')
    # Vowel modifiers
    w = w.replace('RRi', 'ri'); w = w.replace('LLi', 'li')
    # Nuqta
    w = w.replace('.k', 'q'); w = w.replace('.g', 'gh')
    w = w.replace('.j', 'z'); w = w.replace('.f', 'f'); w = w.replace('.p', 'f')
    # Aspirated (order matters)
    w = w.replace('Ch', 'chh')
    w = w.replace('Th', 'th'); w = w.replace('Dh', 'dh'); w = w.replace('Bh', 'bh')
    w = w.replace('Gh', 'gh'); w = w.replace('Jh', 'jh'); w = w.replace('Kh', 'kh')
    w = w.replace('Ph', 'ph'); w = w.replace('Sh', 'sh'); w = w.replace('sh', 'sh')
    w = w.replace('GY', 'gy'); w = w.replace('NY', 'ny')
    # Remaining ITRANS capitals
    for c in 'TDNKG':
        w = w.replace(c, c.lower())
    
    # ── 3. Schwa deletion ──
    # Only delete lowercase 'a' (schwa), never markers (§£¥)
    
    consonants = set('bcdfghjklmnpqrstvwxyz')
    vowels_all = set('aeiou§£¥')
    
    # 3a. Word-final schwa
    if len(w) > 1 and w[-1] == 'a' and w[-2] in consonants:
        w = w[:-1]
    
    # 3b. Medial schwa deletion
    # Rule: delete 'a' between consonants C₁aC₂ when:
    #   - There's already a vowel before C₁ (not first syllable)
    #   - Followed by a vowel sound (next syllable exists)
    # This prevents "chalo" → "chlo" but allows "chalate" → "chalte"
    
    changed = True
    while changed:
        changed = False
        chars = list(w)
        new = []
        i = 0
        while i < len(chars):
            if (chars[i] in consonants and
                i + 1 < len(chars) and chars[i+1] == 'a' and
                i + 2 < len(chars) and chars[i+2] in consonants and
                i + 3 < len(chars) and chars[i+3] in vowels_all):
                # Check: is there already a vowel before this position?
                preceding = ''.join(chars[:i])
                has_prior_vowel = any(c in vowels_all for c in preceding)
                if has_prior_vowel:
                    new.append(chars[i])
                    i += 2  # skip the schwa
                    changed = True
                else:
                    new.append(chars[i])
                    i += 1
            else:
                new.append(chars[i])
                i += 1
        w = ''.join(new)
    
    # ── 4. Convert markers to casual Hinglish vowels ──
    
    # § (long aa) conversion rules:
    # - Word-final → 'a' (tumhArA → tumhara)
    # - Word-initial → 'aa' (aaj, aap, aai)
    # - Internal in short words (≤4 chars) → 'aa' (naam, baat, kaam)
    # - Internal in longer words → 'a' (khana, tumhara, chahiye)
    
    # Word-final §
    if w.endswith('§'):
        w = w[:-1] + 'a'
    
    # Word-initial §
    if w.startswith('§'):
        w = 'aa' + w[1:]
    
    # Remaining internal §: depends on word length
    if '§' in w:
        if len(w) <= 4:
            w = w.replace('§', 'aa')
        else:
            w = w.replace('§', 'a')
    
    # £ (long ee):
    # - Word-final → 'i' (most casual: ladkee → ladki)  
    # - Internal → 'ee' (theek, neela)
    if w.endswith('£'):
        w = w[:-1] + 'i'
    # £ before 'n' at word end → 'i' + 'n' (naheen → nahin)
    w = re.sub(r'£n$', 'in', w)
    w = w.replace('£', 'ee')
    
    # ¥ (long oo):
    # - Generally → 'oo' (hoon, poora)
    # - Word-final before nothing → 'oo'
    w = w.replace('¥', 'oo')
    
    # ── 5. Consonant cluster cleanup ──
    w = w.replace('chchh', 'cch')  # अच्छ → acch not achchh
    
    # ── 6. Common word-specific fixes ──
    # 'ie' at word end from चाहिए → should be 'iye'
    if w.endswith('hie'):
        w = w[:-2] + 'iye'
    
    # ── 7. Word override dictionary ──
    overrides = {
        'yeh': 'yeh', 'yah': 'yeh',
        'woh': 'woh', 'vah': 'woh', 'voh': 'woh',
        'ham': 'hum', 'hum': 'hum',
        'nahi': 'nahi', 'nahin': 'nahi',
        'theek': 'theek', 'thik': 'theek',
        'accha': 'accha', 'acchi': 'acchi',
        'party': 'party', 'parti': 'party', 'paarti': 'party',
        'film': 'film',
        'bhai': 'bhai', 'bhaai': 'bhai',
        'men': 'mein',
        'dhanyvad': 'dhanyavaad', 'dhnyvad': 'dhanyavaad',
        'to': 'toh',
    }
    w_lower = w.lower()
    if w_lower in overrides:
        w = overrides[w_lower]
    
    return w + punct


def _process_devanagari_segment(text: str) -> str:
    itrans = _transliterate(text, sanscript.DEVANAGARI, sanscript.ITRANS)
    words = itrans.split()
    return ' '.join(_process_itrans_word(w) for w in words)


def devanagari_to_hinglish(text: str) -> str:
    """Convert Devanagari (or mixed) text to natural Hinglish."""
    if not text or not text.strip():
        return text
    if not is_devanagari(text):
        return text
    
    segments = re.split(r'([\u0900-\u097F\u0964\u0965]+)', text)
    parts = []
    for seg in segments:
        if not seg:
            continue
        if is_devanagari(seg) or seg in ('।', '॥'):
            parts.append(_process_devanagari_segment(seg))
        else:
            parts.append(seg)
    return ''.join(parts)


# Backward compat
transliterate_batch = lambda texts: [devanagari_to_hinglish(t) for t in texts]
transliterate_with_llm = devanagari_to_hinglish
transliterate_char_by_char = devanagari_to_hinglish
def clear_cache(): pass


if __name__ == "__main__":
    tests = [
        ("नमस्ते दोस्तों, कैसे हो?", "namaste doston, kaise ho?"),
        ("मैं एक developer हूं", "main ek developer hoon"),
        ("आज मौसम बहुत गर्म है", "aaj mausam bahut garm hai"),
        ("क्या तुम खाना खाओगे?", "kya tum khana khaoge?"),
        ("ज़रूरी फ़िल्म देखनी है", "zaroori film dekhni hai"),
        ("अच्छा चलो फिर मिलते हैं", "accha chalo phir milte hain"),
        ("तुम्हारा नाम क्या है?", "tumhara naam kya hai?"),
        ("मुझे पता नहीं", "mujhe pata nahi"),
        ("चलो घर चलते हैं", "chalo ghar chalte hain"),
        ("बोलो क्या चाहिए", "bolo kya chahiye"),
        ("पैसे कमाओ", "paise kamao"),
        ("सुनो भाई", "suno bhai"),
        ("यह बहुत अच्छी बात है", "yeh bahut acchi baat hai"),
        ("मैं ठीक हूं, आप कैसे हैं?", "main theek hoon, aap kaise hain?"),
        ("हम सब दोस्त मिलकर पार्टी करेंगे", "hum sab dost milkar party karenge"),
        ("मुझे यह फ़िल्म बहुत पसंद आई", "mujhe yeh film bahut pasand aai"),
        ("क्या आप मेरी मदद कर सकते हैं?", "kya aap meri madad kar sakte hain?"),
        ("123", "123"),
        ("Hello world", "Hello world"),
        ("", ""),
    ]
    
    print("=" * 90)
    print("HINGLISH TRANSLITERATION — NATURAL OUTPUT TEST")
    print("=" * 90)
    
    p = f = 0
    for inp, exp in tests:
        got = devanagari_to_hinglish(inp)
        if got == exp:
            p += 1; print(f"  ✓  {inp:40} → {got}")
        else:
            f += 1; print(f"  ✗  {inp:40}")
            print(f"       got:      {got}")
            print(f"       expected: {exp}")
    print(f"\nResults: {p}/{p+f} passed, {f} failed")
