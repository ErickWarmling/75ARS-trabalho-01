package com.arqsoftware.tutor.service;

import com.arqsoftware.tutor.model.Tutor;
import com.arqsoftware.tutor.model.dto.TutorDTO;
import com.arqsoftware.tutor.repository.TutorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TutorService {

    @Autowired
    private TutorRepository tutorRepository;

    /**
     * Método para converter um objeto da classe Tutor para TutorDTO
     * @param tutor
     * @return
     */
    public static TutorDTO convertToDTO(Tutor tutor) {
        return new TutorDTO(
                tutor.getId(),
                tutor.getNome(),
                tutor.getTelefone(),
                tutor.getEmail()
        );
    }

    /**
     * Método para converter um objeto da classe TutorDTO para Tutor
     * @param tutorDTO
     * @return
     */
    public Tutor convertFromDTO(TutorDTO tutorDTO) {
        Tutor tutor = new Tutor();
        tutor.setId(tutorDTO.getId());
        tutor.setNome(tutorDTO.getNome());
        tutor.setTelefone(tutorDTO.getTelefone());
        tutor.setEmail(tutorDTO.getEmail());
        return tutor;
    }

    public List<TutorDTO> getAllTutores() {
        List<Tutor> tutores = tutorRepository.findAll();
        return tutores.stream()
                .map(TutorService::convertToDTO)
                .collect(Collectors.toList());
    }

    public Optional<TutorDTO> getTutorById(Long id) {
        Optional<Tutor> tutor = tutorRepository.findById(id);
        return tutor.map(TutorService::convertToDTO);
    }

    public TutorDTO saveTutor(TutorDTO tutorDTO) {
        Tutor savedTutor = tutorRepository.save(convertFromDTO(tutorDTO));
        return convertToDTO(savedTutor);
    }

    public TutorDTO updateTutor(TutorDTO tutorDTO) {
        Tutor updateTutor = tutorRepository.save(convertFromDTO(tutorDTO));
        return convertToDTO(updateTutor);
    }

    public void deleteTutor(Long id) {
        tutorRepository.deleteById(id);
    }
}
