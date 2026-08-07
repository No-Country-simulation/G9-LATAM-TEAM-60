package energiai.repository;

import energiai.model.AnalisisEnergeticoRequestEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnalisisRequestRepository extends JpaRepository<AnalisisEnergeticoRequestEntity, Long> {
    List<AnalisisEnergeticoRequestEntity> findByUserIdOrderByFechaCreacionDesc(Long userId);
    List<AnalisisEnergeticoRequestEntity> findAllByOrderByFechaCreacionDesc();
}
