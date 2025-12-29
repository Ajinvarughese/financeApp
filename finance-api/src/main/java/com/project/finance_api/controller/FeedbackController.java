package com.project.finance_api.controller;

import com.project.finance_api.entity.Feedback;
import com.project.finance_api.service.FeedbackService;
import com.project.finance_api.feedback.FeedbackStatus;
import com.project.finance_api.feedback.dto.FeedbackRequest;
import com.project.finance_api.file.FileUpload;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/feedback")
@RequiredArgsConstructor
public class FeedbackController {

    private final FeedbackService service;
    private final FileUpload fileUpload;

    // 🔹 Add feedback
    @PostMapping
    public ResponseEntity<Feedback> addFeedback(
            @Valid @RequestBody FeedbackRequest request
    ) {
        return ResponseEntity.ok(service.addFeedback(request));
    }

    // 🔹 Get all feedback (ADMIN)
    @GetMapping
    public ResponseEntity<List<Feedback>> getAll() {
        return ResponseEntity.ok(service.getAllFeedback());
    }

    // 🔹 Get feedback by user (PROFILE → REPORTS)
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Feedback>> getByUser(
            @PathVariable Long userId
    ) {
        return ResponseEntity.ok(service.getFeedbackByUser(userId));
    }

    // 🔹 Update feedback status (ADMIN)
    @PatchMapping("/{id}/status")
    public ResponseEntity<Feedback> updateStatus(
            @PathVariable Long id,
            @RequestParam FeedbackStatus status
    ) {
        return ResponseEntity.ok(service.updateStatus(id, status));
    }

    // 🔹 File upload
    @PostMapping(
            path = "/file/upload",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<Map<String, String>> uploadFile(
            @RequestParam("document") MultipartFile file
    ) throws IOException {

        String url = fileUpload.uploadFile(file);
        return ResponseEntity.ok(Map.of("url", url));
    }
}
