import sys
import os
import asyncio
from unittest.mock import MagicMock
from dotenv import load_dotenv

# Mock Encore modules BEFORE importing backend
sys.modules["encore"] = MagicMock()
sys.modules["encore.api"] = MagicMock()
sys.modules["encore.storage"] = MagicMock()
sys.modules["encore.storage.sqldb"] = MagicMock()

# Add backend directory to sys.path
backend_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(backend_dir)

# Load env
load_dotenv(os.path.join(backend_dir, ".env"))

print(f"Backend dir: {backend_dir}")

try:
    from ielts_writing.agents.pipeline import get_pipeline
    from ielts_writing.models import EvaluateRequest, TaskType
    # We can try importing service too, though it won't do much without Encore
    from ielts_writing import service
    print("Imports: OK")
except ImportError as e:
    print(f"Imports: FAILED - {e}")
    sys.exit(1)

async def main():
    print("\nInitializing WritingPipeline...")
    try:
        # Check if API key needs to be mocked for this test if not in env
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            print("Warning: OPENAI_API_KEY not set. Mocking for initialization test.")
            os.environ["OPENAI_API_KEY"] = "sk-mock-key"
        
        pipeline = get_pipeline()
        print("WritingPipeline: Initialized OK (Singleton)")
        
        # Mock memory methods to avoid DB calls
        pipeline.memory.get_user_patterns = MagicMock(return_value=asyncio.Future())
        pipeline.memory.get_user_patterns.return_value.set_result([])
        
        # Test basic request instantiation
        req = EvaluateRequest(
            task_type=TaskType.TASK1,
            question="Chart showing bar sales.",
            essay="The chart shows...",
            user_id="user123"
        )
        print(f"Request Model: Validated OK -> {req.task_type}")

    except Exception as e:
        print(f"Verification FAILED - {e}")

if __name__ == "__main__":
    asyncio.run(main())
