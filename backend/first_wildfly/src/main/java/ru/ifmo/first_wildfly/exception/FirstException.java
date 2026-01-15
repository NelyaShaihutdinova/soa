package ru.ifmo.first_wildfly.exception;

import lombok.Getter;

@Getter
public class FirstException extends RuntimeException {

    public FirstException(String message) {
        super(message);
    }

}
