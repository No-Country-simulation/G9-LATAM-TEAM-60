package energiai.repository;

import energiai.model.Analisis;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnalisisRepository extends JpaRepository<Analisis, Long> {
    List<Analisis> findByUserIdOrderByFechaCreacionDesc(Long userId);
    List<Analisis> findAllByOrderByFechaCreacionDesc();
}
