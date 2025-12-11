package ru.ifmo.first_wildfly.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public class FirstException extends RuntimeException {

    private final HttpStatus code;

    public FirstException(HttpStatus code, String message) {
        super(message);
        this.code = code;
    }

}
