"""
Test cases for feature coverage validation.

Tests various chart types and validation scenarios.
"""

import pytest
from ..schemas.visual_description import (
    StructuredVisualDescription,
    VisualFeature,
    DataPoint,
    FeatureType,
    FeaturePriority,
    ChartType
)
from ..validators.feature_coverage import FeatureCoverageValidator


class TestLineGraphValidation:
    """Test cases for line graph feature validation."""
    
    def test_line_graph_with_all_features_mentioned(self):
        """Test when student mentions all key features."""
        
        # Create a line graph description
        visual_desc = StructuredVisualDescription(
            chart_type=ChartType.LINE_GRAPH,
            title="Water Consumption by Country (2010-2020)",
            axes={"x": "Years", "y": "Water consumption (L/capita)"},
            units="L/capita",
            time_period="2010-2020",
            data_points=[
                DataPoint(label="Turkey - 2010", value=180, unit="L/capita"),
                DataPoint(label="Turkey - 2020", value=250, unit="L/capita"),
                DataPoint(label="UK - 2010", value=150, unit="L/capita"),
                DataPoint(label="UK - 2020", value=180, unit="L/capita"),
            ],
            key_features=[
                VisualFeature(
                    feature_type=FeatureType.EXTREME,
                    description="Turkey has highest consumption throughout",
                    priority=FeaturePriority.CRITICAL,
                    expected_mention="Turkey highest",
                    related_data=["Turkey - 2010", "Turkey - 2020"]
                ),
                VisualFeature(
                    feature_type=FeatureType.TREND,
                    description="All countries increased",
                    priority=FeaturePriority.IMPORTANT,
                    expected_mention="increased"
                )
            ],
            text_summary="Line graph showing water consumption in multiple countries from 2010 to 2020.",
            expected_elements=["overview", "highest value", "trend"]
        )
        
        # Student essay that mentions all features
        essay = """
        The line graph illustrates water consumption in several countries between 2010 and 2020.
        Overall, Turkey had the highest water consumption throughout the period, starting at 180 L/capita
        in 2010 and increasing to 250 L/capita by 2020. All countries showed an upward trend,
        with the UK rising from 150 to 180 L/capita over the same period.
        """
        
        validator = FeatureCoverageValidator()
        analysis = validator.validate(essay, visual_desc)
        
        assert analysis.coverage_percentage == 100.0
        assert analysis.critical_features_covered == True
        assert len(analysis.features_mentioned) == 2
        assert len(analysis.features_missed) == 0
    
    def test_line_graph_with_missing_critical_feature(self):
        """Test when student misses a critical feature."""
        
        visual_desc = StructuredVisualDescription(
            chart_type=ChartType.LINE_GRAPH,
            data_points=[
                DataPoint(label="Turkey - 2020", value=250, unit="L/capita"),
            ],
            key_features=[
                VisualFeature(
                    feature_type=FeatureType.EXTREME,
                    description="Turkey has highest consumption",
                    priority=FeaturePriority.CRITICAL,
                    expected_mention="Turkey highest"
                ),
                VisualFeature(
                    feature_type=FeatureType.TREND,
                    description="Sharp increase after 2015",
                    priority=FeaturePriority.IMPORTANT,
                    expected_mention="sharp increase 2015"
                )
            ],
            text_summary="Line graph of water consumption.",
            expected_elements=[]
        )
        
        # Essay that only mentions the trend, not the highest value
        essay = """
        The graph shows that water consumption increased sharply after 2015.
        There was a notable rise in all countries during this period.
        """
        
        validator = FeatureCoverageValidator()
        analysis = validator.validate(essay, visual_desc)
        
        assert analysis.coverage_percentage == 50.0  # Only 1 of 2 features
        assert analysis.critical_features_covered == False  # Critical feature missed
        assert len(analysis.features_missed) == 1
        assert analysis.features_missed[0].priority == FeaturePriority.CRITICAL


class TestBarChartValidation:
    """Test cases for bar chart feature validation."""
    
    def test_bar_chart_with_comparisons(self):
        """Test bar chart with comparison features."""
        
        visual_desc = StructuredVisualDescription(
            chart_type=ChartType.BAR_CHART,
            axes={"x": "Countries", "y": "GDP (billions)"},
            data_points=[
                DataPoint(label="USA", value=21000, unit="billion"),
                DataPoint(label="China", value=14000, unit="billion"),
                DataPoint(label="Japan", value=5000, unit="billion"),
            ],
            key_features=[
                VisualFeature(
                    feature_type=FeatureType.EXTREME,
                    description="USA has highest GDP",
                    priority=FeaturePriority.CRITICAL,
                    expected_mention="USA highest GDP"
                ),
                VisualFeature(
                    feature_type=FeatureType.COMPARISON,
                    description="USA GDP is 1.5x China's",
                    priority=FeaturePriority.IMPORTANT,
                    expected_mention="USA higher than China"
                )
            ],
            text_summary="Bar chart comparing GDP of three countries.",
            expected_elements=["highest", "comparison"]
        )
        
        essay = """
        The bar chart compares the GDP of three countries. The USA has the highest GDP at 
        21,000 billion, which is significantly more than China at 14,000 billion.
        Japan has the lowest figure at 5,000 billion.
        """
        
        validator = FeatureCoverageValidator()
        analysis = validator.validate(essay, visual_desc)
        
        assert analysis.coverage_percentage == 100.0
        assert analysis.critical_features_covered == True


class TestProcessDiagramValidation:
    """Test cases for process diagram feature validation."""
    
    def test_process_diagram_stages(self):
        """Test process diagram with stages."""
        
        visual_desc = StructuredVisualDescription(
            chart_type=ChartType.PROCESS_DIAGRAM,
            stages=[
                "Raw materials collected",
                "Materials processed",
                "Product manufactured",
                "Quality checked",
                "Distributed to stores"
            ],
            stage_count=5,
            key_features=[
                VisualFeature(
                    feature_type=FeatureType.STAGE,
                    description="5-stage manufacturing process",
                    priority=FeaturePriority.CRITICAL,
                    expected_mention="five stages"
                ),
                VisualFeature(
                    feature_type=FeatureType.STAGE,
                    description="Quality check before distribution",
                    priority=FeaturePriority.IMPORTANT,
                    expected_mention="quality checked"
                )
            ],
            text_summary="Process diagram showing manufacturing stages.",
            data_points=[],
            expected_elements=["stages", "sequence", "passive voice"]
        )
        
        essay = """
        The diagram illustrates a five-stage manufacturing process. First, raw materials are collected,
        then they are processed. After processing, the product is manufactured and quality checked.
        Finally, it is distributed to stores.
        """
        
        validator = FeatureCoverageValidator()
        analysis = validator.validate(essay, visual_desc)
        
        assert analysis.coverage_percentage == 100.0
        assert analysis.critical_features_covered == True


class TestDataAccuracyValidation:
    """Test cases for data accuracy checking."""
    
    def test_accurate_data(self):
        """Test when student reports accurate data."""
        
        visual_desc = StructuredVisualDescription(
            chart_type=ChartType.LINE_GRAPH,
            data_points=[
                DataPoint(label="Turkey 2020", value=250, unit="L/capita"),
                DataPoint(label="UK 2020", value=180, unit="L/capita"),
            ],
            key_features=[],
            text_summary="Water consumption data.",
            expected_elements=[]
        )
        
        essay = """
        Turkey consumed 250 L/capita in 2020, while the UK consumed 180 L/capita.
        """
        
        validator = FeatureCoverageValidator()
        analysis = validator.validate(essay, visual_desc)
        
        assert len(analysis.data_accuracy_issues) == 0
    
    def test_minor_data_error(self):
        """Test when student has minor data inaccuracy (within 5%)."""
        
        visual_desc = StructuredVisualDescription(
            chart_type=ChartType.LINE_GRAPH,
            data_points=[
                DataPoint(label="Turkey 2020", value=250, unit="L/capita"),
            ],
            key_features=[],
            text_summary="Water consumption data.",
            expected_elements=[]
        )
        
        essay = """
        Turkey consumed approximately 260 L/capita in 2020.
        """
        
        validator = FeatureCoverageValidator()
        analysis = validator.validate(essay, visual_desc)
        
        # 260 vs 250 = 4% difference (minor)
        assert len(analysis.data_accuracy_issues) == 1
        assert analysis.data_accuracy_issues[0].severity == "minor"
    
    def test_major_data_error(self):
        """Test when student has major data inaccuracy (>15%)."""
        
        visual_desc = StructuredVisualDescription(
            chart_type=ChartType.LINE_GRAPH,
            data_points=[
                DataPoint(label="Turkey 2020", value=250, unit="L/capita"),
            ],
            key_features=[],
            text_summary="Water consumption data.",
            expected_elements=[]
        )
        
        essay = """
        Turkey consumed 350 L/capita in 2020.
        """
        
        validator = FeatureCoverageValidator()
        analysis = validator.validate(essay, visual_desc)
        
        # 350 vs 250 = 40% difference (major)
        assert len(analysis.data_accuracy_issues) == 1
        assert analysis.data_accuracy_issues[0].severity == "major"
        assert analysis.data_accuracy_issues[0].claimed == "350"
        assert analysis.data_accuracy_issues[0].actual == "250"


class TestMapValidation:
    """Test cases for map feature validation."""
    
    def test_map_with_location_changes(self):
        """Test map with location and change features."""
        
        visual_desc = StructuredVisualDescription(
            chart_type=ChartType.MAP,
            locations=["School", "Park", "Shopping Center"],
            changes=[
                "Park replaced by shopping center",
                "New school built to the north"
            ],
            key_features=[
                VisualFeature(
                    feature_type=FeatureType.CHANGE,
                    description="Park replaced by shopping center",
                    priority=FeaturePriority.CRITICAL,
                    expected_mention="park replaced shopping center"
                ),
                VisualFeature(
                    feature_type=FeatureType.LOCATION,
                    description="New school in northern area",
                    priority=FeaturePriority.IMPORTANT,
                    expected_mention="school north"
                )
            ],
            text_summary="Map showing urban development changes.",
            data_points=[],
            expected_elements=["changes", "locations"]
        )
        
        essay = """
        The map shows that the park was replaced by a shopping center in the town.
        Additionally, a new school was constructed in the northern area of the town.
        """
        
        validator = FeatureCoverageValidator()
        analysis = validator.validate(essay, visual_desc)
        
        assert analysis.coverage_percentage == 100.0
        assert analysis.critical_features_covered == True


class TestLegacyCompatibility:
    """Test backward compatibility with legacy string descriptions."""
    
    def test_legacy_string_description(self):
        """Test that validator works with minimal structure."""
        
        from ..schemas.visual_description import convert_legacy_description
        
        legacy_desc = "Line graph showing water consumption from 2010 to 2020."
        visual_desc = convert_legacy_description(legacy_desc, ChartType.LINE_GRAPH)
        
        essay = "The line graph shows water consumption over a decade."
        
        validator = FeatureCoverageValidator()
        analysis = validator.validate(essay, visual_desc)
        
        # Should not crash, but will have 0% coverage (no features defined)
        assert analysis.coverage_percentage == 0.0
        assert len(analysis.features_missed) == 0  # No features to miss


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
