package kr.ac.bu.attendance.auth;

import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

class PasswordServiceTest {
    @Test
    void hashesAndVerifiesPasswords() {
        var passwords = new PasswordService(new BCryptPasswordEncoder());
        var first = passwords.hashPassword("sample-password");
        var second = passwords.hashPassword("sample-password");
        assertNotEquals("sample-password", first);
        assertNotEquals(first, second);
        assertTrue(passwords.matchesPassword("sample-password", first));
        assertFalse(passwords.matchesPassword("wrong-password", first));
    }
}
