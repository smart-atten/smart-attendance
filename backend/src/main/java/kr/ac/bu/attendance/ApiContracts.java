package kr.ac.bu.attendance;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.LocalTime;
import java.util.List;

public final class ApiContracts {
    private ApiContracts() {}

    public record Student(String userId, String studentNo, String displayName, String role, boolean pushEnabled) {}
    public record TimeSlot(String slotId, int weekday, LocalTime startTime, LocalTime endTime, String room) {}
    public record Course(String offeringId, String courseCode, String courseName, int academicYear,
                         String termCode, String sectionCode, String instructorName,
                         String deliveryType, List<TimeSlot> slots) {}
    public record Attendance(String sessionId, String offeringId, String courseName, LocalDate sessionDate,
                             int weekNo, OffsetDateTime startsAt, OffsetDateTime endsAt,
                             OffsetDateTime checkinOpenAt, OffsetDateTime checkinCloseAt, String status) {}
    public record CheckInResult(String sessionId, String status, OffsetDateTime checkedAt) {}
    public record Post(String postId, String postType, String title, String body, String authorDisplayName,
                       boolean anonymous, boolean faq, String answerBody, OffsetDateTime answeredAt,
                       OffsetDateTime createdAt, List<PostAttachment> attachments) {}
    public record PostAttachment(String attachmentId, String originalName, String mimeType, String downloadUrl) {}
    public record CreatePostRequest(String postType, String title, String body, boolean anonymous) {}
    public record Notification(String notificationId, String notificationType, String title, String body,
                               OffsetDateTime createdAt, OffsetDateTime readAt) {}
    public record SettingsRequest(boolean pushEnabled) {}
    public record Settings(boolean pushEnabled) {}
}
