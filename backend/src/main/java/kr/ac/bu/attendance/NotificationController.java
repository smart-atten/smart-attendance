package kr.ac.bu.attendance;

import java.util.List;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notifications")
class NotificationController {
    private final NotificationService service;
    NotificationController(NotificationService service) { this.service = service; }
    @GetMapping List<ApiContracts.Notification> getNotifications() { return service.getNotifications(); }
}
