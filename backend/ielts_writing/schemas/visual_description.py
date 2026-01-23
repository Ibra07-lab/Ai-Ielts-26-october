"""
Structured visual description schemas for Task 1 evaluation.

These models enable precise validation of student essays against visual data.
"""

from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any, Literal, Union
from enum import Enum

from .task1 import ChartType


# ============================================================
# DATA MODELS
# ============================================================

class DataPoint(BaseModel):
    """Single data point from a chart or diagram."""
    
    label: str = Field(description="Label for this data point (e.g., 'Turkey', '2020', 'Stage 1')")
    value: Union[float, str] = Field(description="Numeric value or text description")
    unit: Optional[str] = Field(default=None, description="Unit of measurement (e.g., 'L/capita', '%', 'million')")
    category: Optional[str] = Field(default=None, description="Category grouping if applicable")
    
    class Config:
        json_schema_extra = {
            "example": {
                "label": "Turkey - 2020",
                "value": 250,
                "unit": "L/capita",
                "category": "water_consumption"
            }
        }


class FeatureType(str, Enum):
    """Types of visual features that should be identified in essays."""
    TREND = "trend"              # Increasing/decreasing patterns over time
    COMPARISON = "comparison"    # Comparing categories or groups
    EXTREME = "extreme"          # Highest/lowest values
    STAGE = "stage"              # Steps in a process
    LOCATION = "location"        # Spatial positioning (maps)
    CHANGE = "change"            # Transformations over time


class FeaturePriority(str, Enum):
    """Priority levels for visual features."""
    CRITICAL = "critical"  # Must mention for Band 6+
    IMPORTANT = "important"  # Should mention for Band 7+
    MINOR = "minor"  # Nice to have for Band 8+


class VisualFeature(BaseModel):
    """Key feature that should be mentioned in the essay."""
    
    feature_type: FeatureType
    description: str = Field(description="Detailed description of the feature")
    priority: FeaturePriority
    expected_mention: str = Field(description="Keywords or phrases student should use")
    related_data: Optional[List[str]] = Field(
        default=None,
        description="Related data point labels for validation"
    )
    
    class Config:
        json_schema_extra = {
            "example": {
                "feature_type": "extreme",
                "description": "Turkey has the highest water consumption throughout the period",
                "priority": "critical",
                "expected_mention": "Turkey highest",
                "related_data": ["Turkey - 2010", "Turkey - 2020"]
            }
        }


# ============================================================
# STRUCTURED VISUAL DESCRIPTION
# ============================================================

class StructuredVisualDescription(BaseModel):
    """
    Structured representation of a chart, graph, table, map, or process diagram.
    
    This model enables precise validation of student essays against visual data.
    """
    
    # Basic info
    chart_type: ChartType
    title: Optional[str] = Field(default=None, description="Title of the visual if present")
    
    # For graphs and charts
    axes: Optional[Dict[str, str]] = Field(
        default=None,
        description="Axis labels, e.g., {'x': 'Years', 'y': 'Water consumption (L)'}"
    )
    units: Optional[str] = Field(default=None, description="Primary unit of measurement")
    time_period: Optional[str] = Field(default=None, description="Time span, e.g., '2010-2020'")
    
    # Structured data
    data_points: List[DataPoint] = Field(
        default_factory=list,
        description="All data points extracted from the visual"
    )
    
    # Key features to identify
    key_features: List[VisualFeature] = Field(
        default_factory=list,
        description="Important features students should mention"
    )
    
    # For process diagrams
    stages: Optional[List[str]] = Field(
        default=None,
        description="Ordered list of stages in a process"
    )
    stage_count: Optional[int] = Field(
        default=None,
        description="Total number of stages"
    )
    
    # For maps
    locations: Optional[List[str]] = Field(
        default=None,
        description="Key locations mentioned in the map"
    )
    changes: Optional[List[str]] = Field(
        default=None,
        description="Changes between map versions (if comparing two maps)"
    )
    
    # AI-generated text summary (for backward compatibility)
    text_summary: str = Field(
        description="Plain text description of the visual for agents that haven't been updated"
    )
    
    # Auto-generated checklist
    expected_elements: List[str] = Field(
        default_factory=list,
        description="Checklist of elements students should cover"
    )
    
    class Config:
        json_schema_extra = {
            "example": {
                "chart_type": "line_graph",
                "title": "Water Consumption by Country (2010-2020)",
                "axes": {
                    "x": "Years (2010-2020)",
                    "y": "Water consumption (L/capita)"
                },
                "units": "L/capita",
                "time_period": "2010-2020",
                "data_points": [
                    {"label": "Turkey - 2010", "value": 180, "unit": "L/capita"},
                    {"label": "Turkey - 2020", "value": 250, "unit": "L/capita"}
                ],
                "key_features": [
                    {
                        "feature_type": "extreme",
                        "description": "Turkey has highest consumption throughout",
                        "priority": "critical",
                        "expected_mention": "Turkey highest"
                    }
                ],
                "text_summary": "The line graph shows water consumption in 5 countries...",
                "expected_elements": ["overview", "highest value", "lowest value", "overall trend"]
            }
        }


# ============================================================
# FEATURE COVERAGE ANALYSIS
# ============================================================

class DataAccuracyIssue(BaseModel):
    """Represents a data accuracy problem in the student's essay."""
    
    claimed: str = Field(description="What the student wrote")
    actual: str = Field(description="What the chart actually shows")
    location: str = Field(description="Where in the essay or chart this appears")
    severity: Literal["minor", "major"] = Field(
        default="minor",
        description="Minor = small rounding error, Major = wrong data"
    )


class FeatureCoverageAnalysis(BaseModel):
    """
    Analysis of what features the student covered vs. missed.
    
    This is generated by comparing the essay against StructuredVisualDescription.
    """
    
    # Feature tracking
    features_mentioned: List[VisualFeature] = Field(
        default_factory=list,
        description="Features the student successfully mentioned"
    )
    features_missed: List[VisualFeature] = Field(
        default_factory=list,
        description="Features the student failed to mention"
    )
    
    # Data accuracy
    data_accuracy_issues: List[DataAccuracyIssue] = Field(
        default_factory=list,
        description="Specific data errors found in the essay"
    )
    
    # Coverage metrics
    coverage_percentage: float = Field(
        ge=0,
        le=100,
        description="Percentage of key features mentioned"
    )
    critical_features_covered: bool = Field(
        description="Whether all critical priority features were covered"
    )
    important_features_covered: bool = Field(
        description="Whether all important priority features were covered"
    )
    
    # Specific gaps for teacher feedback
    specific_gaps: List[str] = Field(
        default_factory=list,
        description="Human-readable descriptions of what was missed"
    )
    
    class Config:
        json_schema_extra = {
            "example": {
                "features_mentioned": [
                    {
                        "feature_type": "extreme",
                        "description": "Turkey highest",
                        "priority": "critical",
                        "expected_mention": "Turkey highest"
                    }
                ],
                "features_missed": [
                    {
                        "feature_type": "trend",
                        "description": "Sharp increase after 2015",
                        "priority": "important",
                        "expected_mention": "increased sharply"
                    }
                ],
                "data_accuracy_issues": [
                    {
                        "claimed": "250",
                        "actual": "240",
                        "location": "Turkey 2020",
                        "severity": "minor"
                    }
                ],
                "coverage_percentage": 75.0,
                "critical_features_covered": True,
                "important_features_covered": False,
                "specific_gaps": [
                    "Student missed the sharp increase in consumption after 2015",
                    "No comparison made between UK and France"
                ]
            }
        }


# ============================================================
# HELPER FUNCTIONS
# ============================================================

def convert_legacy_description(text_description: str, chart_type: ChartType = ChartType.UNKNOWN) -> StructuredVisualDescription:
    """
    Convert a legacy plain text description to structured format.
    
    This maintains backward compatibility with existing code.
    """
    return StructuredVisualDescription(
        chart_type=chart_type,
        text_summary=text_description,
        data_points=[],
        key_features=[],
        expected_elements=[]
    )
