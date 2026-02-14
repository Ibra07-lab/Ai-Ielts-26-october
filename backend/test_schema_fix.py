from pydantic import BaseModel, Field, field_validator, ValidationError
from typing import List

class ComplexitySuggestion(BaseModel):
    simple_sentences: List[str] = Field(default_factory=list)
    
    @field_validator("simple_sentences", mode="before")
    @classmethod
    def ensure_list(cls, v):
        print(f"DEBUG: ensure_list called with {type(v)}: {v}")
        if isinstance(v, str):
            return [v]
        return v

try:
    # Test with string input - should pass if validator works
    obj = ComplexitySuggestion(simple_sentences="This is a sentence.")
    print("SUCCESS: ", obj.simple_sentences)
except ValidationError as e:
    print("FAILURE: ", e)
