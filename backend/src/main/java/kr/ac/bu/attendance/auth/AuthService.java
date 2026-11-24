package kr.ac.bu.attendance.auth;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserCredentialsRepository userCredentialsRepository;
    private final PasswordService passwordService;

    public AuthController.LoginResponse login(AuthController.LoginRequest request) {
        throw new ResponseStatusException(HttpStatus.NOT_IMPLEMENTED, "Not implemented");
    }
}
