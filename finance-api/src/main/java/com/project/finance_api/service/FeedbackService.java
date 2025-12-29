package com.project.finance_api.service;

import com.project.finance_api.entity.Feedback;
import com.project.finance_api.feedback.FeedbackStatus;
import com.project.finance_api.feedback.dto.FeedbackRequest;
import com.project.finance_api.repository.FeedbackRepository;
import com.project.finance_api.user.User;
import com.project.finance_api.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FeedbackService {

    private final FeedbackRepository feedbackRepo;
    private final UserRepository userRepo;

    public Feedback addFeedback(FeedbackRequest req) {
        User user = userRepo.findById(req.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Feedback feedback = new Feedback();
        feedback.setUser(user);
        feedback.setTitle(req.getTitle());
        feedback.setDescription(req.getDescription());
        feedback.setDocumentUrl(req.getDocumentUrl());
        feedback.setStatus(FeedbackStatus.PENDING);

        return feedbackRepo.save(feedback);
    }

    public List<Feedback> getAllFeedback() {
        return feedbackRepo.findAll();
    }

    public List<Feedback> getFeedbackByUser(Long userId) {
        return feedbackRepo.findByUserId(userId);
    }

    public Feedback updateStatus(Long id, FeedbackStatus status) {
        Feedback feedback = feedbackRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Feedback not found"));

        feedback.setStatus(status);
        return feedbackRepo.save(feedback);
    }
}