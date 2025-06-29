package org.example.backendservice.validator;

import org.example.backendservice.domain.User;
import org.example.backendservice.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.validation.Errors;
import org.springframework.validation.Validator;

import java.util.Optional;

@Component
public class UserValidator implements Validator {

    private boolean validatePassword = true;

    private final UserRepository userRepository;


    @Autowired
    public UserValidator(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public boolean supports(Class<?> clazz){
        return User.class.isAssignableFrom(clazz);
    }

    public void validate(Object obj, Errors e){
        User user = (User) obj;

        if (user.getUsername() == null || user.getUsername().trim().isEmpty()){
            e.rejectValue("username","username.empty","Login nie może być pusty.");
        }

        if (user.getUsername().length() > 50){
            e.rejectValue("username","username.toLong","Login może zawierać maksymalnie 50 znaków.");
        }

        if (user.getFirstname() == null || user.getFirstname().trim().isEmpty()){
            e.rejectValue("firstname", "firstname.empty","Pole imienia nie może być puste.");
        }

        if (user.getFirstname().length() > 50){
            e.rejectValue("firstname","firstname.toLong","Imię może zawierać maksymalnie 50 znaków.");
        }

        if (user.getLastname() == null || user.getLastname().trim().isEmpty()){
            e.rejectValue("lastname","lastname.empty", "Pole nazwiska nie może być puste.");
        }

        if (user.getLastname().length() > 50){
            e.rejectValue("lastname","lastname.toLong","Nazwisko może zawierać maksymalnie 50 znaków.");
        }

        String username = user.getUsername();
        if (username != null && !username.trim().isEmpty()) {
            Optional<User> byLogin = userRepository.findByUsername(username);
            if (byLogin.isPresent() && !byLogin.get().getId().equals(user.getId())) {
                e.rejectValue("username", "username.exists", "Użytkownik o takim loginie już istnieje.");
            }
        }

        String email = user.getEmail();
        if (email != null && !email.trim().isEmpty()) {
            Optional<User> byEmail = userRepository.findByEmail(email);
            if (byEmail.isPresent() && !byEmail.get().getId().equals(user.getId())) {
                e.rejectValue("email", "email.exists", "Użytkownik o takim adresie e-mail już istnieje.");
            }
        }

        if (validatePassword) {

            String password = user.getPassword();
            if (password == null || password.length() < 8) {
                e.rejectValue("password", "password.tooShort", "Hasło musi mieć co najmniej 8 znaków");
            } else if (!password.matches(".*[A-Z].*")) {
                e.rejectValue("password", "password.noUppercase", "Hasło musi zawierać przynajmniej jedną wielką literę");
            } else if (!password.matches(".*[a-z].*")) {
                e.rejectValue("password", "password.noLowercase", "Hasło musi zawierać przynajmniej jedną małą literę");
            } else if (!password.matches(".*\\d.*")) {
                e.rejectValue("password", "password.noDigit", "Hasło musi zawierać przynajmniej jedną cyfrę");
            } else if (!password.matches(".*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>\\/?].*")) {
                e.rejectValue("password", "password.noSpecialChar", "Hasło musi zawierać przynajmniej jeden znak specjalny");
            } else if (password.length() > 50){
                e.rejectValue("password", "password.toLong", "Hasło może zawierać maksymalnie 50 znaków");
            }
        }
    }
}
