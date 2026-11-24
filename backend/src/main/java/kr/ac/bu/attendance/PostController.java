package kr.ac.bu.attendance;

import java.util.List;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/posts")
class PostController {
    private final PostService service;
    PostController(PostService service) { this.service = service; }
    @GetMapping List<ApiContracts.Post> getPosts(@RequestParam(required = false) String type, @RequestParam(required = false) Boolean faq, @RequestParam(required = false) String query) { return service.getPosts(type, faq, query); }
    @GetMapping("/{postId}") ApiContracts.Post getPost(@PathVariable long postId) { return service.getPost(postId); }
    @PostMapping ApiContracts.Post createPost(@RequestBody ApiContracts.CreatePostRequest request) { return service.createPost(request); }
}
