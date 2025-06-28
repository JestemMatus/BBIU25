package org.example.backendservice.controller;

import org.example.backendservice.dto.UserDTO;
import org.example.backendservice.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    UserService userService;

    @PostMapping
    public ResponseEntity<?> CreateUser(@RequestBody UserDTO user){
        return userService.createUser(user);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> RemoveUser(@PathVariable Long id){
        return userService.removeUser(id);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> GetUser(@PathVariable Long id){
        return userService.getUser(id);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> EditUser(@PathVariable Long id, @RequestBody UserDTO user){
        return userService.editUser(id, user);
    }

    @GetMapping("/get")
    public ResponseEntity<?> GetUsers(
            @RequestParam(defaultValue = "0")   int    page,
            @RequestParam(defaultValue = "10")  int    size,
            @RequestParam(defaultValue = "id")  String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir
    ) {
        return userService.getAll(page, size, sortBy, sortDir);
    }




}
