package kr.ac.bu.attendance;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;

@RestController
@RequestMapping("/api")
class EndpointSkeleton {
    private ResponseStatusException pending() { return new ResponseStatusException(HttpStatus.NOT_IMPLEMENTED, "Not implemented"); }
    @GetMapping("/me") ApiContracts.Student getCurrentStudent() { throw pending(); }
    @GetMapping("/me/timetable") List<ApiContracts.Course> getMyTimetable(@RequestParam int year, @RequestParam String term) { throw pending(); }
    @GetMapping("/me/attendance") List<ApiContracts.Attendance> getMyAttendance(@RequestParam(required = false) Long offeringId) { throw pending(); }
    @PostMapping("/attendance/{sessionId}/check-in") ApiContracts.CheckInResult checkIn(@PathVariable long sessionId) { throw pending(); }
    @GetMapping("/posts") List<ApiContracts.Post> getPosts(@RequestParam(required = false) String type, @RequestParam(required = false) Boolean faq, @RequestParam(required = false) String query) { throw pending(); }
    @GetMapping("/posts/{postId}") ApiContracts.Post getPost(@PathVariable long postId) { throw pending(); }
    @PostMapping("/posts") ApiContracts.Post createPost(@RequestBody ApiContracts.CreatePostRequest request) { throw pending(); }
    @GetMapping("/notifications") List<ApiContracts.Notification> getNotifications() { throw pending(); }
    @PatchMapping("/me/settings") ApiContracts.Settings updateSettings(@RequestBody ApiContracts.SettingsRequest request) { throw pending(); }
}
