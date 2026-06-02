import pytest
import time
from circuit_breaker import CircuitBreaker

def test_circuit_breaker_states():
    cb = CircuitBreaker(name="test", failure_threshold=3, cooldown_seconds=1)
    
    # 1. Start in CLOSED state
    assert cb.state == "CLOSED"
    assert cb.can_execute() is True
    
    # 2. Record failures
    cb.record_failure()
    cb.record_failure()
    assert cb.state == "CLOSED"
    
    cb.record_failure()
    # 3. Trip to OPEN state
    assert cb.state == "OPEN"
    assert cb.can_execute() is False
    assert cb.total_rejected == 1
    
    # 4. Request while OPEN should be rejected
    assert cb.can_execute() is False
    assert cb.total_rejected == 2
    
    # 5. Wait for cooldown
    time.sleep(1.1)
    
    # 6. Should transition to HALF_OPEN when checking
    assert cb.can_execute() is True
    assert cb.state == "HALF_OPEN"
    
    # 7. Record success in HALF_OPEN
    cb.record_success()
    # 8. Should transition back to CLOSED
    assert cb.state == "CLOSED"
    assert cb.failure_count == 0

def test_circuit_breaker_half_open_failure():
    cb = CircuitBreaker(name="test", failure_threshold=1, cooldown_seconds=0.1)
    
    cb.record_failure()
    assert cb.state == "OPEN"
    
    time.sleep(0.2)
    assert cb.can_execute() is True
    assert cb.state == "HALF_OPEN"
    
    # Failure in HALF_OPEN should trip back to OPEN immediately
    cb.record_failure()
    assert cb.state == "OPEN"
    assert cb.can_execute() is False
