package com.lukascode.puns.core.api.dto;

import java.time.LocalDateTime;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MediaUploadResponse {

    private UUID resourceId;

    private String name;

    private LocalDateTime creationTime;

}
