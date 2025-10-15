package ru.ifmo.api;

import jakarta.validation.ConstraintViolationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.OffsetDateTime;

@Slf4j
@RestControllerAdvice
public class ApiHandler {

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ru.ifmo.external.model.Error> onError(Exception e) {
        log.error("Global error was handled", e);
        return ResponseEntity.status(500)
                .body(buildBody(e));
    }

    private ru.ifmo.external.model.Error buildBody(Exception e) {
        return new ru.ifmo.external.model.Error()
                .timestamp(OffsetDateTime.now())
                .message(e.toString())
                .error(HttpStatus.INTERNAL_SERVER_ERROR.getReasonPhrase())
                .status(500);
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ru.ifmo.external.model.Error> onError(ConstraintViolationException e) {
        return ResponseEntity.status(400)
                .body(new ru.ifmo.external.model.Error()
                        .timestamp(OffsetDateTime.now())
                        .error(HttpStatus.BAD_REQUEST.getReasonPhrase())
                        .status(400));
    }
}
