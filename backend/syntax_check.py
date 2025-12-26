from enum import Enum
import datetime

# Mocking SQLModel/SQLAlchemy behavior coarsely
class Col:
    def __init__(self, name): self.name = name
    def __eq__(self, other): return f"{self.name} == {other}"
    def __lt__(self, other): return f"{self.name} < {other}"
    def __ge__(self, other): return f"{self.name} >= {other}"
    def __and__(self, other): return f"({self} AND {other})"
    def __or__(self, other): return f"({self} OR {other})"

class EventStatus(str, Enum):
    UPCOMING = "upcoming"
    COMPLETED = "completed"

class Event:
    status = Col("Event.status")
    date = Col("Event.date")

def test_logic():
    try:
        # The logic I added
        expr = (
            (Event.status == EventStatus.COMPLETED) | 
            ((Event.status == EventStatus.UPCOMING) & (Event.date < datetime.date.today()))
        )
        print("Expression constructed successfully:", expr)
    except Exception as e:
        print("Syntax/Logic Error:", e)

if __name__ == "__main__":
    test_logic()
