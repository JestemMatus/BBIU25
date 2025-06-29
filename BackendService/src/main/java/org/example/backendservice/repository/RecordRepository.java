package org.example.backendservice.repository;

import org.example.backendservice.domain.Record;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RecordRepository extends JpaRepository<Record, Long> {

    List<Record> findTop5ByOrderByPointsDescNameAsc();

}
