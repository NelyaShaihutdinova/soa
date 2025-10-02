package ru.ifmo.first_wildfly.exception;

import org.springframework.http.HttpStatus;

public class FirstException extends RuntimeException {

    private final HttpStatus code;

    public FirstException(HttpStatus code, String message) {
        super(message);
        this.code = code;
    }

    public HttpStatus getCode() {
        return code;
    }
}
