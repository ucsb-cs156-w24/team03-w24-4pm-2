package edu.ucsb.cs156.example.controllers;

import edu.ucsb.cs156.example.errors.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;

import edu.ucsb.cs156.example.models.CurrentUser;
import edu.ucsb.cs156.example.services.CurrentUserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.util.Map;

@Slf4j
public abstract class ApiController {
  @Autowired
  private CurrentUserService currentUserService;

  protected CurrentUser getCurrentUser() {
    return currentUserService.getCurrentUser();
  }

  protected Object genericMessage(String message) {
    return Map.of("message", message);
  }

  @ExceptionHandler({ EntityNotFoundException.class })
  @ResponseStatus(HttpStatus.NOT_FOUND)
  public Object handleGenericException(Throwable e) {
    return Map.of(
      "type", e.getClass().getSimpleName(),
      "message", e.getMessage()
    );
  }
}
