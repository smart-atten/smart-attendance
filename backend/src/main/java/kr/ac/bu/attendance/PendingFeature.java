package kr.ac.bu.attendance;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

final class PendingFeature {
    private PendingFeature() {}
    static ResponseStatusException exception() { return new ResponseStatusException(HttpStatus.NOT_IMPLEMENTED, "Not implemented"); }
}
