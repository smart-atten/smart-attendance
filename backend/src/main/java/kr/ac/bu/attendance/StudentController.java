package kr.ac.bu.attendance;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/me")
class StudentController {
    private final StudentService service;
    StudentController(StudentService service) { this.service = service; }
    @GetMapping ApiContracts.Student getCurrentStudent() { return service.getCurrentStudent(); }
    @PatchMapping("/settings") ApiContracts.Settings updateSettings(@RequestBody ApiContracts.SettingsRequest request) { return service.updateSettings(request); }
}
