from .models import WritingSubmission, WritingFeedback

# Mock database simulation
# In a real app, this would connect to PostgreSQL or similar

class WritingDB:
    def __init__(self):
        self._submissions = {}
        self._counter = 0

    def save_submission(self, submission: WritingSubmission, feedback: WritingFeedback) -> int:
        self._counter += 1
        record_id = self._counter
        self._submissions[record_id] = {
            "submission": submission.dict(),
            "feedback": feedback.dict()
        }
        return record_id

    def get_submission(self, submission_id: int):
        return self._submissions.get(submission_id)

# Singleton instance
db = WritingDB()
