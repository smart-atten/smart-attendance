package kr.ac.bu.attendance;

import java.util.List;
import org.springframework.stereotype.Service;

@Service
class PostService {
    List<ApiContracts.Post> getPosts(String type, Boolean faq, String query) { throw PendingFeature.exception(); }
    ApiContracts.Post getPost(long postId) { throw PendingFeature.exception(); }
    ApiContracts.Post createPost(ApiContracts.CreatePostRequest request) { throw PendingFeature.exception(); }
}
