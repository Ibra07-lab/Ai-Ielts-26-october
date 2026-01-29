"""
Feature Coverage Validator for Task 1 Essays.

Validates student essays against structured visual descriptions to identify:
- Which features were mentioned vs. missed
- Data accuracy issues
- Coverage percentage
"""

import re
from typing import List, Set, Tuple
from difflib import SequenceMatcher

from ielts_writing.schemas.visual_description import (
    StructuredVisualDescription,
    VisualFeature,
    FeatureCoverageAnalysis,
    DataAccuracyIssue,
    FeaturePriority,
    DataPoint
)


class FeatureCoverageValidator:
    """
    Validates student essay against structured visual description.
    
    Uses keyword matching and fuzzy string matching to determine:
    - Which features were mentioned
    - Which data points were accurately reported
    - What critical elements were missed
    """
    
    def __init__(self, fuzzy_threshold: float = 0.7):
        """
        Initialize validator.
        
        Args:
            fuzzy_threshold: Minimum similarity score (0-1) for fuzzy matching
        """
        self.fuzzy_threshold = fuzzy_threshold
        
        # Common synonyms for IELTS Task 1 vocabulary
        self.trend_synonyms = {
            "increase": ["increase", "rise", "grow", "climb", "surge", "soar", "go up", "went up", "upward"],
            "decrease": ["decrease", "decline", "fall", "drop", "plunge", "plummet", "go down", "went down", "downward"],
            "stable": ["stable", "constant", "steady", "plateau", "level", "unchanged", "remained"],
            "fluctuate": ["fluctuate", "vary", "oscillate", "fluctuation", "variable"],
            "peak": ["peak", "highest", "maximum", "top", "apex", "reached a high"],
            "low": ["lowest", "minimum", "bottom", "trough", "reached a low"]
        }
        
        self.comparison_synonyms = {
            "higher": ["higher", "more", "greater", "above", "exceeded"],
            "lower": ["lower", "less", "fewer", "below", "under"],
            "similar": ["similar", "same", "comparable", "equal", "alike"],
            "different": ["different", "differ", "contrast", "unlike", "whereas"]
        }
    
    def validate(
        self,
        essay: str,
        visual_desc: StructuredVisualDescription
    ) -> FeatureCoverageAnalysis:
        """
        Analyze feature coverage in the essay.
        
        Args:
            essay: Student's essay text
            visual_desc: Structured visual description from examiner
            
        Returns:
            FeatureCoverageAnalysis with detailed coverage information
        """
        essay_lower = essay.lower()
        
        # Extract numbers from essay for data validation
        essay_numbers = self._extract_numbers(essay)
        
        # Check each feature
        features_mentioned = []
        features_missed = []
        
        for feature in visual_desc.key_features:
            if self._is_feature_mentioned(essay_lower, feature):
                features_mentioned.append(feature)
            else:
                features_missed.append(feature)
        
        # Check data accuracy
        data_accuracy_issues = self._check_data_accuracy(
            essay_lower,
            essay_numbers,
            visual_desc.data_points
        )
        
        # Calculate coverage metrics
        total_features = len(visual_desc.key_features)
        coverage_percentage = (
            (len(features_mentioned) / total_features * 100)
            if total_features > 0
            else 0.0
        )
        
        critical_features_covered = all(
            f in features_mentioned
            for f in visual_desc.key_features
            if f.priority == FeaturePriority.CRITICAL
        )
        
        important_features_covered = all(
            f in features_mentioned
            for f in visual_desc.key_features
            if f.priority in [FeaturePriority.CRITICAL, FeaturePriority.IMPORTANT]
        )
        
        # Generate specific gaps
        specific_gaps = self._generate_gap_descriptions(features_missed)
        
        return FeatureCoverageAnalysis(
            features_mentioned=features_mentioned,
            features_missed=features_missed,
            data_accuracy_issues=data_accuracy_issues,
            coverage_percentage=coverage_percentage,
            critical_features_covered=critical_features_covered,
            important_features_covered=important_features_covered,
            specific_gaps=specific_gaps
        )
    
    def _is_feature_mentioned(self, essay_lower: str, feature: VisualFeature) -> bool:
        """
        Check if a feature is mentioned in the essay.
        
        Uses multiple strategies:
        1. Direct keyword matching
        2. Synonym matching (for trends/comparisons)
        3. Fuzzy string matching
        """
        # Strategy 1: Check expected_mention keywords
        expected_keywords = feature.expected_mention.lower().split()
        if all(kw in essay_lower for kw in expected_keywords if len(kw) > 2):
            return True
        
        # Strategy 2: Check description keywords
        description_keywords = self._extract_keywords(feature.description.lower())
        matches = sum(1 for kw in description_keywords if kw in essay_lower)
        if matches >= len(description_keywords) * 0.6:  # 60% of keywords present
            return True
        
        # Strategy 3: Check synonyms based on feature type
        if feature.feature_type.value == "trend":
            for trend_word in ["increase", "decrease", "stable", "fluctuate"]:
                if any(syn in essay_lower for syn in self.trend_synonyms.get(trend_word, [])):
                    # If trend vocab is present, check related data
                    if feature.related_data:
                        data_keywords = [d.lower() for d in feature.related_data]
                        if any(dk in essay_lower for dk in data_keywords):
                            return True
        
        # Strategy 4: Fuzzy matching for phrases
        if len(feature.expected_mention) > 10:
            sentences = re.split(r'[.!?]', essay_lower)
            for sentence in sentences:
                similarity = SequenceMatcher(None, feature.expected_mention.lower(), sentence).ratio()
                if similarity >= self.fuzzy_threshold:
                    return True
        
        return False
    
    def _extract_keywords(self, text: str) -> List[str]:
        """Extract meaningful keywords from text (removes common words)."""
        # Common stop words to ignore
        stop_words = {
            "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for",
            "of", "with", "by", "from", "is", "was", "were", "has", "have", "had"
        }
        
        words = re.findall(r'\b\w+\b', text.lower())
        return [w for w in words if len(w) > 3 and w not in stop_words]
    
    def _extract_numbers(self, text: str) -> List[Tuple[float, str]]:
        """
        Extract numbers and their context from text.
        
        Returns:
            List of (number, context) tuples
        """
        numbers = []
        
        # Pattern for numbers with optional units
        pattern = r'(\d+(?:\.\d+)?)\s*(%|percent|L/capita|L|million|billion|thousand|degrees?|km|m)?'
        matches = re.finditer(pattern, text)
        
        for match in matches:
            try:
                number = float(match.group(1))
                unit = match.group(2) or ""
                
                # Get context (20 chars before and after)
                start = max(0, match.start() - 20)
                end = min(len(text), match.end() + 20)
                context = text[start:end].lower()
                
                numbers.append((number, context))
            except ValueError:
                continue
        
        return numbers
    
    def _check_data_accuracy(
        self,
        essay_lower: str,
        essay_numbers: List[Tuple[float, str]],
        data_points: List[DataPoint]
    ) -> List[DataAccuracyIssue]:
        """
        Check if numbers in essay match data points from visual.
        
        Args:
            essay_lower: Essay text (lowercase)
            essay_numbers: Extracted (number, context) tuples
            data_points: Data points from visual description
            
        Returns:
            List of data accuracy issues found
        """
        issues = []
        
        for data_point in data_points:
            # Skip non-numeric data points
            if not isinstance(data_point.value, (int, float)):
                continue
            
            actual_value = float(data_point.value)
            label_lower = data_point.label.lower()
            
            # Check if this data point's label is mentioned in essay
            label_keywords = self._extract_keywords(label_lower)
            if not any(kw in essay_lower for kw in label_keywords):
                continue  # Not mentioned, skip validation
            
            # Find numbers near this label in the essay
            for essay_num, context in essay_numbers:
                # Check if label keywords appear in context
                if any(kw in context for kw in label_keywords):
                    # Calculate difference
                    diff_percent = abs(essay_num - actual_value) / actual_value * 100 if actual_value != 0 else 0
                    
                    # Minor error: within 5%
                    # Major error: more than 5% difference
                    if diff_percent > 5:
                        severity = "major" if diff_percent > 15 else "minor"
                        issues.append(DataAccuracyIssue(
                            claimed=str(essay_num),
                            actual=str(actual_value),
                            location=data_point.label,
                            severity=severity
                        ))
        
        return issues
    
    def _generate_gap_descriptions(self, features_missed: List[VisualFeature]) -> List[str]:
        """
        Generate human-readable descriptions of missed features.
        
        Args:
            features_missed: List of features student didn't mention
            
        Returns:
            List of gap descriptions for teacher feedback
        """
        gaps = []
        
        for feature in features_missed:
            if feature.priority == FeaturePriority.CRITICAL:
                gaps.append(f"CRITICAL: {feature.description}")
            elif feature.priority == FeaturePriority.IMPORTANT:
                gaps.append(f"Important: {feature.description}")
            else:
                gaps.append(f"Mention: {feature.description}")
        
        return gaps


# Convenience function for backward compatibility
def validate_feature_coverage(
    essay: str,
    visual_desc: StructuredVisualDescription
) -> FeatureCoverageAnalysis:
    """
    Convenience function to validate feature coverage.
    
    Args:
        essay: Student's essay text
        visual_desc: Structured visual description
        
    Returns:
        FeatureCoverageAnalysis
    """
    validator = FeatureCoverageValidator()
    return validator.validate(essay, visual_desc)
