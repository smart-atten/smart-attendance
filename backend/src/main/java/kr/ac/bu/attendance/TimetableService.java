package kr.ac.bu.attendance;

import java.util.List;
import org.springframework.stereotype.Service;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

@Service
class TimetableService {
    private final StudentDataRepository repository;
    TimetableService(StudentDataRepository repository) { this.repository = repository; }
    List<Map<String, Object>> getDevelopmentAttendance(String studentNo, Long offeringId) {
        long userId = repository.findStudentId(studentNo)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Student not found"));
        return repository.findAttendance(userId, offeringId);
    }
    List<ApiContracts.Course> getMyTimetable(int year, String term) { throw PendingFeature.exception(); }
    List<ApiContracts.Attendance> getMyAttendance(Long offeringId) { throw PendingFeature.exception(); }
    ApiContracts.CheckInResult checkIn(long sessionId) { throw PendingFeature.exception(); }
}
