package ru.ifmo.first_wildfly.exception;

import lombok.Getter;

@Getter
public class FirstException extends RuntimeException {

    private final int httpStatus;

    public FirstException(String message, int httpStatus) {
        super(message);
        this.httpStatus = httpStatus;
    }
}
