package ru.ifmo.first_wildfly.api;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import ru.ifmo.first_wildfly.exception.FirstException;
import ru.ifmo.first_wildfly.model.Error;

import java.time.OffsetDateTime;

@RestControllerAdvice
public class ApiHandler {

    @ExceptionHandler(FirstException.class)
    public ResponseEntity<Error> onError(FirstException e) {
        return ResponseEntity.status(e.getCode().value())
                .body(buildBody(e));
    }

    private Error buildBody(FirstException e) {
        return new Error()
                .timestamp(OffsetDateTime.now())
                .message(e.getMessage())
                .error(e.getCode().getReasonPhrase())
                .status(e.getCode().value());
    }
}
