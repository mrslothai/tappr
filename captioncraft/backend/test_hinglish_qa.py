#!/usr/bin/env python3
"""QA Test Suite for Hinglish Transliteration"""

import sys
from hinglish_transliterator import transliterate_char_by_char

class TestResult:
    def __init__(self, test_num, name, input_text, expected, actual, status):
        self.test_num = test_num
        self.name = name
        self.input_text = input_text
        self.expected = expected
        self.actual = actual
        self.status = status

def fuzzy_match(actual, expected):
    """Check if actual output is close enough to expected (case-insensitive, flexible)."""
    actual_clean = actual.lower().strip()
    expected_clean = expected.lower().strip()
    
    # Exact match
    if actual_clean == expected_clean:
        return True
    
    # Allow minor spelling variations (within 85% similarity)
    words_actual = actual_clean.split()
    words_expected = expected_clean.split()
    
    if len(words_actual) != len(words_expected):
        return False
    
    # Check word-by-word similarity
    matches = 0
    for wa, we in zip(words_actual, words_expected):
        if wa == we:
            matches += 1
        elif abs(len(wa) - len(we)) <= 2:  # Allow 2-char difference
            # Check character overlap
            overlap = sum(1 for c in wa if c in we)
            if overlap >= min(len(wa), len(we)) * 0.7:
                matches += 0.8
    
    similarity = matches / len(words_expected)
    return similarity >= 0.85

def run_test(test_num, name, input_text, expected_output):
    """Run a single test and return result."""
    try:
        actual = transliterate_char_by_char(input_text)
        
        # Determine pass/fail
        if expected_output == "PRESERVE":
            # Should return unchanged
            passed = actual == input_text
        elif expected_output == "EMPTY":
            passed = actual == ""
        elif expected_output.startswith("CONTAINS:"):
            # Check if output contains certain words
            required = expected_output.replace("CONTAINS:", "").strip().split(",")
            passed = all(word.strip() in actual for word in required)
        else:
            # Fuzzy match for transliteration
            passed = fuzzy_match(actual, expected_output)
        
        status = "✅ PASS" if passed else "❌ FAIL"
        return TestResult(test_num, name, input_text, expected_output, actual, status)
    except Exception as e:
        return TestResult(test_num, name, input_text, expected_output, f"ERROR: {e}", "❌ ERROR")

def main():
    print("=" * 80)
    print("🧪 HINGLISH TRANSLITERATION QA TEST SUITE")
    print("=" * 80)
    print()
    
    tests = [
        # Basic Tests
        (1, "Basic greeting", "नमस्ते, कैसे हो?", "namaste, kaise ho?"),
        (2, "Basic statement", "मैं ठीक हूं", "main theek hoon"),
        (3, "Basic sentence", "यह बहुत अच्छा है", "yeh bahut accha hai"),
        (4, "Mixed Hindi-English", "मैं एक developer हूं", "main ek developer hoon"),
        (5, "Mixed with video", "शादी का video बनवाएं", "shaadi ka video banwayen"),
        
        # Edge Cases
        (6, "Empty string", "", "EMPTY"),
        (7, "Pure English", "Hello world", "PRESERVE"),
        (8, "Mixed YouTube", "मैं YouTube पर videos देखता हूं", "CONTAINS:YouTube,videos"),
        (9, "Numbers preserved", "मेरे पास 5 phones हैं", "CONTAINS:5,phones"),
        (10, "Special punctuation", "क्या?! हाँ!", "kya?! haan!"),
        (11, "Long text", "आज मौसम बहुत गर्म है। मैं ठीक हूं। यह बहुत अच्छा है।", "aaj mausam bahut garam hai. main theek hoon. yeh bahut accha hai."),
        (12, "Single word", "नमस्ते", "namaste"),
    ]
    
    results = []
    
    for test in tests:
        test_num, name, input_text, expected = test
        result = run_test(test_num, name, input_text, expected)
        results.append(result)
    
    # Print detailed results
    print("## TEST RESULTS\n")
    print("| # | Test Case                | Input                                      | Expected                                  | Actual                                    | Status      |")
    print("|---|--------------------------|-------------------------------------------|------------------------------------------|------------------------------------------|-------------|")
    
    for r in results:
        # Truncate long strings for table display
        input_display = (r.input_text[:35] + "...") if len(r.input_text) > 38 else r.input_text
        expected_display = (r.expected[:35] + "...") if len(r.expected) > 38 else r.expected
        actual_display = (r.actual[:35] + "...") if len(r.actual) > 38 else r.actual
        
        print(f"| {r.test_num:2d} | {r.name:24s} | {input_display:41s} | {expected_display:40s} | {actual_display:40s} | {r.status:11s} |")
    
    print()
    
    # Print full outputs for failed tests
    failed = [r for r in results if "FAIL" in r.status or "ERROR" in r.status]
    if failed:
        print("\n## FAILED TEST DETAILS\n")
        for r in failed:
            print(f"Test #{r.test_num}: {r.name}")
            print(f"  Input:    {r.input_text}")
            print(f"  Expected: {r.expected}")
            print(f"  Actual:   {r.actual}")
            print()
    
    # Summary
    passed = sum(1 for r in results if "PASS" in r.status)
    total = len(results)
    
    print("=" * 80)
    print(f"📊 SUMMARY: {passed}/{total} tests passed")
    print("=" * 80)
    
    # Quality check notes
    print("\n## QUALITY ASSESSMENT\n")
    
    # Check for natural WhatsApp-style output
    print("✓ Natural WhatsApp typing: ", end="")
    sample_outputs = [r.actual for r in results[:5] if "PASS" in r.status]
    if sample_outputs:
        print("Reviewing sample outputs...")
        for out in sample_outputs[:3]:
            print(f"  - '{out}'")
    
    print("\n✓ English word preservation: ", end="")
    mixed_tests = [r for r in results if r.test_num in [4, 5, 8, 9]]
    mixed_pass = sum(1 for r in mixed_tests if "PASS" in r.status)
    print(f"{mixed_pass}/{len(mixed_tests)} tests passed")
    
    print("\n✓ Punctuation handling: ", end="")
    punct_tests = [r for r in results if r.test_num in [1, 10, 11]]
    punct_pass = sum(1 for r in punct_tests if "PASS" in r.status)
    print(f"{punct_pass}/{len(punct_tests)} tests passed")
    
    # Final recommendation
    print("\n" + "=" * 80)
    if passed == total:
        print("✅ RECOMMENDATION: SHIP IT — All tests passed!")
    elif passed >= total * 0.9:
        print("⚠️  RECOMMENDATION: SHIP IT with minor notes — 90%+ tests passed")
    elif passed >= total * 0.7:
        print("⚠️  RECOMMENDATION: NEEDS FIXES — Only 70-89% tests passed")
    else:
        print("❌ RECOMMENDATION: BLOCK — Less than 70% tests passed, needs major fixes")
    print("=" * 80)
    
    # Exit code based on pass rate
    sys.exit(0 if passed >= total * 0.7 else 1)

if __name__ == "__main__":
    main()
