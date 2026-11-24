package kr.ac.bu.attendance;

import org.springframework.stereotype.Service;

@Service
class StudentService {
    ApiContracts.Student getCurrentStudent() { throw PendingFeature.exception(); }
    ApiContracts.Settings updateSettings(ApiContracts.SettingsRequest request) { throw PendingFeature.exception(); }
}
