package energiai.repository;

import energiai.dto.AnalisisEnergeticoRequest;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AnalisisRepository extends JpaRepository<AnalisisEnergeticoRequest, Long> {
}
