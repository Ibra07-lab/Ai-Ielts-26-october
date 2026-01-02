"""
Test script to verify Alex's calm mentor voice transformation.
"""

import sys
sys.path.append('app')

from models.tutor_persona import alex, StyleSettings

def test_calm_voice():
    """Test that Alex uses calm, measured voice."""
    
    print("=" * 70)
    print("ALEX PERSONA VOICE TEST - Calm Mentor Style")
    print("=" * 70)
    print()
    
    # Test 1: Greetings (should have no emojis by default)
    print("1. GREETINGS (No emojis, calm tone):")
    print("-" * 70)
    for i in range(3):
        greeting = alex.get_greeting("returning_user")
        print(f"   {greeting}")
        # Check for emojis
        has_emoji = any(char in greeting for char in ["☕", "👋", "☀️", "🌙"])
        if has_emoji:
            print(f"   [FAIL] Found emoji in greeting")
        else:
            print(f"   [PASS] No emojis")
    print()
    
    # Test 2: Encouragements (should be calm, not hype)
    print("2. ENCOURAGEMENTS (Calm approval, not hype):")
    print("-" * 70)
    for result_type in ["correct_answer", "wrong_but_close", "wrong_answer"]:
        encouragement = alex.get_encouragement(result_type)
        print(f"   {result_type}: {encouragement}")
        # Check for hype words
        hype_words = ["Nailed it", "Brilliant", "Band 7+", "examiners love"]
        has_hype = any(word in encouragement for word in hype_words)
        if has_hype:
            print(f"   [FAIL] Found hype language")
        else:
            print(f"   [PASS] Calm, measured tone")
    print()
    
    # Test 3: Teaching intros (no authority flexing)
    print("3. TEACHING INTROS (No authority flexing):")
    print("-" * 70)
    for q_type in ["true_false_ng", "matching_headings", "multiple_choice"]:
        intro = alex.get_teaching_intro(q_type)
        print(f"   {q_type}: {intro}")
        # Check for authority claims
        authority_words = ["my students", "8 years", "examining", "Cambridge", "examiners"]
        has_authority = any(word in intro for word in authority_words)
        if has_authority:
            print(f"   [FAIL] Found authority flexing")
        else:
            print(f"   [PASS] No authority claims")
    print()
    
    # Test 4: Mentor rhythm phrases
    print("4. MENTOR RHYTHM (Rhythmic wisdom phrases):")
    print("-" * 70)
    for i in range(3):
        rhythm = alex.get_mentor_rhythm()
        print(f"   {rhythm}")
        # Check for rhythm patterns
        short_sentences = len(rhythm.split('.')) > 2
        if short_sentences:
            print(f"   [PASS] Rhythmic pattern detected")
        else:
            print(f"   [INFO] Not obviously rhythmic")
    print()
    
    # Test 5: Session closers (calm, not hype)
    print("5. SESSION CLOSERS (Calm, measured):")
    print("-" * 70)
    for i in range(3):
        closer = alex.get_session_closer()
        print(f"   {closer}")
        # Check for hype
        hype_words = ["Great session", "Fantastic", "Band 9"]
        has_hype = any(word in closer for word in hype_words)
        if has_hype:
            print(f"   [FAIL] Found hype language")
        else:
            print(f"   [PASS] Calm, measured tone")
    print()
    
    # Test 6: Style settings (verify defaults)
    print("6. STYLE SETTINGS (Defaults):")
    print("-" * 70)
    print(f"   Energy: {alex.style.energy} (should be low ~0.35)")
    print(f"   Warmth: {alex.style.warmth} (should be moderate ~0.7)")
    print(f"   Emoji: {alex.style.emoji} (should be False)")
    print(f"   Exclamation rate: {alex.style.exclamation_rate} (should be low ~0.15)")
    print(f"   Max openers: {alex.style.max_openers} (should be 1)")
    print()
    
    if alex.style.emoji == False and alex.style.energy < 0.5 and alex.style.max_openers == 1:
        print("   [PASS] Style settings are calm mentor defaults")
    else:
        print("   [FAIL] Style settings don't match calm mentor")
    print()
    
    # Test 7: Format with personality (no stacking)
    print("7. FORMAT WITH PERSONALITY (No stacking openers):")
    print("-" * 70)
    content = "Here's a technique for handling T/F/NG questions."
    formatted = alex.format_with_personality(
        content,
        add_encouragement="correct_answer",
        emotion="confused",
        emotion_intensity=0.5,
        question_type="true_false_ng"
    )
    sections = [s for s in formatted.split('\n\n') if s.strip()]
    print(f"   Number of sections: {len(sections)}")
    print(f"   Content preview:")
    for i, section in enumerate(sections[:3], 1):
        print(f"      Section {i}: {section[:60]}...")
    
    # With max_openers=1, should have at most: 1 opener + content + maybe encouragement
    if len(sections) <= 3:
        print(f"   [PASS] Not stacking multiple openers (max_openers={alex.style.max_openers})")
    else:
        print(f"   [WARNING] More sections than expected")
    print()
    
    print("=" * 70)
    print("TEST COMPLETE")
    print("=" * 70)

if __name__ == "__main__":
    test_calm_voice()

