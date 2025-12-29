package com.project.finance_api.entity;

import com.project.finance_api.feedback.FeedbackStatus;
import com.project.finance_api.user.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;


@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter

public class Feedback {

        @ManyToOne(optional = false)
        @JoinColumn(name = "user_id")
        private User user;

        @NotBlank
        @Column(columnDefinition = "TEXT", nullable = false)
        private String title;

        @NotBlank
        @Column(columnDefinition = "TEXT", nullable = false)
        private String description;

        private String documentUrl;

        @Enumerated(EnumType.STRING)
        @Column(nullable = false)
        private FeedbackStatus status = FeedbackStatus.PENDING;
    }


}
