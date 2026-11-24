package kr.ac.bu.attendance;

import java.util.List;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
class TimetableController {
    private final TimetableService service;
    TimetableController(TimetableService service) { this.service = service; }
    @GetMapping("/me/timetable") List<ApiContracts.Course> getMyTimetable(@RequestParam int year, @RequestParam String term) { return service.getMyTimetable(year, term); }
    @GetMapping("/me/attendance") List<ApiContracts.Attendance> getMyAttendance(@RequestParam(required = false) Long offeringId) { return service.getMyAttendance(offeringId); }
    @PostMapping("/attendance/{sessionId}/check-in") ApiContracts.CheckInResult checkIn(@PathVariable long sessionId) { return service.checkIn(sessionId); }
}
