package org.example.backendservice.service;

import jakarta.transaction.Transactional;
import org.example.backendservice.domain.User;
import org.example.backendservice.dto.UserDTO;
import org.example.backendservice.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class UserService {


    @Autowired
    UserRepository userRepository;

    public ResponseEntity<?> createUser(UserDTO userDTO){
        try {
            User user = new User(
                    userDTO.getUsername(),
                    userDTO.getFirstname(),
                    userDTO.getLastname(),
                    userDTO.getPassword(),
                    userDTO.getDateOfBirth(),
                    userDTO.getEmail(),
                    userDTO.getGender()
            );
            userRepository.save(user);
            return ResponseEntity.ok(Map.of("Sukces","Sukces, utworzono użytkownika"));
        } catch (Exception e){
            return ResponseEntity.status(500).body(Map.of("Błąd", "Nie udało sie utworzyć użytkownika"));

        }
    }

    @Transactional
    public ResponseEntity<?> removeUser(Long id){
        try {
            Optional<User> userOpt = userRepository.findById(id);
            if (userOpt.isEmpty()){
                return ResponseEntity.status(403).body(Map.of("Błąd", "Nie odnaleziono użytkownika"));
            }

            User user = userOpt.get();

            userRepository.deleteById(id);

            return ResponseEntity.ok(Map.of("Sukces","Usunięto użytkownika: "+user.getUsername()+"."));
        } catch (Exception e){
            return ResponseEntity.status(500).body(Map.of("Błąd", "Nie udało sie usunąć użytkownika"));
        }
    }

    public ResponseEntity<?> getUser(Long id){
        try {
            Optional<User> userOpt = userRepository.findById(id);
            if (userOpt.isEmpty()){
                return ResponseEntity.status(403).body(Map.of("Błąd", "Nie odnaleziono użytkownika"));
            }

            User user = userOpt.get();

            UserDTO userDTO = new UserDTO(
                    user.getUsername(),
                    user.getFirstname(),
                    user.getLastname(),
                    user.getPassword(),
                    user.getDateOfBirth(),
                    user.getEmail(),
                    user.getGender()
            );

            return ResponseEntity.ok().body(Map.of("Sukces",userDTO));

        } catch (Exception e){
            return ResponseEntity.status(500).body(Map.of("Błąd", "Nie udało sie pobrać użytkownika"));
        }
    }


    public ResponseEntity<?> editUser(Long id, UserDTO userDTO){
        try {
            Optional<User> userOpt = userRepository.findById(id);
            if (userOpt.isEmpty()) {
                return ResponseEntity.status(403).body(Map.of("Błąd", "Nie odnaleziono użytkownika"));
            }

            User user = userOpt.get();

            user.setEmail(userDTO.getEmail());
            user.setFirstname(userDTO.getFirstname());
            user.setGender(userDTO.getGender());
            user.setLastname(userDTO.getLastname());
            user.setDateOfBirth(userDTO.getDateOfBirth());
            user.setPassword(userDTO.getPassword());
            user.setUsername(userDTO.getUsername());

            userRepository.save(user);
            return ResponseEntity.ok().body(Map.of("Sukces","Edytowano użytkownika"));
        } catch (Exception e){
            return ResponseEntity.status(500).body(Map.of("Błąd", "Nie udało sie edytować użytkownika"));
        }
    }


    public ResponseEntity<?> getAll(int page, int size, String sortBy, String sortDir) {
        try {
            Sort.Direction dir = sortDir.equalsIgnoreCase("desc")
                    ? Sort.Direction.DESC
                    : Sort.Direction.ASC;

            Pageable pageable = PageRequest.of(page, size, Sort.by(dir, sortBy));

            Page<User> usersPage = userRepository.findAll(pageable);

            Map<String, Object> resp = new LinkedHashMap<>();
            resp.put("page",       usersPage.getNumber());
            resp.put("size",       usersPage.getSize());
            resp.put("totalPages", usersPage.getTotalPages());
            resp.put("totalItems", usersPage.getTotalElements());
            resp.put("sortBy",     sortBy);
            resp.put("sortDir",    sortDir);
            resp.put("users",      usersPage.getContent());

            return ResponseEntity.ok(resp);
        } catch (Exception e) {
            return ResponseEntity
                    .status(500)
                    .body(Map.of("error", "Błąd podczas pobierania użytkowników"));
        }
    }



}
