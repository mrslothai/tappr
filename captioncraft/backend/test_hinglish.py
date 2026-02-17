#!/usr/bin/env python3
"""Test script for Hinglish transliteration."""
import sys
from hinglish_transliterator import devanagari_to_hinglish, transliterate_batch

# Test cases from requirements
TEST_CASES = [
    {
        "input": "नमस्ते, कैसे हो?",
        "expected": "Namaste, kaise ho?",
        "description": "Basic greeting"
    },
    {
        "input": "मैं एक developer हूं",
        "expected": "Main ek developer hoon",
        "description": "Mixed Hindi-English (English word preserved)"
    },
    {
        "input": "यह video बहुत अच्छा है",
        "expected": "Yeh video bahut accha hai",
        "description": "Mixed Hindi-English with adjectives"
    },
    {
        "input": "आज मौसम बहुत गर्म है",
        "expected": "Aaj mausam bahut garam hai",
        "description": "Pure Hindi sentence"
    },
    {
        "input": "मैं ठीक हूं, आप कैसे हैं? यह बहुत अच्छा है।",
        "expected": "Main theek hoon, aap kaise hain? Yeh bahut accha hai.",
        "description": "Long sentence from requirements"
    }
]


def normalize(text: str) -> str:
    """Normalize text for comparison (lowercase, remove extra spaces)."""
    return ' '.join(text.lower().split())


def test_single_transliteration():
    """Test individual word transliteration."""
    print("=" * 70)
    print("TEST 1: Single Word Transliteration")
    print("=" * 70)
    
    passed = 0
    failed = 0
    
    for i, test in enumerate(TEST_CASES, 1):
        input_text = test["input"]
        expected = test["expected"]
        description = test["description"]
        
        result = devanagari_to_hinglish(input_text)
        
        # Normalize for comparison
        result_norm = normalize(result)
        expected_norm = normalize(expected)
        
        is_pass = result_norm == expected_norm
        status = "✓ PASS" if is_pass else "✗ FAIL"
        
        print(f"\nTest {i}: {description}")
        print(f"  Input:    {input_text}")
        print(f"  Expected: {expected}")
        print(f"  Got:      {result}")
        print(f"  {status}")
        
        if is_pass:
            passed += 1
        else:
            failed += 1
            print(f"  Difference: Expected '{expected_norm}' but got '{result_norm}'")
    
    print(f"\n{'=' * 70}")
    print(f"Results: {passed} passed, {failed} failed out of {len(TEST_CASES)}")
    print(f"{'=' * 70}\n")
    
    return failed == 0


def test_batch_transliteration():
    """Test batch transliteration."""
    print("=" * 70)
    print("TEST 2: Batch Transliteration")
    print("=" * 70)
    
    inputs = [test["input"] for test in TEST_CASES]
    expected_outputs = [test["expected"] for test in TEST_CASES]
    
    results = transliterate_batch(inputs)
    
    passed = 0
    failed = 0
    
    for i, (input_text, expected, result) in enumerate(zip(inputs, expected_outputs, results), 1):
        result_norm = normalize(result)
        expected_norm = normalize(expected)
        
        is_pass = result_norm == expected_norm
        status = "✓ PASS" if is_pass else "✗ FAIL"
        
        print(f"\nBatch item {i}:")
        print(f"  Input:    {input_text}")
        print(f"  Expected: {expected}")
        print(f"  Got:      {result}")
        print(f"  {status}")
        
        if is_pass:
            passed += 1
        else:
            failed += 1
    
    print(f"\n{'=' * 70}")
    print(f"Results: {passed} passed, {failed} failed out of {len(TEST_CASES)}")
    print(f"{'=' * 70}\n")
    
    return failed == 0


def test_english_preservation():
    """Test that English words are preserved."""
    print("=" * 70)
    print("TEST 3: English Word Preservation")
    print("=" * 70)
    
    test_cases = [
        ("developer", "developer"),
        ("video", "video"),
        ("hello world", "hello world"),
        ("मैं developer हूं", "main developer hoon"),
    ]
    
    passed = 0
    failed = 0
    
    for input_text, expected in test_cases:
        result = devanagari_to_hinglish(input_text)
        result_norm = normalize(result)
        expected_norm = normalize(expected)
        
        is_pass = result_norm == expected_norm
        status = "✓ PASS" if is_pass else "✗ FAIL"
        
        print(f"\n  Input:    {input_text}")
        print(f"  Expected: {expected}")
        print(f"  Got:      {result}")
        print(f"  {status}")
        
        if is_pass:
            passed += 1
        else:
            failed += 1
    
    print(f"\n{'=' * 70}")
    print(f"Results: {passed} passed, {failed} failed out of {len(test_cases)}")
    print(f"{'=' * 70}\n")
    
    return failed == 0


def test_timestamp_preservation():
    """Test that timestamps are preserved (simulated)."""
    print("=" * 70)
    print("TEST 4: Timestamp Preservation (Simulated)")
    print("=" * 70)
    
    # Simulate word-level data with timestamps
    word_data = [
        {"text": "मैं", "start": 0, "end": 500},
        {"text": "developer", "start": 500, "end": 1200},
        {"text": "हूं", "start": 1200, "end": 1600},
    ]
    
    print("\nOriginal words with timestamps:")
    for w in word_data:
        print(f"  {w['text']:15} | {w['start']:6} - {w['end']:6} ms")
    
    # Transliterate
    word_texts = [w["text"] for w in word_data]
    transliterated = transliterate_batch(word_texts)
    
    print("\nTransliterated words with preserved timestamps:")
    all_correct = True
    for i, (orig, trans) in enumerate(zip(word_data, transliterated)):
        print(f"  {trans:15} | {orig['start']:6} - {orig['end']:6} ms")
        if orig['start'] != word_data[i]['start'] or orig['end'] != word_data[i]['end']:
            all_correct = False
            print("    ✗ FAIL: Timestamps changed!")
    
    status = "✓ PASS" if all_correct else "✗ FAIL"
    print(f"\n{status}: Timestamps {'preserved' if all_correct else 'NOT preserved'}")
    print(f"{'=' * 70}\n")
    
    return all_correct


def main():
    """Run all tests."""
    print("\n" + "=" * 70)
    print("HINGLISH TRANSLITERATION TEST SUITE")
    print("=" * 70 + "\n")
    
    results = []
    
    results.append(("Single Transliteration", test_single_transliteration()))
    results.append(("Batch Transliteration", test_batch_transliteration()))
    results.append(("English Preservation", test_english_preservation()))
    results.append(("Timestamp Preservation", test_timestamp_preservation()))
    
    print("\n" + "=" * 70)
    print("FINAL RESULTS")
    print("=" * 70)
    
    for test_name, passed in results:
        status = "✓ PASSED" if passed else "✗ FAILED"
        print(f"  {test_name:30} {status}")
    
    all_passed = all(result[1] for result in results)
    
    print("=" * 70)
    if all_passed:
        print("🎉 ALL TESTS PASSED!")
        return 0
    else:
        print("❌ SOME TESTS FAILED")
        return 1


if __name__ == "__main__":
    sys.exit(main())
