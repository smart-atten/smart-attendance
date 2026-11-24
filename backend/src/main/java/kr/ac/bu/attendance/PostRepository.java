package kr.ac.bu.attendance;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
class PostRepository {
    private final JdbcTemplate db;
    PostRepository(JdbcTemplate db) { this.db = db; }

    List<Map<String, Object>> findPosts(String type, Boolean faq, String query) {
        return db.queryForList("""
            SELECT p.post_id, p.post_type, p.title, p.body, p.is_anonymous, p.is_faq,
                   p.answer_body, p.answered_at, p.created_at,
                   CASE WHEN p.is_anonymous THEN NULL ELSE u.display_name END AS author_display_name
              FROM posts p JOIN users u ON u.user_id = p.author_id
             WHERE p.deleted_at IS NULL AND (? IS NULL OR p.post_type = ?)
               AND (? IS NULL OR p.is_faq = ?)
               AND (? IS NULL OR LOCATE(?, p.title) > 0 OR LOCATE(?, p.body) > 0)
             ORDER BY p.created_at DESC, p.post_id DESC
            """, type, type, faq, faq, query, query, query);
    }

    Optional<Map<String, Object>> findPost(long postId) {
        return db.queryForList("""
            SELECT p.post_id, p.post_type, p.title, p.body, p.is_anonymous, p.is_faq,
                   p.answer_body, p.answered_at, p.created_at,
                   CASE WHEN p.is_anonymous THEN NULL ELSE u.display_name END AS author_display_name
              FROM posts p JOIN users u ON u.user_id = p.author_id
             WHERE p.post_id = ? AND p.deleted_at IS NULL
            """, postId).stream().findFirst();
    }

    int createPost(long authorId, ApiContracts.CreatePostRequest post) {
        return db.update("INSERT INTO posts (author_id, post_type, title, body, is_anonymous) VALUES (?, ?, ?, ?, ?)",
                authorId, post.postType(), post.title(), post.body(), post.anonymous());
    }
}
