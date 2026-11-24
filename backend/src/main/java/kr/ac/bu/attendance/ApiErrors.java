package kr.ac.bu.attendance;

import java.time.Instant;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

@RestControllerAdvice
class ApiErrors {
    @ExceptionHandler(ResponseStatusException.class)
    ResponseEntity<Map<String, Object>> handle(ResponseStatusException e) {
        return ResponseEntity.status(e.getStatusCode()).body(Map.of(
            "timestamp", Instant.now().toString(), "status", e.getStatusCode().value(),
            "message", e.getReason() == null ? HttpStatus.valueOf(e.getStatusCode().value()).getReasonPhrase() : e.getReason()));
    }
}
