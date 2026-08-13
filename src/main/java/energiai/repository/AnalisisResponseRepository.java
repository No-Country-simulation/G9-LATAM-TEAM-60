package energiai.repository;

import energiai.model.AnalisisEnergeticoResponseEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AnalisisResponseRepository extends JpaRepository<AnalisisEnergeticoResponseEntity, Long> {

    @Query("SELECT r FROM AnalisisEnergeticoResponseEntity r JOIN FETCH r.request req WHERE req.user.id = :userId ORDER BY r.fechaCreacion DESC")
    List<AnalisisEnergeticoResponseEntity> findByUserIdWithRequestOrderByFechaCreacionDesc(@Param("userId") Long userId);

    @Query("SELECT r FROM AnalisisEnergeticoResponseEntity r JOIN FETCH r.request ORDER BY r.fechaCreacion DESC")
    List<AnalisisEnergeticoResponseEntity> findAllWithRequestOrderByFechaCreacionDesc();

    @Query("SELECT r FROM AnalisisEnergeticoResponseEntity r JOIN FETCH r.request WHERE r.id = :id")
    Optional<AnalisisEnergeticoResponseEntity> findByIdWithRequest(@Param("id") Long id);
}
