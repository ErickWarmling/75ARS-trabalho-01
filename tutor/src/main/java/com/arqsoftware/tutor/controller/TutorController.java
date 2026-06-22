package com.arqsoftware.tutor.controller;

import com.arqsoftware.tutor.model.dto.TutorDTO;
import com.arqsoftware.tutor.service.TutorService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api")
public class TutorController {

    private static final Logger log = LoggerFactory.getLogger(TutorController.class);

    @Autowired
    private TutorService tutorService;

    @GetMapping("/tutores")
    public List<TutorDTO> getAllTutores() {
        log.info("[tutor-api] GET /tutores");
        return tutorService.getAllTutores();
    }

    @GetMapping("/tutores/{id}")
    public ResponseEntity<TutorDTO> getTutorById(@PathVariable Long id) {
        log.info("[tutor-api] GET /tutores/{}", id);
        return tutorService.getTutorById(id)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tutor não encontrada com o id: " + id));
    }

    @PostMapping("/tutores")
    public ResponseEntity<TutorDTO> addTutor(@RequestBody TutorDTO tutorDTO) {
        log.info("[tutor-api] POST /tutores - nome={}", tutorDTO.getNome());
        TutorDTO savedTutor = tutorService.saveTutor(tutorDTO);
        return new ResponseEntity<>(savedTutor, HttpStatus.CREATED);
    }

    @PutMapping("/tutores/{id}")
    public ResponseEntity<TutorDTO> editTutor(@PathVariable Long id, @RequestBody TutorDTO tutorDTO) {
        tutorService.getTutorById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tutor não encontrado com o id: " + id));

        tutorDTO.setId(id);
        TutorDTO updateTutor = tutorService.updateTutor(tutorDTO);
        return ResponseEntity.ok(updateTutor);
    }

    @DeleteMapping("/tutores/{id}")
    public ResponseEntity<Void> deleteTutor(@PathVariable Long id) {
        if (tutorService.getTutorById(id).isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Tutor não encontrado com o id: " + id);
        }

        tutorService.deleteTutor(id);
        return ResponseEntity.noContent().build();
    }
}