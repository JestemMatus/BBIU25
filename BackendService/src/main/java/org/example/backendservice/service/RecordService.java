package org.example.backendservice.service;

import org.example.backendservice.domain.Record;
import org.example.backendservice.repository.RecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class RecordService {

    @Autowired
    RecordRepository recordRepository;

    public ResponseEntity<?> setRecord(String player, int score){
        Record record = new Record();

        record.setName(player);
        record.setPoints(score);

        try {
            recordRepository.save(record);
            return ResponseEntity.ok(Map.of("Sukces", "Zapisano twój rekord"));
        } catch (Exception e){
            return ResponseEntity.status(500).body(Map.of("Błąd", "Wystapił nieoczekiwany błąd"));
        }
    }

    public ResponseEntity<?> getRecords(){
        List<Record> recordList = recordRepository.findTop5ByOrderByPointsDescNameAsc();
        try {
            if (recordList.isEmpty()){
                return ResponseEntity.ok(Map.of("Sukces","Lista rekordów jest pusta."));
            }
                return ResponseEntity.ok(Map.of("Sukces",recordList));
        } catch (Exception e){
            return ResponseEntity.status(500).body(Map.of("Błąd","Wystąpił nieoczekiwany błąd"));
        }

    }

}
