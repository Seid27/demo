package com.example.demo.student;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@AllArgsConstructor
@Service
public class StudentService {
    private final StudentRepository studentRepository;

    public List<Student> getAllStudents(){
        return studentRepository.findAll();
    }

    public void addStudent(Student student) {
        if (studentRepository.selectExistsEmail(student.getEmail())){
            System.out.println("student exists");
            throw new BadRequestException("Email is already exists");
        }
        else {
            studentRepository.save(student);
        }

    }

    public void deleteStudent(Long id){
        //todo: check if student exists

        if (studentRepository.existsById(id)){
            System.out.println("id exists");
            studentRepository.deleteById(id);
        }
        else{
            throw new StudentNotFoundException("Id does not exist");
        }

    }
}
