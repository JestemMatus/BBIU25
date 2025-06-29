package org.example.backendservice.controller;


import org.example.backendservice.service.RecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/records")
public class RecordsController {

    @Autowired
    RecordService recordService;

    @GetMapping()
    public ResponseEntity<?> getRecords(){
        return recordService.getRecords();
    }

    @PostMapping()
    public ResponseEntity<?> setRecord(@RequestParam String player,@RequestParam int score){
        return recordService.setRecord(player, score);
    }

}
